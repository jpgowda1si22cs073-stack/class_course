# 📘 Classroom / Course Management Application — Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Why This Tech Stack?](#3-why-this-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Complete Folder Structure](#5-complete-folder-structure)
6. [Backend Deep Dive](#6-backend-deep-dive)
7. [Frontend Deep Dive](#7-frontend-deep-dive)
8. [How Files Connect – Request Flow](#8-how-files-connect--request-flow)
9. [Database Design](#9-database-design)
10. [Authentication & Authorization Flow](#10-authentication--authorization-flow)
11. [PDF Upload Flow – End to End](#11-pdf-upload-flow--end-to-end)
12. [API Route Map](#12-api-route-map)
13. [Security Measures](#13-security-measures)
14. [Future Enhancements](#14-future-enhancements)

---

## 1. Project Overview

The **Classroom / Course Management Application** is a full-stack web application that allows:

- **Instructors** to create courses, upload PDF materials, and post assignments with deadlines.
- **Students** to browse courses, enroll, view assignments, and download course materials.

The application enforces **role-based access control** — instructors and students have distinct capabilities and dashboards. Authentication is handled via **JSON Web Tokens (JWT)** for stateless, secure session management.

### Core Features

| Feature                  | Instructor | Student |
|--------------------------|:----------:|:-------:|
| Register / Login         | ✅         | ✅      |
| Create Courses           | ✅         | ❌      |
| Upload PDF Materials     | ✅         | ❌      |
| Post Assignments         | ✅         | ❌      |
| Browse All Courses       | ✅         | ✅      |
| Enroll in Courses        | ❌         | ✅      |
| View Enrolled Content    | ✅ (own)   | ✅      |
| Download PDFs            | ✅         | ✅      |

---

## 2. Technology Stack

### Frontend

| Technology       | Version  | Purpose                                              |
|------------------|----------|------------------------------------------------------|
| **React**        | 18.x     | Component-based UI library for building the interface |
| **Vite**         | 5.x      | Fast build tool and dev server with Hot Module Reload |
| **React Router** | 6.x      | Client-side routing and navigation                   |
| **Vanilla CSS**  | —        | Custom dark-theme styling with CSS variables          |

### Backend

| Technology       | Version  | Purpose                                                  |
|------------------|----------|----------------------------------------------------------|
| **Node.js**      | 20.x     | JavaScript runtime for server-side execution             |
| **Express.js**   | 4.x      | Minimal web framework for REST API routing               |
| **MySQL**        | 8.x      | Relational database for structured data storage          |
| **mysql2**       | 3.x      | MySQL driver with Promise/async-await support            |
| **JWT**          | 9.x      | Stateless authentication tokens                          |
| **bcrypt**       | 6.x      | Password hashing with salt rounds                        |
| **Multer**       | 1.4.x    | Middleware for multipart/form-data file uploads           |
| **CORS**         | 2.8.x    | Cross-Origin Resource Sharing for frontend-backend comms |
| **dotenv**       | 16.x     | Environment variable loading from `.env` file            |

---

## 3. Why This Tech Stack?

### React (Frontend)

**Why React?**
- **Component-based architecture** — each UI piece (Navbar, Dashboard, CoursePage) is an independent, reusable component. Changes to one don't break others.
- **Virtual DOM** — React only re-renders parts of the page that actually changed, making the UI fast and responsive.
- **Massive ecosystem** — React has the largest community, most tutorials, and the widest library support. If you need a feature, there's almost always a React library for it.
- **Hooks** — Modern React uses hooks (`useState`, `useEffect`, `useContext`) which simplify state management without class components.

**Comparison with alternatives:**

| Feature                  | React        | Angular       | Vue.js      |
|--------------------------|--------------|---------------|-------------|
| Learning curve           | Moderate     | Steep         | Easy        |
| Community size           | Largest      | Large         | Medium      |
| Performance              | Fast (VDOM)  | Good          | Fast (VDOM) |
| Flexibility              | Very High    | Opinionated   | High        |
| Job market               | Highest      | High          | Growing     |
| State management         | Context/Redux| Built-in (RxJS)| Pinia/Vuex |

**React was chosen** because it offers the best balance of flexibility, community support, and job-market relevance for an educational project.

---

### Node.js + Express (Backend)

**Why Node.js?**
- **Same language (JavaScript) on both frontend and backend** — no context switching. One language for the entire stack.
- **Non-blocking I/O** — Node.js handles many concurrent connections efficiently using its event-driven architecture. Perfect for a classroom app where multiple students might be downloading materials simultaneously.
- **npm ecosystem** — over 2 million packages available. Every feature we need (JWT, bcrypt, multer) is a simple `npm install` away.

**Why Express.js?**
- **Minimalist** — Express gives you just enough structure (routes, middleware) without forcing an opinion. You build exactly what you need.
- **Middleware pattern** — Express's middleware chain makes it easy to add authentication, role checks, file uploads, etc. as plug-and-play layers.
- **Industry standard** — Express is the most widely used Node.js framework, used by companies like Uber, IBM, and Netflix.

**Comparison with alternatives:**

| Feature              | Express (Node) | Django (Python) | Spring Boot (Java) | Laravel (PHP) |
|----------------------|:--------------:|:---------------:|:-------------------:|:-------------:|
| Language             | JavaScript     | Python          | Java                | PHP           |
| Setup speed          | Very Fast      | Fast            | Slow                | Moderate      |
| Performance          | High           | Moderate        | Very High           | Moderate      |
| Learning curve       | Easy           | Moderate        | Steep               | Moderate      |
| Same lang as frontend| ✅ Yes         | ❌ No           | ❌ No               | ❌ No         |
| Real-time support    | Excellent      | Limited         | Good                | Limited       |
| Community            | Massive        | Large           | Large               | Large         |

**Express was chosen** because it pairs naturally with React (both JavaScript), is lightweight, and has excellent middleware support for auth/uploads.

---

### MySQL (Database)

**Why MySQL?**
- **Relational data model** — classroom data (users → courses → enrollments → assignments → materials) has clear relationships. SQL databases handle this naturally with foreign keys and JOIN queries.
- **ACID compliance** — MySQL guarantees data integrity. An enrollment is either fully recorded or not at all — no half-states.
- **Proven at scale** — MySQL powers Facebook, Twitter, YouTube, and countless enterprise apps.
- **Structured queries** — SQL makes complex queries (e.g., "show all assignments for courses a student is enrolled in") straightforward.

**Comparison with alternatives:**

| Feature            | MySQL       | PostgreSQL  | MongoDB     | SQLite     |
|--------------------|:-----------:|:-----------:|:-----------:|:----------:|
| Type               | Relational  | Relational  | NoSQL/Doc   | Relational |
| Relationships      | Excellent   | Excellent   | Poor        | Good       |
| Performance        | Very Good   | Very Good   | Good (reads)| Good       |
| Scalability        | High        | Very High   | Very High   | Low        |
| JSON support       | Basic       | Advanced    | Native      | Basic      |
| Hosting options    | Everywhere  | Everywhere  | Atlas Cloud | Embedded   |
| Best for           | Web apps    | Complex apps| Unstructured| Small apps |

**MySQL was chosen** because the classroom domain has highly relational data (users own courses, students enroll in courses, courses have assignments and materials). A relational database models this perfectly.

---

### JWT (Authentication)

**Why JWT?**
- **Stateless** — the server doesn't need to store sessions. The token itself contains the user's ID and role, verified by a secret key.
- **Scalable** — since no server-side session storage is needed, you can run multiple server instances without session synchronization.
- **Frontend-friendly** — tokens are simply stored in `localStorage` and sent as an HTTP header. No cookies or server-side session management.

**Comparison with alternatives:**

| Feature            | JWT            | Session-based  | OAuth 2.0     |
|--------------------|:--------------:|:--------------:|:-------------:|
| Stateless          | ✅ Yes         | ❌ No          | ✅ Yes        |
| Scalability        | Excellent      | Requires Redis | Excellent     |
| Complexity         | Low            | Low            | High          |
| Third-party login  | ❌             | ❌             | ✅ Google etc |
| Best for           | APIs/SPAs      | Traditional web| Social logins |

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 REACT FRONTEND (Vite)                   │ │
│  │                 http://localhost:5173                    │ │
│  │                                                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │ │
│  │  │ Login    │ │ Register │ │Dashboard │ │ CoursePage│  │ │
│  │  │ Page     │ │ Page     │ │(Inst/Stu)│ │           │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │ │
│  │              ↕ api.js (JWT headers)                     │ │
│  └─────────────────────────┬───────────────────────────────┘ │
└─────────────────────────────┼────────────────────────────────┘
                              │ HTTP Requests (JSON + FormData)
                              ↓
┌─────────────────────────────┴────────────────────────────────┐
│                   EXPRESS BACKEND (Node.js)                   │
│                   http://localhost:5000                       │
│                                                              │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────────┐ │
│  │  CORS    │→ │ JWT Verify │→ │ Role Check (requireRole) │ │
│  │Middleware│  │ Middleware  │  │ Middleware               │ │
│  └──────────┘  └────────────┘  └──────────────────────────┘ │
│                        ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                    ROUTE FILES                           ││
│  │  authRoutes → courseRoutes → enrollmentRoutes →          ││
│  │  assignmentRoutes → materialRoutes                      ││
│  └──────────────────────────┬───────────────────────────────┘│
│                              ↓                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                  CONTROLLER FILES                        ││
│  │  authController → courseController → enrollmentController││
│  │  assignmentController → materialController               ││
│  └──────────────────────────┬───────────────────────────────┘│
│                              ↓                               │
│  ┌──────────┐  ┌───────────────────┐                        │
│  │  db.js   │→ │  MySQL Database   │                        │
│  │(pool)    │  │  (classroom_db)   │                        │
│  └──────────┘  └───────────────────┘                        │
│                                                              │
│  ┌───────────────────┐                                      │
│  │  /uploads/ folder │ ← PDF files stored here              │
│  └───────────────────┘                                      │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

1. **User interacts** with the React frontend in the browser.
2. **Frontend sends HTTP requests** to the Express backend via `api.js`, which auto-attaches the JWT token.
3. **Backend middleware** verifies the JWT token and checks the user's role.
4. **Route files** map the URL to the correct controller function.
5. **Controller functions** execute the business logic and query the MySQL database via `db.js`.
6. **Database responds** with results, which the controller sends back as JSON.
7. **Frontend receives** the JSON response and updates the UI reactively.

---

## 5. Complete Folder Structure

```
class_couse/
│
├── backend/                         # ← SERVER-SIDE APPLICATION
│   │
│   ├── .env                         # Environment variables (DB credentials, JWT secret)
│   ├── package.json                 # Node.js dependencies and scripts
│   ├── server.js                    # APPLICATION ENTRY POINT — starts Express
│   ├── db.js                        # MySQL connection pool (shared across all controllers)
│   ├── schema.sql                   # SQL script to create all database tables
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification + role-based access middleware
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Maps /api/auth/* URLs to authController
│   │   ├── courseRoutes.js          # Maps /api/courses/* URLs to courseController
│   │   ├── enrollmentRoutes.js     # Maps /api/enrollments/* URLs to enrollmentController
│   │   ├── assignmentRoutes.js     # Maps /api/assignments/* URLs to assignmentController
│   │   └── materialRoutes.js       # Maps /api/materials/* URLs to materialController
│   │
│   ├── controllers/
│   │   ├── authController.js        # Register (hash password) + Login (create JWT)
│   │   ├── courseController.js      # Create / list / get courses
│   │   ├── enrollmentController.js  # Enroll student + get enrolled courses
│   │   ├── assignmentController.js  # Post + get assignments (with access checks)
│   │   └── materialController.js    # Upload PDFs (Multer) + get materials
│   │
│   ├── uploads/                     # PDF files physically stored here
│   │   └── 1708012345-notes.pdf     # Example: timestamped filename
│   │
│   └── node_modules/                # Installed npm packages (not committed to git)
│
├── frontend/                        # ← CLIENT-SIDE APPLICATION
│   │
│   ├── index.html                   # HTML shell — React mounts into <div id="root">
│   ├── package.json                 # React dependencies and Vite dev scripts
│   ├── vite.config.js               # Vite configuration
│   │
│   └── src/
│       │
│       ├── main.jsx                 # React entry — renders <App /> into the DOM
│       ├── App.jsx                  # Route definitions + layout (BrowserRouter)
│       ├── api.js                   # Fetch wrapper — auto-injects JWT on every request
│       ├── index.css                # Global CSS — design tokens, colors, typography
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # React Context for auth state (user, token, login, logout)
│       │
│       ├── components/
│       │   ├── Navbar.jsx           # Top navigation bar (role-aware links + logout)
│       │   └── ProtectedRoute.jsx   # Route guard — redirects unauthenticated/wrong-role users
│       │
│       ├── pages/
│       │   ├── LoginPage.jsx        # Email + password login form
│       │   ├── RegisterPage.jsx     # Registration form with role selection
│       │   ├── InstructorDashboard.jsx  # Instructor's course list + create course form
│       │   ├── StudentDashboard.jsx     # Student's enrolled + browseable courses
│       │   └── CoursePage.jsx           # Course detail — assignments + materials
│       │
│       └── styles/
│           ├── auth.css             # Login/Register page styles
│           ├── navbar.css           # Navbar component styles
│           ├── dashboard.css        # Dashboard page styles
│           └── course.css           # Course detail page styles
│
├── README.md                        # Quick-start guide
└── PROJECT_DOCUMENTATION.md         # This file — complete project documentation
```

---

## 6. Backend Deep Dive

### 6.1 server.js — The Entry Point

This is where everything starts. When you run `node server.js`, this file:

1. **Loads environment variables** from `.env` using `dotenv`.
2. **Creates the Express app** and configures middleware:
   - `cors()` — allows the frontend (port 5173) to talk to the backend (port 5000).
   - `express.json()` — parses incoming JSON request bodies.
   - `express.static('uploads')` — serves uploaded PDFs as static files.
3. **Mounts all route files** under their API prefixes:
   - `/api/auth` → `authRoutes.js`
   - `/api/courses` → `courseRoutes.js`
   - `/api/enrollments` → `enrollmentRoutes.js`
   - `/api/assignments` → `assignmentRoutes.js`
   - `/api/materials` → `materialRoutes.js`
4. **Starts listening** on port 5000.

```
server.js
  ├── loads .env
  ├── creates Express app
  ├── applies middleware (cors, json, static)
  ├── mounts routes (auth, courses, enrollments, assignments, materials)
  └── listens on port 5000
```

### 6.2 db.js — Database Connection Pool

Creates a **connection pool** to MySQL using `mysql2/promise`. A pool maintains multiple database connections and reuses them, which is much faster than creating a new connection for every query.

```javascript
// Simplified version of what db.js does:
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // localhost
    user: process.env.DB_USER,       // classuser
    password: process.env.DB_PASSWORD, // classpass
    database: process.env.DB_NAME    // classroom_db
});
module.exports = pool;
```

Every controller imports this `pool` and uses it to run SQL queries.

### 6.3 middleware/auth.js — Security Layer

Contains two middleware functions:

**`verifyToken(req, res, next)`**
- Extracts the JWT from the `Authorization: Bearer <token>` header.
- Verifies the token using the JWT_SECRET.
- If valid, attaches the decoded user data (id, email, role) to `req.user`.
- If invalid/missing, returns 401 Unauthorized.

**`requireRole(role)`**
- A middleware factory — takes a role name and returns a middleware function.
- Compares `req.user.role` (set by `verifyToken`) against the required role.
- If mismatch, returns 403 Forbidden.
- Uses case-insensitive comparison (`.toLowerCase()`) because the database stores roles in uppercase.

**Middleware execution chain:**
```
Request → verifyToken → requireRole('instructor') → Controller
  │            │               │
  │            │               └── 403 if wrong role
  │            └── 401 if no/invalid token
  └── Raw HTTP request
```

### 6.4 Routes — URL → Controller Mapping

Routes are the "address book" of the API. They map HTTP methods and URLs to specific controller functions.

**authRoutes.js:**
```
POST /api/auth/register  →  authController.register
POST /api/auth/login     →  authController.login
```

**courseRoutes.js:**
```
POST   /api/courses      →  [verifyToken] → [requireRole('instructor')] → courseController.createCourse
GET    /api/courses       →  [verifyToken] → courseController.getAllCourses
GET    /api/courses/my    →  [verifyToken] → [requireRole('instructor')] → courseController.getMyCourses
GET    /api/courses/:id   →  [verifyToken] → courseController.getCourseById
```

**enrollmentRoutes.js:**
```
POST   /api/enrollments      →  [verifyToken] → [requireRole('student')] → enrollmentController.enroll
GET    /api/enrollments/my   →  [verifyToken] → [requireRole('student')] → enrollmentController.getMyEnrollments
```

**assignmentRoutes.js:**
```
POST   /api/assignments              →  [verifyToken] → [requireRole('instructor')] → assignmentController.createAssignment
GET    /api/assignments/course/:id   →  [verifyToken] → assignmentController.getAssignmentsByCourse
```

**materialRoutes.js:**
```
POST   /api/materials              →  [verifyToken] → [requireRole('instructor')] → [multer upload] → materialController.uploadMaterial
GET    /api/materials/course/:id   →  [verifyToken] → materialController.getMaterialsByCourse
```

### 6.5 Controllers — Business Logic

Controllers contain the actual logic that runs when a route is hit.

**authController.js:**
- `register()` — validates input, checks for existing email, hashes password with bcrypt (10 salt rounds), inserts user into DB, generates JWT, returns token + user data.
- `login()` — finds user by email, compares password with bcrypt, generates JWT if valid, returns token + user data.

**courseController.js:**
- `createCourse()` — inserts new course with the instructor's user ID.
- `getAllCourses()` — JOINs courses with users table to include instructor name.
- `getMyCourses()` — filters courses by the logged-in instructor's ID.
- `getCourseById()` — returns a single course with instructor name.

**enrollmentController.js:**
- `enroll()` — inserts a student-course pair into enrollments. The UNIQUE constraint prevents double enrollment.
- `getMyEnrollments()` — JOINs enrollments with courses table to return the student's enrolled courses with details.

**assignmentController.js:**
- `createAssignment()` — verifies the instructor owns the course before inserting.
- `getAssignmentsByCourse()` — checks access (instructor must own course, student must be enrolled) before returning assignments.

**materialController.js:**
- `uploadMaterial()` — uses Multer to handle PDF file upload. Saves file to `/uploads/` folder, stores `file_name`, `file_path`, and `external_link` in the database.
- `getMaterialsByCourse()` — same access checks as assignments. Returns material list ordered by upload date.

---

## 7. Frontend Deep Dive

### 7.1 main.jsx — The Starting Point

```
main.jsx  →  renders <App /> into the DOM element with id="root" in index.html
```

### 7.2 App.jsx — Routing & Layout

Wraps the entire app in:
1. `<BrowserRouter>` — enables client-side routing (no page reloads).
2. `<AuthProvider>` — provides authentication state to all components.

**Route map:**

| Path                     | Component              | Protection         |
|--------------------------|------------------------|--------------------|
| `/login`                 | `LoginPage`            | Public             |
| `/register`              | `RegisterPage`         | Public             |
| `/instructor/dashboard`  | `InstructorDashboard`  | Auth + role=instructor |
| `/student/dashboard`     | `StudentDashboard`     | Auth + role=student    |
| `/course/:id`            | `CoursePage`           | Auth (any role)    |
| `/`                      | Auto-redirect          | Redirects based on role |

### 7.3 api.js — The HTTP Client

A thin wrapper around the browser's `fetch()` API that:
1. Prefixes all URLs with `http://localhost:5000/api`.
2. Reads the JWT from `localStorage` and adds it as `Authorization: Bearer <token>`.
3. Sets `Content-Type: application/json` for JSON payloads (skips for FormData — required for file uploads).
4. Throws errors for non-OK HTTP responses so callers can use try/catch.

```
Frontend Component
    ↓ calls api('/courses', { method: 'POST', body: ... })
api.js
    ↓ adds JWT header + content type
    ↓ calls fetch('http://localhost:5000/api/courses', ...)
Backend receives request with Authorization header
```

### 7.4 AuthContext.jsx — State Management

Uses React's `createContext` and `useContext` to provide auth state globally.

**State:**
- `user` — object with `id`, `name`, `email`, `role` (normalized to lowercase).
- `token` — JWT string.
- `loading` — prevents flash of login page while restoring saved session.

**Functions:**
- `login(userData, token)` — saves user + token to state and `localStorage`.
- `logout()` — clears state and `localStorage`.

**On app load (useEffect):**
- Checks `localStorage` for saved token and user.
- If found, restores the session (normalizes role to lowercase).
- Sets `loading = false` when done.

### 7.5 ProtectedRoute.jsx — Route Guards

Wraps protected routes. Checks:
1. Is `user` present? If not → redirect to `/login`.
2. Does `user.role` match the required role? If not → redirect to `/login`.
3. If both pass → render the child component.

### 7.6 Navbar.jsx — Navigation

Role-aware navigation bar that:
- Shows **Dashboard** link pointing to the correct dashboard based on role.
- Displays a **role badge** (INSTRUCTOR / STUDENT).
- Shows the **user's name**.
- Provides a **Logout** button.

### 7.7 Page Components

**LoginPage.jsx:**
- Form with email and password fields.
- On submit: calls `POST /api/auth/login`, then `auth.login(data)` to save session.
- Redirects to correct dashboard based on role.

**RegisterPage.jsx:**
- Form with name, email, password, and **role selector buttons** (Student/Instructor).
- On submit: calls `POST /api/auth/register`, auto-logs in, and redirects.

**InstructorDashboard.jsx:**
- Fetches instructor's courses via `GET /api/courses/my`.
- Displays course cards in a grid.
- Includes a "Create Course" form (title + description).
- Clicking a course navigates to `/course/:id`.

**StudentDashboard.jsx:**
- Two tabs: "My Courses" and "Browse Courses".
- "My Courses" — fetches `GET /api/enrollments/my`.
- "Browse Courses" — fetches `GET /api/courses` and hides already-enrolled ones.
- "Enroll Now" button sends `POST /api/enrollments`.

**CoursePage.jsx:**
- Fetches course details, assignments, and materials on load.
- Two tabs: "Assignments" and "Materials".
- **Instructors see** forms to post assignments and upload PDFs.
- **Students see** assignment list (with due dates) and download/link buttons.

---

## 8. How Files Connect – Request Flow

### Example: Instructor Uploads a PDF

```
1. BROWSER: Instructor clicks "Upload" on CoursePage.jsx
         ↓
2. CoursePage.jsx: handleUploadMaterial() creates FormData with file + course_id
         ↓
3. api.js: adds JWT token to Authorization header, sends POST to /api/materials
         ↓
4. server.js: receives request, passes through middleware chain
         ↓
5. materialRoutes.js: matches POST /api/materials
         ↓
6. middleware/auth.js → verifyToken: extracts & verifies JWT → attaches req.user
         ↓
7. middleware/auth.js → requireRole('instructor'): checks req.user.role
         ↓
8. materialRoutes.js → multer: upload.single('file') saves PDF to /uploads/ folder
         ↓
9. materialController.js → uploadMaterial():
   a. Reads course_id from req.body
   b. Queries DB to verify instructor owns the course
   c. Gets file info from req.file (filename, path)
   d. INSERTs into materials table (course_id, file_name, file_path, external_link)
   e. Returns 201 success JSON
         ↓
10. api.js: receives JSON response, returns to CoursePage
         ↓
11. CoursePage.jsx: calls fetchMaterials() to refresh the list
         ↓
12. BROWSER: Material appears in the Materials tab
```

### Example: Student Enrolls in a Course

```
1. StudentDashboard.jsx → handleEnroll(courseId) → api('/enrollments', POST)
2. api.js → adds JWT → fetch('http://localhost:5000/api/enrollments')
3. server.js → middleware → enrollmentRoutes.js → POST /
4. auth.js → verifyToken → requireRole('student')
5. enrollmentController.js → enroll():
   - INSERT INTO enrollments (student_id, course_id) VALUES (req.user.id, courseId)
   - UNIQUE constraint prevents double enrollment
6. Response flows back to frontend
7. StudentDashboard.jsx refreshes enrolled courses list
```

---

## 9. Database Design

### Entity Relationship Diagram

```
┌──────────────┐       ┌───────────────┐       ┌──────────────┐
│    users     │       │    courses    │       │  assignments │
├──────────────┤       ├───────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)       │──┐    │ id (PK)      │
│ name         │  │    │ title         │  │    │ course_id(FK)│──→ courses.id
│ email (UQ)   │  │    │ description   │  │    │ title        │
│ password     │  ├───→│ instructor_id │  │    │ description  │
│ role         │  │    │   (FK→users)  │  │    │ due_date     │
│ created_at   │  │    │ created_at    │  │    │ created_at   │
└──────────────┘  │    └───────────────┘  │    └──────────────┘
                  │                       │
                  │    ┌───────────────┐  │    ┌──────────────┐
                  │    │  enrollments  │  │    │  materials   │
                  │    ├───────────────┤  │    ├──────────────┤
                  │    │ id (PK)       │  │    │ id (PK)      │
                  ├───→│ student_id(FK)│  ├───→│ course_id(FK)│
                       │ course_id(FK) │──┘    │ file_name    │
                       │ enrolled_at   │       │ file_path    │
                       │ UQ(stud,crs)  │       │ external_link│
                       └───────────────┘       │ upload_date  │
                                               └──────────────┘
```

### Key Relationships

| Relationship | Type | Meaning |
|---|---|---|
| `users.id` → `courses.instructor_id` | One-to-Many | One instructor creates many courses |
| `users.id` → `enrollments.student_id` | One-to-Many | One student enrolls in many courses |
| `courses.id` → `enrollments.course_id` | One-to-Many | One course has many enrolled students |
| `courses.id` → `assignments.course_id` | One-to-Many | One course has many assignments |
| `courses.id` → `materials.course_id` | One-to-Many | One course has many materials |

### Constraints

- **UNIQUE(student_id, course_id) on enrollments** — prevents a student from enrolling twice.
- **UNIQUE(email) on users** — prevents duplicate accounts.
- **ON DELETE CASCADE** — deleting a user removes their courses; deleting a course removes its assignments, materials, and enrollments.
- **ENUM('instructor', 'student') on role** — restricts role values at the database level.

---

## 10. Authentication & Authorization Flow

### Registration Flow

```
1. User fills registration form (name, email, password, role)
2. Frontend sends POST /api/auth/register
3. Backend checks if email already exists
4. bcrypt.hash(password, 10) — hashes password with 10 salt rounds
5. INSERT INTO users — stores user with hashed password
6. jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' })
7. Returns { token, user: { id, name, email, role } }
8. Frontend stores token + user in localStorage and AuthContext
9. User is redirected to their role-specific dashboard
```

### Login Flow

```
1. User enters email + password
2. Frontend sends POST /api/auth/login
3. Backend finds user by email
4. bcrypt.compare(password, user.password) — verifies against hash
5. If match: jwt.sign() creates a new token
6. Returns token + user data
7. Frontend stores and redirects (same as registration)
```

### Request Authentication

```
1. Every API call goes through api.js
2. api.js reads token from localStorage
3. Adds header: Authorization: Bearer eyJhbGciOiJIUz...
4. Backend middleware verifyToken() decodes and verifies
5. If valid: req.user = { id, email, role } → request proceeds
6. If invalid: 401 Unauthorized response
```

### Role Authorization

```
After verifyToken sets req.user:
   ↓
requireRole('instructor') checks:
   req.user.role.toLowerCase() === 'instructor'?
   ↓ YES → next()          ↓ NO → 403 Forbidden
```

---

## 11. PDF Upload Flow — End to End

### Step-by-step process:

1. **Instructor selects file** in `<input type="file" accept=".pdf">` on CoursePage.
2. **Frontend creates FormData:**
   ```javascript
   const formData = new FormData();
   formData.append('course_id', courseId);
   formData.append('file', selectedFile);  // the PDF blob
   ```
3. **api.js sends POST** to `/api/materials` — does NOT set `Content-Type` (browser auto-sets `multipart/form-data` with correct boundary).
4. **Multer middleware** intercepts the request:
   - **fileFilter** checks `file.mimetype === 'application/pdf'` — rejects non-PDFs.
   - **limits** checks `fileSize <= 10MB` — rejects oversized files.
   - **storage** saves to `backend/uploads/` with filename `<timestamp>-<originalname>.pdf`.
5. **materialController.uploadMaterial()** runs:
   - Verifies instructor owns the course.
   - Reads `req.file.originalname` and constructs the path.
   - INSERTs into `materials` table: `(course_id, file_name, file_path, external_link)`.
6. **When a student downloads:**
   - Frontend renders link: `http://localhost:5000/uploads/<timestamp>-<filename>.pdf`
   - Express's `express.static('uploads')` serves the file directly.

### File storage diagram:

```
Frontend (FormData)
    ↓ POST multipart/form-data
Multer middleware
    ↓ saves to disk
backend/uploads/1708012345-notes.pdf     ← Physical file
    ↓ metadata to DB
materials table: { file_name: "notes.pdf", file_path: "/uploads/1708012345-notes.pdf" }
    ↓ when student requests
Express static: GET /uploads/1708012345-notes.pdf → serves the file
```

---

## 12. API Route Map

### Complete request → middleware → controller chain:

```
POST   /api/auth/register
       └→ authController.register

POST   /api/auth/login
       └→ authController.login

POST   /api/courses
       └→ verifyToken → requireRole('instructor') → courseController.createCourse

GET    /api/courses
       └→ verifyToken → courseController.getAllCourses

GET    /api/courses/my
       └→ verifyToken → requireRole('instructor') → courseController.getMyCourses

GET    /api/courses/:id
       └→ verifyToken → courseController.getCourseById

POST   /api/enrollments
       └→ verifyToken → requireRole('student') → enrollmentController.enroll

GET    /api/enrollments/my
       └→ verifyToken → requireRole('student') → enrollmentController.getMyEnrollments

POST   /api/assignments
       └→ verifyToken → requireRole('instructor') → assignmentController.createAssignment

GET    /api/assignments/course/:courseId
       └→ verifyToken → assignmentController.getAssignmentsByCourse

POST   /api/materials
       └→ verifyToken → requireRole('instructor') → multer.single('file') → materialController.uploadMaterial

GET    /api/materials/course/:courseId
       └→ verifyToken → materialController.getMaterialsByCourse

GET    /api/health
       └→ { status: 'OK' }
```

---

## 13. Security Measures

| Threat                    | Protection                                                    |
|---------------------------|---------------------------------------------------------------|
| **Password theft**        | Passwords hashed with bcrypt (10 salt rounds) — never stored in plain text |
| **Unauthorized access**   | JWT verification on every protected route                      |
| **Role escalation**       | `requireRole()` middleware enforces instructor/student boundaries |
| **Malicious file uploads**| Multer fileFilter only accepts `application/pdf` MIME type     |
| **Large file attacks**    | Multer limits file size to 10MB                                |
| **Cross-origin attacks**  | CORS configured to allow only the frontend origin              |
| **SQL injection**         | Parameterized queries (`?` placeholders) in all SQL statements |
| **Double enrollment**     | UNIQUE database constraint on (student_id, course_id)          |
| **Data ownership**        | Controllers verify course ownership before allow modifications |
| **Token expiry**          | JWT tokens expire after 24 hours                               |
| **Secret management**     | JWT_SECRET and DB credentials stored in `.env`, not in code    |

---

## 14. Future Enhancements

### Short-term Improvements

| Enhancement | Description | Difficulty |
|---|---|---|
| **Assignment submissions** | Students upload their work (PDF/doc) for assignments | Medium |
| **Grading system** | Instructors grade submissions, students view grades | Medium |
| **Course search & filter** | Search by title, filter by instructor or category | Easy |
| **Email notifications** | Notify students of new assignments or materials | Medium |
| **User profile page** | Edit name, change password, view enrollment history | Easy |
| **Pagination** | Paginate course lists and assignment lists for performance | Easy |
| **Rich text editor** | Use a WYSIWYG editor for assignment descriptions | Medium |

### Medium-term Features

| Enhancement | Description | Difficulty |
|---|---|---|
| **Real-time updates** | WebSocket or polling for live notifications (new assignment posted, etc.) | Medium |
| **Discussion forum** | Per-course discussion threads for Q&A | Hard |
| **Calendar view** | Visual calendar showing assignment due dates | Medium |
| **Multiple file types** | Support DOCX, PPTX, images in addition to PDFs | Easy |
| **Course categories** | Organize courses by department or subject area | Easy |
| **Batch enrollment** | Instructors import student lists via CSV | Medium |
| **Admin dashboard** | Admin role for managing all users, courses, and system config | Hard |

### Long-term / Production Features

| Enhancement | Description | Difficulty |
|---|---|---|
| **Cloud storage (AWS S3)** | Store PDFs in cloud storage instead of local `/uploads` | Medium |
| **OAuth / SSO** | Login with Google, Microsoft, or university SSO | Hard |
| **Microservices** | Split into auth service, course service, file service | Hard |
| **Docker deployment** | Containerize frontend, backend, and database | Medium |
| **CI/CD pipeline** | Automated testing and deployment with GitHub Actions | Medium |
| **Rate limiting** | Prevent API abuse with express-rate-limit | Easy |
| **Logging & monitoring** | Winston logger + health dashboards | Medium |
| **Mobile app** | React Native app for iOS/Android | Hard |
| **Video materials** | Support video uploads in addition to PDFs | Hard |
| **AI tutor** | Use AI to generate quizzes from uploaded materials | Very Hard |

### Tech Stack Alternatives for Future Migration

If the project needs to scale significantly, consider:

| Current         | Future Alternative | When to Switch                                        |
|-----------------|--------------------|-------------------------------------------------------|
| MySQL           | PostgreSQL         | When you need advanced JSON queries or full-text search |
| Express         | NestJS             | When you need TypeScript + dependency injection        |
| Local uploads   | AWS S3 / Cloudflare R2 | When storage exceeds server capacity              |
| JWT in localStorage | HTTP-only cookies | For improved security against XSS attacks          |
| Vanilla CSS     | Tailwind CSS       | When the team grows and needs utility-first consistency |
| Vite dev server | Vercel / Netlify   | For production deployment with CDN                    |
| Single server   | Load balancer      | When concurrent users exceed single-server capacity    |

---

## Summary

This Classroom Management application demonstrates a complete full-stack architecture with clear separation of concerns:

- **Frontend** handles user interaction and routing
- **Backend** handles business logic, authentication, and data access
- **Database** handles persistent storage with relational integrity
- **File system** handles physical PDF storage

Every layer communicates through well-defined interfaces (HTTP APIs, SQL queries, React context), making the system maintainable, testable, and extensible.
