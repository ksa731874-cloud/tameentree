const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
