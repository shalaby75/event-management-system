# Event Management System

A RESTful API for managing events, categories, and user registrations built with Node.js, Express, and MongoDB.

## Description

This is a backend API for an event management system where users can create events, categorize them, and register for events with capacity limits. The system uses JWT for authentication and bcrypt for password hashing.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete events
- Categorize events
- Register for events with capacity enforcement
- Filter and search events by location, category, and text
- Input validation on all endpoints
- Centralized error handling
- Password hashing with bcryptjs
- Protected routes with JWT middleware

## Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **express-validator** - Input validation

## Architecture

The project follows a layered architecture:

```
Routes -> Controllers -> Models -> Database
```

- **Routes** define the API endpoints and middleware chain
- **Controllers** handle request/response logic
- **Models** define the data schema and database operations
- **Middlewares** handle cross-cutting concerns (auth, validation, errors)

## Folder Structure

```
src/
|-- config/
|   `-- db.js              # MongoDB connection
|-- controllers/
|   |-- authController.js  # Register & login logic
|   |-- eventController.js # Event CRUD logic
|   |-- categoryController.js # Category logic
|   `-- registrationController.js # Registration logic
|-- models/
|   |-- User.js            # User schema
|   |-- Event.js           # Event schema
|   |-- Category.js        # Category schema
|   `-- Registration.js    # Registration schema
|-- routes/
|   |-- authRoutes.js      # /api/auth/*
|   |-- eventRoutes.js     # /api/events/*
|   |-- categoryRoutes.js  # /api/categories/*
|   `-- registrationRoutes.js # /api/events/:eventId/register
|-- middlewares/
|   |-- authMiddleware.js  # JWT verification
|   |-- errorMiddleware.js # Centralized error handling
|   `-- validationMiddleware.js # Validation result checker
|-- validators/
|   |-- authValidator.js   # Auth input rules
|   |-- eventValidator.js  # Event input rules
|   `-- categoryValidator.js # Category input rules
|-- app.js                 # Express app setup
`-- server.js              # Server entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (see Environment Variables)
4. Make sure MongoDB is running locally or update `MONGO_URI` in `.env`

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

See `.env.example` for reference.

## Running the Server

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

The server will start on the port specified in `.env` (default: 5000).

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get JWT | No |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/categories | Create a category | No |
| GET | /api/categories | Get all categories | No |

### Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/events | Create an event | Yes |
| GET | /api/events | Get all events (with filters) | No |
| GET | /api/events/:id | Get event by ID | No |
| PUT | /api/events/:id | Update an event | Yes (creator) |
| DELETE | /api/events/:id | Delete an event | Yes (creator) |

### Registrations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/events/:eventId/register | Register for an event | Yes |
| GET | /api/events/:eventId/registrations | Get event registrations | No |

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To get a token:
1. Register a user via `POST /api/auth/register`
2. Login via `POST /api/auth/login`
3. Use the returned token in the Authorization header

## Example Requests

### Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create an Event
```bash
POST /api/events
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Node.js Workshop",
  "description": "Learn Node.js basics",
  "date": "2026-12-01T10:00:00.000Z",
  "location": "Cairo",
  "capacity": 50,
  "category": "<category_id>"
}
```

### Filter Events
```bash
GET /api/events?location=Cairo&search=node
```

### Register for an Event
```bash
POST /api/events/<event_id>/register
Authorization: Bearer <token>
```

## Testing

A Postman collection is included in the project root:
- File: `event-management-postman-collection.json`
- Import it into Postman
- Set the `token` collection variable after login
- Replace placeholder IDs with actual values from your database

## Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "..."
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

## License

ISC
