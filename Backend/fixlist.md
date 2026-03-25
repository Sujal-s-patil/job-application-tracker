# Backend Auth Priority Fix List

## CRITICAL - Must Fix Before Public Release

### 1. Fix Register Input Validation Logic
**File:** `controllers/user.js` line 6
**Current Issue:** Field check uses AND logic, allowing requests with partial fields
**Status:** ⬜ TODO
**Effort:** 5 mins
**Impact:** Security + Data Integrity

### 2. Add Proper Payload Validation
**Files:** `controllers/user.js` lines 6, 24
**Required Validations:**
- Email format validation (valid email syntax)
- Password minimum length (8+ chars recommended)
- firstName/lastName non-empty strings
**Status:** ⬜ TODO
**Effort:** 30 mins
**Impact:** Security + Data Quality
**Suggested Tool:** Use `joi` or `zod` library

### 3. Fix Login Error Handling (Empty Catch Block)
**File:** `controllers/user.js` line 56
**Current Issue:** Catch block is empty, requests can hang
**Must Return:** 500 status with success false and generic message
**Status:** ⬜ TODO
**Effort:** 10 mins
**Impact:** Production Stability

### 4. Differentiate Register Errors
**File:** `controllers/user.js` line 18
**Current Issue:** All errors map to "user already exist"
**Must Distinguish:**
- Duplicate email → 409 conflict
- DB/server issues → 500 internal error
**Status:** ⬜ TODO
**Effort:** 15 mins
**Impact:** Error Diagnosis + Client Handling

### 5. Harden Auth Cookie for Production
**File:** `controllers/user.js` line 49
**Add:** `secure: process.env.NODE_ENV === 'production'`
**Verify:** httpOnly true, sameSite strict, maxAge explicit
**Status:** ⬜ TODO
**Effort:** 5 mins
**Impact:** Security (XSS + CSRF Prevention)

### 6. Optimize Login Query
**File:** `controllers/user.js` line 29
**Current:** `select * from users`
**Change To:** `select id, firstName, lastName, email, password from users`
**Reason:** Fetch only needed columns, prevent accidental data leak
**Status:** ⬜ TODO
**Effort:** 3 mins
**Impact:** Performance + Security

### 7. Add Startup Config Validation
**Files:** `utils/jwt.js` line 2, `index.js` 
**Must Check at App Start:**
- SECRET_KEY exists and non-empty
- DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE all exist
**Action:** Throw error immediately if missing
**Status:** ⬜ TODO
**Effort:** 20 mins
**Impact:** Production Reliability

---

## IMPORTANT - Do Before Moving to Applications API

### 8. Add Login Rate Limiting
**File:** `routes/user.js` line 7
**Recommended:** 
- Max 5 attempts per IP per 15 mins
- Max 3 attempts per email per 15 mins
**Tool:** Use `express-rate-limit` package
**Status:** ⬜ TODO
**Effort:** 30 mins
**Impact:** Security (Brute-force Protection)

### 9. Add Basic Error Logging
**Files:** `controllers/user.js` (all catch blocks)
**Current:** `console.log(error)` is unsafe
**Change To:** Structured logger that excludes sensitive values
**Optional Tools:** `pino` or `winston`
**Status:** ⬜ TODO
**Effort:** 45 mins
**Impact:** Debuggability + Monitoring

### 10. Update Database Schema
**File:** `work.md` (update table definition)
**Changes:**
- firstName VARCHAR(100) NOT NULL
- lastName VARCHAR(100) NOT NULL
- password VARCHAR(255) NOT NULL
- Add: `createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`
- Add: `updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
**Status:** ⬜ TODO
**Effort:** 10 mins
**Impact:** Data Integrity + Auditability

---

## NICE TO HAVE - After Auth is Stable

### 11. Add Auth Middleware
**Create:** `middleware/auth.js`
**Purpose:** Verify JWT token on protected routes
**Status:** ⬜ TODO
**Effort:** 20 mins
**Dependency:** Needed for applications API

### 12. Refactor into Service Layer
**Create:** `services/authService.js`
**Move:** register/login logic to service, keep controller thin
**Status:** ⬜ TODO
**Effort:** 1 hour
**Impact:** Testability + Maintainability

### 13. Add Unit Tests
**Create:** `tests/auth.test.js`
**Test Cases:**
- Valid register → 201
- Duplicate email → 409
- Invalid email → 400
- Valid login → 200
- Invalid password → 401
- Missing fields → 400
**Status:** ⬜ TODO
**Effort:** 2 hours
**Impact:** Confidence + Regression Prevention

---

## Suggested Implementation Order

**Phase 1 (Today):** Fixes 1-7 (Critical) ~90 mins
**Phase 2 (This Week):** Fixes 8-10 (Important) ~90 mins  
**Phase 3 (Next Week):** Start Applications API with Fix #11 needed first

---

## Quick Status Tracker

| Fix # | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | Input Validation Logic | ⬜ | |
| 2 | Payload Validation | ⬜ | |
| 3 | Login Error Handling | ⬜ | |
| 4 | Register Error Differentiation | ⬜ | |
| 5 | Cookie Hardening | ⬜ | |
| 6 | Query Optimization | ⬜ | |
| 7 | Config Validation | ⬜ | |
| 8 | Rate Limiting | ⬜ | |
| 9 | Error Logging | ⬜ | |
| 10 | DB Schema Updates | ⬜ | |

---

## Notes
- After completing Phase 1, you can safely start Applications API
- Fix #11 (Auth Middleware) must be done before applications API endpoints
- All critical fixes must be done before exposing to public/production