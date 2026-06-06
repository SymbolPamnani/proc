# MiniHelpDesk Project

A full-stack MiniHelpDesk ticket application built with React + TypeScript, Express + TypeScript, and MongoDB.

## Features
- List tickets with backend pagination
- Search tickets by subject and description
- Create new tickets using a controlled form
- Delete tickets individually
- Shared reusable frontend components
- Basic loading and error states
- End-to-end local integration with MongoDB

## Group Members
- Adeena Arain
- Symbol Rani

## Technologies
- React + TypeScript + Vite
- Express + TypeScript
- MongoDB + Mongoose
- Fetch API for frontend-backend communication

## Installation

### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Environment Variables
Create a `.env` file in `backend/` with:

```
MONGO_URI=mongodb://2312184_db_user:symeena605@ac-tpg0kop-shard-00-00.vhlus9m.mongodb.net:27017,ac-tpg0kop-shard-00-01.vhlus9m.mongodb.net:27017,ac-tpg0kop-shard-00-02.vhlus9m.mongodb.net:27017/miniticketdb?ssl=true&replicaSet=atlas-dqvd6r-shard-0&authSource=admin&retryWrites=true&w=majority
PORT=4000
```

## Running the App
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

The frontend will call the backend APIs at `http://localhost:4000`.

## Implemented Extra Features
- Backend pagination (`GET /tickets?page=1&limit=5`)
- Reusable frontend components (`Button`, `Input`, `Card`)

## Notes
- Ensure MongoDB is running locally or update `MONGO_URI` to a valid MongoDB connection.
- The app supports creating, listing, and deleting tickets.