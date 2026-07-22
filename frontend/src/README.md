# Gidy Audit Log Dashboard

A full-stack security audit log dashboard built with React, Node.js, Express, and MongoDB.

## Live Demo
- Frontend: https://gidy-audit-dashboard.vercel.app
- Backend: https://gidy-audit-dashboard-9rj2.onrender.com

## Features
- Bulk upload 10,000 audit log records in a single request
- View logs in a paginated table (server-side)
- Filter by Severity and Status
- Search by actor, action, resource
- Sort by any column (server-side)
- Upload JSON file from UI

## Tech Stack
- Frontend: React + Vite + Axios
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Setup Instructions

### Backend
```bash
cd backend
npm install
# Add .env file with MONGO_URI and PORT
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Technical Decisions

### Why insertMany?
Bulk insert 10,000 records in one DB call — faster than looping individual inserts.

### Why server-side pagination?
Loading 10,000 records at once crashes browser — server sends only 10 per page.

### Why MongoDB?
Schema-flexible for audit logs — different log types can have different fields.

### Why React + Vite?
Fast development build, hot reload, optimized production bundle.