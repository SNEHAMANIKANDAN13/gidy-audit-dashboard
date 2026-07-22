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

## API Endpoints
- `POST /api/logs/upload` — Bulk insert logs. Body: `{ "logs": [...] }`
- `GET /api/logs` — Fetch logs with query params:
  - `page`, `limit` — pagination
  - `sort`, `order` — sorting (e.g. `sort=timestamp&order=desc`)
  - `search` — text search across actor, action, resource, ipAddress
  - `severity`, `status`, `action`, `region` — filters

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

### Why insertMany with ordered: false?
Bulk insert 10,000 records in a single DB call instead of looping individual inserts, which is significantly faster. Using `{ ordered: false }` ensures that if one record fails validation, the rest still get inserted instead of the whole batch failing.

### Why server-side pagination, filtering, and sorting?
Loading all 10,000 records to the browser and filtering/sorting client-side would be slow and memory-heavy. Instead, the server only returns the requested page (10 records at a time), with MongoDB doing the heavy lifting via query, sort, skip, and limit.

### Why indexes on filterable/sortable fields?
Fields like `severity`, `status`, `region`, `action`, and `timestamp` are indexed in the schema since these are the fields most frequently filtered and sorted on. Without indexes, MongoDB would need to scan all 10,000+ documents for every query, which doesn't scale.

### Why MongoDB?
Document-based storage made it straightforward to model audit log entries as JSON documents matching the given data shape, and Mongoose's schema validation (enums for severity/status) still enforces data integrity similar to SQL constraints.

### Why React + Vite?
Fast development build, hot module reload, and an optimized production bundle for a lightweight SPA dashboard.

## Folder Structure