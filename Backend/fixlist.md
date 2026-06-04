# Backend Upgrade Plan to Reach 8+/10 in Every Category

This plan is designed to move your backend from MVP quality to production-ready quality.
It includes what to fix, how to fix it, suggested tools, acceptance criteria, and verification steps.

## Score Targets

| Category | Current (estimated) | Target |
|---|---:|---:|
| Architecture | 5 | 8.5 |
| Security | 3 | 8.5 |
| Performance | 5 | 8 |
| Code Quality | 5 | 8.5 |
| Scalability | 4 | 8 |

---

## Ground Rule on SELECT *

Your note is valid: if you intentionally need all user columns now, SELECT * can work in development.

Recommended production method:
- Keep SELECT * only if you control schema changes tightly and never return raw row directly to clients.
- Better long-term: explicit projection (safer, clearer) and a mapper function for API response.

Practical compromise:
- Database query can read all columns if needed internally.
- API response must always pass through a safe mapper to avoid accidental leaks.

---

## Phase 1 - Critical Security and Correctness (Do first)

### 1) Enforce record ownership on update and delete
Files:
- controllers/application.js

Problem:
- delete and update are not scoped by userId.

Method:
- For delete: WHERE id = ? AND userId = ?
- For update: use route param id, not req.body.id; WHERE id = ? AND userId = ?

Acceptance criteria:
- User A cannot update/delete User B records.
- API returns 404 when record does not exist for that user.

Test cases:
- Authenticated user updates own record: 200
- Authenticated user updates another user record: 404
- Authenticated user deletes another user record: 404

Status: TODO
Impact: Security, Data integrity

### 2) Remove dynamic SQL key injection risk
Files:
- controllers/application.js

Problem:
- Query columns are built from req.body keys directly.

Method:
- Use allowlist columns:
	- title
	- roleApplied
	- jobDescription
	- applicationStatus
	- noteForApplied
	- noteForInterview
	- noteForAccepted
	- noteForRejected
- Reject unknown keys with 400.

Acceptance criteria:
- Unknown fields fail validation.
- No raw req.body keys are injected into SQL identifiers.

Status: TODO
Impact: Security

### 3) Add request validation with schema library
Files:
- controllers/user.js
- controllers/application.js
- middleware/validation.js (new)
- schemas/user.js (new)
- schemas/application.js (new)

Recommended library:
- zod

Method:
- Validate body, params, query before controllers.
- Return 400 with normalized validation error format.

Minimum rules:
- email: valid format
- password: min 8 chars
- firstName/lastName: non-empty, trim
- id param: positive integer
- applicationStatus: enum values only

Acceptance criteria:
- Invalid payload never reaches DB query execution.
- Validation errors have consistent structure.

Status: TODO
Impact: Security, Stability, Code quality

### 4) Add startup config validation (fail fast)
Files:
- config/env.js (new)
- index.js
- db/sql.js
- utils/jwt.js

Method:
- Validate required env vars at startup:
	- PORT
	- DB_HOST
	- DB_USER
	- DB_PASSWORD
	- DB_DATABASE
	- SECRET_KEY
	- NODE_ENV
- Exit process with clear error if missing.

Acceptance criteria:
- App cannot start with broken config.

Status: TODO
Impact: Production reliability

### 5) Harden authentication flow
Files:
- controllers/user.js
- routes/user.js

Method:
- Add cookie secure flag in production.
- Add rate limiting to /user/login.
- Keep generic credential error message to avoid account enumeration.

Recommended packages:
- express-rate-limit
- helmet

Suggested limits:
- 5 login attempts/IP/15 min

Acceptance criteria:
- Repeated brute force from same IP is throttled (429).

Status: TODO
Impact: Security

---

## Phase 2 - Architecture and Maintainability (Move to 8+)

### 6) Introduce service and repository layers
Files/folders (new):
- services/userService.js
- services/applicationService.js
- repositories/userRepository.js
- repositories/applicationRepository.js

Method:
- Controller only handles req/res.
- Service handles business logic.
- Repository handles SQL.

Acceptance criteria:
- Controllers become thin and testable.
- SQL is centralized and reusable.

Status: TODO
Impact: Architecture, Maintainability, Scalability

### 7) Standardize API response contract
Files:
- utils/response.js (new)
- all controllers

Method:
- Success shape:
	- success: true
	- data
	- message (optional)
- Error shape:
	- success: false
	- error: { code, message, details? }

Acceptance criteria:
- All endpoints return consistent JSON envelope.

Status: TODO
Impact: API quality, Client integration

### 8) Add centralized error middleware
Files:
- middleware/errorHandler.js (new)
- index.js

Method:
- Throw/next errors in controllers/services.
- Single error middleware handles status code and response shape.

Acceptance criteria:
- No duplicated catch response code logic across controllers.
- Unexpected errors always return 500 with standard format.

