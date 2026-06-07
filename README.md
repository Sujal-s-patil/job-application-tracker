# Job Application Tracker

A full-stack web application to track job applications, manage application statuses, and store employer/contact information. This repository contains a Node.js + Express backend and a React + Vite frontend.

**Status:** Prototype / in active development

---

**Contents**
- **Backend/**: Express API, authentication, and database access
- **Frontend/**: React (Vite) single-page app
- **planning.md**: Project planning notes

---

**Quick Start**

Prerequisites:
- Node.js 18+ and npm
- A MySQL-compatible database (or update `Backend/db/sql.js` to use another driver)

Clone and run locally (two terminals):

Backend

```bash
cd Backend
npm install
# create a .env file (see example below)
npm start      # starts server with node
# for hot-reload (nodemon) use: npm run test
```

Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open the frontend at http://localhost:5173 (default Vite port). The backend runs on port `8000` by default.

---

**Environment variables (Backend .env example)**

Create `Backend/.env` with these keys (example):

```
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_DATABASE=job_tracker
DB_CONNECTION_LIMIT=20
SECRET_KEY=replace_with_strong_secret
```

Notes:
- The backend reads database connection settings from `process.env` in `Backend/db/sql.js`.
- JWTs use `SECRET_KEY` (see `Backend/utils/jwt.js`).
- Authentication uses an HTTP cookie named `token` (see `Backend/middleware/verify.js`).

---

**API Overview**

Base URL: `http://localhost:8000`

Auth / User
- POST `/user/register` — register a new user (body validated by Zod)
- POST `/user/login` — login and set auth cookie
- GET `/user/logout` — clear auth cookie
- GET `/user/verify` — verify current user (requires cookie)

Applications (protected — requires auth cookie)
- GET `/application/` — list applications
- POST `/application/` — create a new application
- GET `/application/:id` — fetch single application
- PUT `/application/:id` — update application
- DELETE `/application/:id` — delete application

Validation is implemented with Zod schemas found in `Backend/schemas/`.

Example: register with curl

```bash
curl -X POST http://localhost:8000/user/register \
	-H "Content-Type: application/json" \
	-d '{"firstName":"Alice","lastName":"Lee","email":"alice@example.com","password":"P@ssw0rd"}'
```

---

**Repository Structure**

- `Backend/` — Express server and API
	- `controllers/` — route handlers
	- `routes/` — route definitions
	- `schemas/` — request validation schemas
	- `db/` — database connection helper (`sql.js`)
	- `middleware/` — `validation.js`, `verify.js`
	- `utils/` — `jwt.js` helper
- `Frontend/` — React + Vite application
	- `src/pages/` — page-level components
	- `src/components/` — shared components
	- `src/utils/` — client helpers (e.g., `auth.js`)

---

**Tech Stack**

- Backend: Node.js, Express, mysql2, Zod, jsonwebtoken
- Frontend: React, Vite, react-router-dom

---

**Development Notes & Conventions**

- CORS is currently configured to allow `http://localhost:5173` (Vite dev server) in `Backend/index.js`.
- Auth is cookie-based: the server sets a `token` cookie; the frontend must include credentials in fetch requests.

Example fetch using credentials (frontend):

```js
fetch('http://localhost:8000/application', {
	credentials: 'include'
})
```

---

**Testing & Linting**

- Frontend: run `npm run lint` from `Frontend/` (project contains ESLint config).
- Backend: there are no automated tests included; nodemon can be used for local development (`npm run test` in `Backend/` uses nodemon).

---

**Deployment**

Minimal production steps:

1. Build frontend: `cd Frontend && npm run build`.
2. Serve static build with a static host (Netlify, Vercel) or serve from the backend using a static middleware.
3. Run the backend with a process manager (PM2, systemd) and set environment variables for production database and `SECRET_KEY`.

Considerations:
- Use HTTPS in production and secure cookie attributes (`httpOnly`, `secure`, `sameSite`).
- Rotate `SECRET_KEY` and use a secrets manager for production credentials.

---

**Contribution Guidelines**

- Fork the repository and create feature branches.
- Open PRs against `main` with a clear description and testing steps.
- Follow consistent linting and code style. Add unit/integration tests where appropriate.

If you'd like, I can add a `CONTRIBUTING.md` template.

---
