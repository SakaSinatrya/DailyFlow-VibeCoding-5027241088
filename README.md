# DailyFlow

A full-stack application for tracking personal expenses and daily tasks. The frontend is built with Next.js 16 + TypeScript, while the backend exposes a REST API built on Express, MongoDB, and JWT authentication.

## Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer

## Prerequisites
- Node.js 18+
- PNPM 9+ (or npm/yarn) for the frontend
- npm for the backend
- A running MongoDB instance (local or cloud)

## Environment Variables

### Backend
1. Copy the sample file and edit it:
       cd backend
       cp env.example .env
2. Update the values:
   - PORT – API port (default 4000)
  - MONGODB_URI – Mongo connection string
  - JWT_SECRET – strong secret for JWT
  - FRONTEND_URL – comma separated list of allowed origins (e.g. http://localhost:3000)
  - UPLOAD_DIR – directory for uploaded files (default uploads)

### Frontend
1. Copy the example file:
       cd frontend
       cp .env.local.example .env.local
2. Set NEXT_PUBLIC_API_URL so it points to the backend API (default http://localhost:4000/api).

## Running the Project

### Backend API
       cd backend
       npm install
       npm run dev
The API listens on http://localhost:4000 by default.

### Frontend App
       cd frontend
       pnpm install   # or npm install
       pnpm dev       # or npm run dev / yarn dev
The web app runs on http://localhost:3000 and calls the API URL configured above.

## Features
- JWT authentication (register, login, logout, protected profile endpoints)
- Expense CRUD with filtering, summaries, and file uploads
- Task management (create, toggle completion, daily & weekly summaries)
- Combined dashboard overview fed by /overview
- Local file uploads served from /uploads

## MongoDB with Docker
       docker run -d --name mongo -p 27017:27017 mongo:7
Then set MONGODB_URI=mongodb://localhost:27017/dailyflow (or your preferred database name).

## Suggested Verification Flow
1. Start MongoDB.
2. Run the backend (`cd backend` then `npm run dev`).
3. Run the frontend (`cd frontend` then `pnpm dev`).
4. Visit http://localhost:3000, register a user, then add expenses/tasks.
5. Confirm the API status at http://localhost:4000/api/health.

Happy hacking!