Status: TODO
Impact: Debuggability, Code quality

---

## Phase 3 - Performance and Scalability

### 9) Add pagination, sorting, filtering for applications list
Files:
- controllers/application.js
- routes/application.js

Method:
- Support query params:
	- page
	- limit
	- status
	- sortBy
	- sortOrder
- Add LIMIT/OFFSET with validated values.

Acceptance criteria:
- Large user dataset does not return all rows at once.
- Response includes pagination metadata.

Status: TODO
Impact: Performance, Scalability

### 10) Optimize DB indexes and query patterns
Database changes:
- applications: INDEX idx_user_created (userId, createdAt)
- applications: INDEX idx_user_status (userId, applicationStatus)
- users: UNIQUE INDEX on email (already present)

Method:
- Add migration script and apply in controlled manner.

Acceptance criteria:
- Application list queries remain fast as data grows.

Status: TODO
Impact: Performance

### 11) Add pool and timeout tuning
Files:
- db/sql.js

Method:
- Configure connectionLimit, waitForConnections, queueLimit.
- Add statement/query timeout strategy.

Acceptance criteria:
- Better behavior under load and fewer connection spikes.

Status: TODO
Impact: Performance, Reliability

---

## Phase 4 - Production Readiness

### 12) Add logging and request correlation
Files:
- utils/logger.js (new)
- middleware/requestId.js (new)
- index.js

Recommended package:
- pino

Method:
- Structured JSON logs.
- Include requestId, route, status, latency.
- Never log passwords or tokens.

Acceptance criteria:
- Each error can be traced end-to-end via requestId.

Status: TODO
Impact: Operability

### 13) Add health and readiness endpoints
Files:
- routes/health.js (new)
- index.js

Method:
- /health: process alive
- /ready: DB connection check

Acceptance criteria:
- Infrastructure can detect unhealthy instances.

Status: TODO
Impact: Production operations

### 14) Add security headers and CORS policy
Files:
- index.js

Method:
- helmet with safe defaults
- cors configured with explicit allowed origins

Acceptance criteria:
- Browser clients only from trusted origins.
- Baseline hardening headers present.

Status: TODO
Impact: Security

---

## Phase 5 - Testing to Sustain 8+ Scores

### 15) Add automated tests for critical flows
Files/folders:
- tests/auth.test.js (new)
- tests/application.test.js (new)
- tests/helpers (new)

Recommended stack:
- vitest
- supertest

Minimum coverage goals:
- Authentication success/failure paths
- Ownership enforcement paths
- Validation errors
- CRUD success + not found behavior

Acceptance criteria:
- At least 80% coverage on controllers/services.
- CI runs tests on every push.

Status: TODO
Impact: Maintainability, Regression safety

---

## Implementation Order and Time Estimates

Week 1:
- Steps 1-5 (security and correctness)
- Estimated: 1.5 to 2 days

Week 2:
- Steps 6-8 (architecture and error handling)
- Estimated: 2 to 3 days

Week 3:
- Steps 9-11 (performance and db)
- Estimated: 1 to 2 days

Week 4:
- Steps 12-15 (ops and tests)
- Estimated: 2 to 3 days

---

## Definition of Done (for 8+ score confidence)

- Security:
	- No IDOR on protected resources
	- Validation on all inputs
	- Login rate limiting active
	- Cookies hardened

- Architecture:
	- Controllers thin
	- Service and repository layers in place

- Performance:
	- Paginated list endpoints
	- Required indexes added
	- Pool tuned

- Code quality:
	- Consistent response envelope
	- Consistent status code behavior
	- No duplicated error handling logic

- Scalability:
	- Health/readiness endpoints
	- Structured logging
	- Automated tests with 80%+ coverage in critical modules

---

## Quick Tracker

| # | Task | Priority | Status |
|---|---|---|---|
| 1 | Ownership checks on update/delete | CRITICAL | TODO |
| 2 | Remove dynamic SQL key injection | CRITICAL | TODO |
| 3 | Add schema validation | CRITICAL | TODO |
| 4 | Fail-fast env validation | CRITICAL | TODO |
| 5 | Harden login and cookies | CRITICAL | TODO |
| 6 | Add service/repository layers | IMPORTANT | TODO |
| 7 | Standardize API response shape | IMPORTANT | TODO |
| 8 | Centralized error middleware | IMPORTANT | TODO |
| 9 | Pagination/filtering/sorting | IMPORTANT | TODO |
| 10 | Add DB indexes | IMPORTANT | TODO |
| 11 | Tune DB pool/timeouts | IMPORTANT | TODO |
| 12 | Structured logging + requestId | IMPORTANT | TODO |
| 13 | Health/readiness endpoints | IMPORTANT | TODO |
| 14 | Helmet + CORS policy | IMPORTANT | TODO |
| 15 | Automated tests + CI | IMPORTANT | TODO |