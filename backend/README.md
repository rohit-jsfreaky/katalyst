# Katalyst Backend

The backend service for the Katalyst Demo, built with Node.js and Express. It handles user authentication via Google OAuth and manages the integration with Composio for Google Calendar access.

## 🚀 Features

- **Authentication**: Google OAuth 2.0 strategy using Passport.js.
- **Session Management**: Secure cookie-based sessions.
- **Composio Integration**: 
  - Manages connection requests to Google Calendar.
  - Fetches and buckets calendar events (Upcoming vs Past).
  - Handles MCP (Model Context Protocol) interactions.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Auth**: Passport.js (Google Strategy)
- **Integration**: Composio Core SDK
- **Utilities**: Dotenv, Cors

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with OAuth credentials.
- A Composio API Key.

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `backend` folder with the following variables:

   ```env
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your_super_secret_session_key

   # Composio Configuration
   COMPOSIO_API_KEY=your_composio_api_key

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Optional: Specific Composio Entity/Auth Config
   GOOGLE_CALENDAR_AUTH_CONFIG=your_auth_config_id
   ```

4. Start the server:
   ```bash
   npm run start
   ```
   
   The server will run on `http://localhost:5000`.

## 🔗 API Endpoints

### Authentication
- `GET /api/auth/google`: Initiates Google Login.
- `GET /api/auth/google/callback`: OAuth callback handler.
- `GET /api/auth/user`: Get current authenticated user.
- `GET /api/auth/logout`: Destroy session.

### Composio / Calendar
- `POST /api/composio/connect`: Initiate calendar connection.
- `GET /api/composio/status`: Check connection status.
- `GET /api/composio/events`: Fetch calendar events.
