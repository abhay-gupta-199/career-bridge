Project: Career Bridge (MERN)

This repository is a MERN (MongoDB, Express, React, Node) split-app with the frontend in `client/` (Vite + React + Tailwind) and the backend in `server/` (Express + Mongoose). The root `package.json` orchestrates dev scripts.

Quick facts
- Dev servers: frontend runs on port 3000 (Vite), backend on port 5000 (Express). The frontend proxies `/api` to `http://localhost:5000` (see `client/vite.config.js`).
- Auth: JWT-based authentication. Tokens are stored in localStorage by the client and sent in the Authorization header (AuthContext). Server issues JWTs in `server/routes/authRoutes.js` using `JWT_SECRET`.
- OTP flow: server uses express-session to store OTP/email/role for `/api/auth/request-otp` and `/api/auth/verify-otp` (see `server/routes/authRoutes.js`). Email uses `server/utils/sendEmail.js` and expects `EMAIL_USER`/`EMAIL_PASS` env vars.
- Password hashing: models (`server/models/*.js`) use bcrypt and expose `comparePassword` instance methods.

What an AI coding agent should know (concise)
- Architecture & boundaries:
  - Frontend: `client/src` - React pages/components/contexts. Routing is defined in `client/src/App.jsx`. Use `ProtectedRoute` (client/src/components/ProtectedRoute.jsx) for role-based route protection.
  - Backend: `server/` - Express routes under `server/routes/*`, Mongoose models under `server/models/*`, reusable utils under `server/utils` (e.g., `sendEmail.js`). The server entrypoint is `server/server.js`.
  - Data flow example: User registers -> frontend calls `/api/auth/register/<role>` -> server saves model (e.g., Student) -> server returns JWT -> frontend stores token in localStorage and sets axios default Authorization header (see `client/src/contexts/AuthContext.jsx`).

- Important files to reference when making changes:
  - client/vite.config.js (dev proxy / API port assumptions)
  - client/src/contexts/AuthContext.jsx (how auth tokens are stored and axios is configured)
  - client/src/components/ProtectedRoute.jsx (route access rules)
  - server/routes/authRoutes.js (login, registration, OTP logic)
  - server/models/* (Student.js, College.js, Owner.js - password hashing and comparePassword)
  - server/utils/sendEmail.js (nodemailer config — requires env vars)
  - server/server.js (express app, middleware, route mount points)

- Environment variables the agent must respect (server/.env expected keys):
  - MONGODB_URI — MongoDB connection string
  - JWT_SECRET — JWT signing secret
  - EMAIL_USER, EMAIL_PASS — SMTP credentials used by `sendEmail` (Gmail SMTP configured)
  - SESSION_SECRET — optional for express-session

Developer workflows & commands (how maintainers run the project)
- Install dependencies (from repo root):
  - npm install
  - npm run install-server
  - npm run install-client
- Run both servers in dev (recommended):
  - npm run dev  # concurrently starts server (nodemon) and client (vite)
- Run backend only:
  - npm run server (runs `nodemon server/server.js`)
- Run frontend only:
  - npm run client (runs `vite` in client/)
- Build frontend for production (client):
  - cd client && npm run build

Patterns & conventions to follow (project-specific)
- Role strings: 'student', 'college', 'owner' — used across frontend routes and server JWT payloads. When adding role checks, use exact string matches (see `ProtectedRoute` and `authRoutes.js`).
- Model auth methods: models expose `comparePassword(candidate)` async instance method. Use it rather than re-implementing bcrypt checks.
- Sessions for OTP: the OTP flow relies on server-side express-session state (req.session.otp, req.session.email, req.session.role). Changes to OTP endpoints must preserve session semantics.
- API routes mount points: `/api/auth`, `/api/student`, `/api/college`, `/api/owner`. When adding endpoints, follow these folders and export a router mounted in `server/server.js`.

Examples (copy/paste patterns found in repo)
- Setting Authorization header after login (frontend):
  - axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

- Creating JWT on server (authRoutes):
  - jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })

- Sending OTP email (server):
  - await sendEmail(email, 'Your OTP for Career Bridge', `Your OTP is: ${otp}. Expires in 10 minutes.`)

Testing & verification guidance for changes
- Manual quick checks after backend edits:
  - Start server: npm run server
  - Use Postman or curl to hit `http://localhost:5000/api/health` and auth endpoints (e.g., POST /api/auth/login).
- Manual quick checks after frontend edits:
  - Start client: npm run client
  - Open http://localhost:3000 and try login/register flows. Verify token is stored in localStorage and axios header is set.
- When editing code that touches session-backed OTP flows, test full flow in browser (request-otp, then verify-otp) because req.session is cookie-bound.

What NOT to change without human review
- Nodemailer SMTP host/port/auth defaults in `server/utils/sendEmail.js` (these expect valid EMAIL_USER/PASS and Gmail SMTP). Provide clear replacements and tests if altering.
- The Vite proxy configuration in `client/vite.config.js` — changing API host/port breaks the dev proxy and local testing.

If you cannot find required config or env vars
- Assume dev default values exist (MONGODB_URI -> mongodb://localhost:27017/career-bridge, JWT_SECRET fallback exists in code). But prompt the maintainer before changing production-sensitive values like SMTP credentials or JWT expiry.

If you produce code changes:
- Run lint and quick dev servers locally: npm run dev
- Include small unit/integration tests where reasonable (not currently present), or at least document manual verification steps in the PR description.

Contact & iteration
- If uncertain about role semantics, OTP UX, or email templates, leave an inline TODO and ping the maintainers in the PR description. Prefer small, reversible changes.

---
If you'd like, I can open a PR with this file, or adjust wording/length to match your preferred style. What would you like me to change next?
