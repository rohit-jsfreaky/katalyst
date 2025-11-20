# Katalyst Frontend

A modern, aesthetic React application built with Vite and Tailwind CSS v4, designed to demonstrate seamless Google Calendar integration using the Model Context Protocol (MCP) via Composio.

## 🚀 Features

- **Modern UI/UX**: Dark mode, glassmorphism effects, and smooth animations.
- **Google Authentication**: Secure login flow integrated with the backend.
- **Smart Dashboard**: 
  - Visualizes "Upcoming" vs "Past" trips/events.
  - Pagination for event lists.
  - Real-time sync status indicators.
- **Composio Integration**: Connects to Google Calendar via MCP for intelligent context gathering.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Heroicons (SVG)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `frontend` folder:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── api/            # API integration (Auth, Composio)
├── components/     # Reusable UI components (Dashboard, EventList, LandingPage)
├── pages/          # Page controllers (CalendarPage)
├── App.jsx         # Main application wrapper
└── index.css       # Global styles & Tailwind configuration
```
