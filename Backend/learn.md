11. Learning Advice

- Study secure multi-tenant authorization patterns, especially IDOR prevention.
- Learn robust input validation and schema-first API design.
- Learn HTTP semantics deeply (status codes, idempotency, 204 behavior).
- Study SQL injection beyond values, including dynamic identifiers and query builders.
- Learn clean architecture for Node backends: controller/service/repository.
- Learn observability fundamentals: structured logs, metrics, tracing.
- Learn production hardening for Express: rate limits, headers, CORS, secrets management.



12. Priority Fix List
CRITICAL

- Enforce ownership checks on update/delete/get operations using userId in WHERE clauses.
- Remove dynamic column interpolation from SQL; use strict allowlisted fields.
- Validate all request inputs with schema library.
- Fix REST contract mismatch for PUT /application/:id to use param id.
- Add login rate limiting and secure cookie flag for production.
- Add startup env validation and fail fast if required vars are missing.

IMPORTANT

Normalize response format and status code correctness across controllers.
Add pagination/filtering/sorting for application listing.
Add centralized error middleware and structured logging.
Configure CORS and security headers.
Add DB indexes for userId with createdAt/status.
NICE TO HAVE

Introduce service/repository layers.
Add API versioning and OpenAPI spec.
Add graceful shutdown and readiness checks.
Build test suite with integration tests for auth and application ownership boundaries.













You are a resume writer helping a fresher backend developer create an ATS-friendly, 
recruiter-approved project description for a software engineering resume.

Here is raw information about my project:

PROJECT NAME: Job Application Tracker
PURPOSE: Job seekers lose track of where they applied, what stage each application 
is in, and what follow-ups are pending. This app centralizes all job 
applications in one place with status tracking and authentication so 
only the user can see their own data.
TECH STACK: Node.js, Express.js, MySQL, JWT, bcrypt, Zod, React and tailwindcss
FEATURES BUILT: 
- User registration and login with JWT stored in httpOnly cookies
- Password hashing with bcrypt
- Add a new job application 
- Update application status (Applied → Interview → Offer → Rejected)
- Delete an application
- View all applications for the logged-in user only
- Input validation on all routes using Zod
- Protected routes — unauthenticated users cannot access application data
- MySQL database with connection pooling
- MVC folder structure (routes, controllers, models separated)
- Parameterized queries to prevent SQL injection
- React frontend 
ANY NUMBERS YOU HAVE: 10 end points and find other numbers by yourself
WHAT WAS HARD: cors and error handling
DEPLOYMENT:  Local only

Your job:
1. Write 3-4 bullet points for this project for a resume.
2. Each bullet must start with a strong action verb.
3. Include at least 2 quantifiable metrics (even estimated ones are fine — just realistic).
4. Use exact ATS-friendly tech keywords (no abbreviations).
5. One bullet must highlight a technical decision or problem solved (not just a feature).
6. Keep each bullet under 20 words.
7. Then write a 1-line project headline/title description (like what goes under the project name).
8. Make it sound like a developer who understands WHY they built things, not just what they built.







Act as a senior frontend developer and refactor my existing frontend to production quality. Improve only the frontend, without changing the backend API contract unless absolutely necessary. Write the code in a clean, scalable, minimal, and professional way.

Your goal is to make the frontend feel like it was designed and built by an experienced engineer with strong UI, UX, React, and performance knowledge.

Follow these requirements strictly:

### 1. Overall goal
Upgrade the frontend so it feels polished, fast, minimal, and easy to use.
The result should look modern but not flashy.
Prefer a minimalistic layout, strong spacing, consistent typography, clear visual hierarchy, and smooth interaction feedback.
Every user action should produce a visible result or response. 

