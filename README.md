# Job Application Tracker

A full-stack job application tracker with a Node.js/Express + MySQL API and a React/Vite frontend for managing applications, status changes, and account access.

## Features

- User registration, login, logout, session verification, and account deletion.
- JWT authentication stored in an `httpOnly` cookie.
- CRUD for job applications owned by the authenticated user.
- Application status updates across `applied`, `interview`, `accepted`, and `rejected`.
- Dashboard view that groups applications by status and supports drag-and-drop status changes.
- Zod-backed request validation for both user and application payloads.
- Rate limiting on auth routes and protected application routes.
- React/Vite frontend with protected routes, notifications, and application detail modals.

## Tech Stack

### Backend

- Node.js
- Express
- mysql2
- bcrypt
- cookie-parser
- cors
- helmet
- express-rate-limit
- jsonwebtoken
- zod
- jest

### Frontend

- React 19
- react-dom
- react-router-dom
- Vite
- @vitejs/plugin-react
- @rolldown/plugin-babel
- @tailwindcss/vite
- tailwindcss
- babel-plugin-react-compiler
- eslint
- @eslint/js
- @babel/core
- @types/react
- @types/react-dom
- globals

## Folder Structure

```text
.
├── Backend/
│   ├── .env.example
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   ├── application.js
│   │   └── user.js
│   ├── db/
│   │   ├── pool.js
│   │   └── schema.sql
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   ├── validation.js
│   │   └── verify.js
│   ├── queries/
│   │   ├── application.js
│   │   └── user.js
│   ├── routes/
│   │   ├── application.js
│   │   └── user.js
│   ├── schemas/
│   │   ├── applicationSchema.js
│   │   └── userSchema.js
│   ├── utils/
│   │   ├── cookie.js
│   │   ├── createError.js
│   │   └── jwt.js
│   ├── index.js
│   ├── package.json
│   └── readme.md
├── Frontend/
│   ├── .env.example
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── utils/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18 or newer
- npm
- MySQL-compatible database

### Backend

```bash
cd Backend
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

The backend starts with `npm start` in `Backend/` and reads `.env` with `node --env-file=.env index.js`. The frontend runs with Vite on the default dev port.

### Useful scripts

- Backend: `npm start`, `npm test`
- Frontend: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`

## Environment Variables

### Backend (`Backend/.env.example`)

| Variable | Description | Required |
| --- | --- | --- |
| `SECRET_KEY` | JWT signing secret used by `Backend/utils/jwt.js`. | Y |
| `PORT` | Server port. Defaults to `8000` in `Backend/config/env.js`. | N |
| `CLIENT_URL` | Allowed frontend origin used by CORS in `Backend/index.js`. | Y |
| `DB_HOST` | MySQL host. | Y |
| `DB_USER` | MySQL user. | Y |
| `DB_PASSWORD` | MySQL password. | Y |
| `DB_DATABASE` | MySQL database name. | Y |

Note: `Backend/db/pool.js` also reads `DB_CONNECTION_LIMIT` and defaults it to `20`, but that variable is not listed in `Backend/.env.example`, so it is marked as TODO to confirm.

### Frontend (`Frontend/.env.example`)

| Variable | Description | Required |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for the backend API used by `Frontend/src/lib/api.js`. | Y |

## API Endpoints

| Method | Path | Auth required | Description |
| --- | --- | --- | --- |
| GET | `/` | N | Health check that returns `server is running`. |
| POST | `/user/register` | N | Register a new user. |
| POST | `/user/login` | N | Authenticate a user and set the auth cookie. |
| POST | `/user/logout` | N | Clear the auth cookie. |
| GET | `/user/me` | Y | Verify the current authenticated session. |
| DELETE | `/user/me` | Y | Delete the authenticated user after password verification. |
| GET | `/application` | Y | List applications for the authenticated user. |
| POST | `/application` | Y | Create a new application for the authenticated user. |
| GET | `/application/:id` | Y | Fetch one application owned by the authenticated user. |
| PUT | `/application/:id` | Y | Update one application owned by the authenticated user. |
| DELETE | `/application/:id` | Y | Delete one application owned by the authenticated user. |
| PATCH | `/application/:id/status` | Y | Update the status of one application owned by the authenticated user. |

## Security Measures Implemented

- Passwords are hashed with `bcrypt` before storage.
- Auth uses JWTs signed with `SECRET_KEY` and stored in an `httpOnly` cookie.
- Cookie flags are set with `sameSite` and `secure` behavior based on `NODE_ENV`.
- Request payloads are validated with strict Zod schemas.
- Auth and application routes are rate-limited with `express-rate-limit`.
- SQL writes use parameterized MySQL queries with `?` placeholders.
- `helmet` and CORS are enabled in the Express app bootstrap.

## Roadmap / Planned

- Continue polishing the React/Vite frontend in `Frontend/` for production use.
- Confirm whether `DB_CONNECTION_LIMIT` should be documented in `Backend/.env.example`.
- No `TODO` or `FIXME` markers were found in the current codebase.

---
