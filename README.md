# Event Management System

Backend and frontend application for managing events.

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### Frontend
- React
- Vite
- Axios
- React Router

## Project Structure

```text
backend/   → Node.js + Express API
frontend/  → React application
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

Create a `backend/.env` file (see `backend/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and communicates with the API at `http://localhost:5000/api`.
