# Event Management System - Frontend

React + Vite frontend for the Event Management System.

## Technologies

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **React Router** — Client-side routing
- **Axios** — HTTP client

## Getting Started

### Prerequisites

- Node.js installed
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
```

See `.env.example` for reference.

### Running the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Features

- User authentication (login/register)
- Browse and search events
- Create, edit, and delete events
- Register for events
- View your events and registrations
- Responsive design

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components (Navbar, ProtectedRoute)
│   ├── pages/          # Page components
│   ├── services/       # Axios API client
│   ├── context/        # AuthContext for authentication state
│   ├── App.jsx         # Main app with routes
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json
```
