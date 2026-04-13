# Complaint Register System (CRS)

A modern full-stack web application designed for students to raise and track college complaints, completely managed by an interactive Admin portal.

## Tech Stack
- **Frontend:** React, Vite (Glassmorphism minimalist UI styling)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## Setup Instructions

### 1. Database Configuration
Ensure PostgreSQL is installed locally and running on your machine.
Update your database configuration in `backend/.env`.

### 2. Install Dependencies
```bash
cd backend
npm install

cd frontend
npm install
```

### 3. Initialize Database
```bash
cd backend
npm run setup
```
This automatically structures your database and creates a default admin account.

### 4. Run Both Servers
You'll need two terminals.

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```
