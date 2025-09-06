# Book Library API

A simple REST API for managing a personal book library, built with Node.js, Express, TypeScript, and Prisma.

## Features

- **User Authentication**: Register, login, and profile management
- **Book Management**: CRUD operations for books
- **JWT Authentication**: Secure API endpoints
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Books

- `GET /api/books` - Get all user's books (protected)
- `GET /api/books/:id` - Get a specific book (protected)
- `POST /api/books` - Create a new book (protected)
- `PUT /api/books/:id` - Update a book (protected)
- `DELETE /api/books/:id` - Delete a book (protected)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/book_library?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=3000
   NODE_ENV=development
   ```

3. **Set up the database**:

   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Example Usage

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a book (with JWT token)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "pages": 180
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication & error handling
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── config/         # Database configuration
├── prisma/
│   └── schema.prisma   # Database schema
└── package.json
```
