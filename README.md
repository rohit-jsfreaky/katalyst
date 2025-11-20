# Katalyst Demo

**Katalyst** is a modern, full-stack application designed to demonstrate the power of **Contextual Intelligence** for calendars. It leverages **Composio** and the **Model Context Protocol (MCP)** to seamlessly connect, sync, and organize Google Calendar events into "Upcoming" and "Past" buckets, providing a foundation for AI-driven insights.

## 🏗️ Architecture

The project is organized as a monorepo with two main components:

- **`frontend/`**: A polished React application built with Vite and Tailwind CSS v4. It features a dark-mode aesthetic, glassmorphism effects, and a responsive dashboard.
- **`backend/`**: A Node.js/Express server that handles Google OAuth authentication and communicates with the Composio API to manage calendar connections and data retrieval.

## 🚀 Quick Start

Follow these steps to get the entire application running locally.

### 1. Backend Setup

Navigate to the backend folder, install dependencies, and start the server.

```bash
cd backend
npm install
# Create a .env file with your credentials (see backend/README.md)
npm run start
```
*The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup

Open a new terminal, navigate to the frontend folder, and start the development server.

```bash
cd frontend
npm install
# Create a .env file pointing to the backend (see frontend/README.md)
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 🔑 Key Features

- **Seamless Auth**: Google OAuth 2.0 integration.
- **Smart Sync**: Automatically fetches and categorizes calendar events.
- **Modern UI**: High-quality design with smooth animations and intuitive navigation.
- **MCP Integration**: Built on top of the Model Context Protocol for standardized tool usage.

## 📚 Documentation

For detailed installation instructions, environment variable configuration, and API documentation, please refer to the specific README files in each directory:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
