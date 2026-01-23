## Garden Buddy

Garden Buddy is a full-stack productivity app designed to help users organize and track their gardening activities. Users can create garden beds, add plants to each bed, and log care actions like watering or fertilizing. All data is tied to individual user accounts so each user only sees and manages their own information.

This project was built as part of a full-stack application course to demonstrate authentication, relational data modeling, and CRUD functionality across a React frontend and Flask backend.

## Features

- User authentication (register, login, logout)
- Session-based auth with protected routes
- Create, read, update, and delete:
- Garden beds
- Plants within beds
- Care logs for plants
- Pagination on list endpoints
- Data ownership enforced per user
- Simple, functional UI built with React

## Tech Stack

# Frontend

- React
- Vite
- JavaScript
- Fetch API

# Backend

- Flask
- SQLAlchemy
- Flask-Migrate
- SQLite

## Setup Instructions

# Backend

- cd server
- pipenv install
- pipenv run python app.py

The Flask API will run on:

http://127.0.0.1:5555

# Frontend

- cd client
- npm install
- npm run dev

The React app will run on:

http://localhost:5173

## API Overview

- All API routes are prefixed with /api.
- POST /api/register
- POST /api/login
- GET /api/check_session
- DELETE /api/logout
- GET /api/beds?page=1&per_page=10
- POST /api/beds
- PATCH /api/beds/:id
- DELETE /api/beds/:id
- POST /api/plants
- POST /api/plants/:plant_id/logs

All protected routes require a logged-in user and only return the authenticated user’s data.
