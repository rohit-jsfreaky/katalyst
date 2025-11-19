# Katalyst Backend

Backend server for Katalyst - AI-powered calendar intelligence platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173

# Session Secret (generate a random string for production)
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Google OAuth Credentials
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Composio API Key (for MCP integration)
# Get this from: https://app.composio.dev
COMPOSIO_API_KEY=your-composio-api-key-here

# Google Gemini API Key (for AI summaries)
# Get this from: https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
```

3. Run the development server:
```bash
npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (Passport, etc.)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares (auth, error handling)
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Main entry point
├── dist/                # Compiled JavaScript (generated)
└── package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout user

### Protected Routes
- `GET /api/protected/data` - Example protected endpoint (requires authentication)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env` file