### 2. UI and UX
Improve the full UI and UX with these rules:
- Keep the interface clean and minimal
- Maintain consistent spacing, alignment, colors, button styles, inputs, cards, and typography
- Create a clear visual hierarchy so the user knows what is important first
- Remove clutter and avoid unnecessary decorations
- Make forms, tables, cards, filters, modals, and navigation easy to scan
- Use clear empty states, loading states, success states, and error states
- Make destructive actions obvious and safe
- Improve accessibility with proper labels, focus states, semantic HTML, and keyboard friendly interactions
- Ensure the design is responsive on mobile, tablet, and desktop
- Keep the experience smooth and intuitive for real users, not just visually good

### 3. Feedback for every action
For every meaningful user action, show proper feedback:
- Button click feedback
- Loading indicators while requests are in progress
- Success message when an action completes
- Error message when something fails
- Inline validation for forms
- Disabled states when actions should not run
- Empty state when no data is available
- Skeleton or placeholder state when content is loading
- Confirmation for delete or irreversible actions
- Optimistic UI updates where appropriate, but keep data safe and rollback on failure if needed [dev](https://dev.to/zeeshanali0704/frontend-system-design-css-javascript-ui-optimization-performance-bb2)

Examples:
- On form submit, show submitting state, then success or error
- On delete, ask confirmation, show pending state, then remove item with success feedback
- On fetch, show skeleton loader instead of blank space
- On retry, clearly show that the retry is happening

### 4. Code quality
Refactor the frontend code to follow senior level standards:
- Keep components small and focused
- Split large components into reusable presentational and logic based parts
- Remove repeated code and create reusable components where useful
- Use clear and meaningful names for components, variables, functions, props, and files
- Remove dead code, commented code, unused imports, and console logs
- Replace hardcoded values with constants or config where appropriate
- Keep folder and file structure clean and scalable
- Match consistent code style across the project
- Make the code easy to understand and maintain after 6 months [community.ibm](https://community.ibm.com/community/user/blogs/marina-mascarenhas/2025/07/15/code-review-checklist-for-javascriptreact)

### 5. Correct React hooks usage
Use React hooks properly and only where needed:
- Call hooks only at the top level
- Never call hooks conditionally
- Keep each effect focused on one concern
- Always use correct dependency arrays
- Add cleanup for timers, subscriptions, and listeners
- Extract reusable logic into custom hooks
- Use custom hooks when logic is repeated or complex
- Do not overuse useMemo or useCallback
- Use useMemo and useCallback only when there is a real render or computation benefit
- Keep business logic out of bulky UI components when possible [uxpin](https://www.uxpin.com/studio/blog/react-hooks/)

### 6. Performance and optimization
Optimize the frontend without making the code harder to maintain:
- Prevent unnecessary re renders
- Keep state as local as possible
- Avoid prop drilling where cleaner patterns exist
- Use lazy loading or code splitting where useful
- Use memoization only for real bottlenecks
- Keep the DOM structure simple
- Optimize large lists or heavy sections if needed
- Use efficient event handling
- Prefer transform and opacity for animations
- Avoid expensive rendering patterns
- Make the UI feel fast even before the backend responds fully 

### 7. State handling
Improve state management with clean patterns:
- Separate server state, form state, and UI state properly
- Avoid messy and deeply nested state
- Keep loading, success, and error states explicit
- Ensure state transitions are predictable
- Prevent race conditions and inconsistent UI
- Make async flows easy to read and safe

### 8. Deliverables
While refactoring, provide:
- Improved production ready frontend code
- Better component structure
- Better UX states for loading, success, error, and empty data
- Correct hook usage
- Performance improvements
- Cleaner styling and consistent design system
- Short explanation of major improvements made
- Notes for any tradeoffs or optional future improvements

### 9. Output format
Give the result in this format:
1. Summary of problems in the current frontend
2. Refactoring plan
3. Improved code
4. Explanation of UI and UX improvements
5. Explanation of hook and performance improvements
6. Optional next improvements

Important:
- Do not overengineer
- Do not add unnecessary libraries
- Do not break existing functionality
- Keep the code practical and production ready
- Prioritize clarity, maintainability, responsiveness, accessibility, and user feedback

While refactoring, think like a reviewer who cares about maintainability, user feedback, performance, accessibility, and clean architecture more than fancy visuals.