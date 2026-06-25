# Tree Insurance Backend

This backend service receives requests from the frontend and forwards them to the Telegram API.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file based on `.env.example` and fill in your Telegram credentials.

3. Start the server:

```bash
npm start
```

## API

- `POST /api/send-message`
  - body: `{ text: string, parse_mode?: string }`
  - returns Telegram response JSON
