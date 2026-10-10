# Contributing to Hospital Appointment Allocation Platform

Thank you for your interest in contributing to the **Hospital Appointment Allocation Platform** (SIH260136)! This document provides guidelines, environment setup instructions, Git workflow standards, and a curated list of 15 actionable issues categorized into **Easy**, **Medium**, and **Hard** (5 per category).

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Database Seeding](#database-seeding)
- [Development Workflow](#development-workflow)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Commit Message Guidelines](#commit-message-guidelines)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Actionable Issues List (15 Categorized Tasks)](#actionable-issues-list-15-categorized-tasks)
  - [🟢 EASY Issues (5 Beginner Tasks)](#-easy-issues-5-beginner-tasks)
  - [🟡 MEDIUM Issues (5 Intermediate Tasks)](#-medium-issues-5-intermediate-tasks)
  - [🔴 HARD Issues (5 Advanced Tasks)](#-hard-issues-5-advanced-tasks)
- [Issue & PR Labels](#issue--pr-labels)

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/hospital_appointments`) or MongoDB Atlas connection string.

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tanishqkale91-cmd/hospital-appointment-platform.git
   cd hospital-appointment-platform
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

4. **Run Servers**:
   - Backend: `npm run dev` (starts server on port 5000)
   - Frontend: `npm run dev` (starts Vite dev server on port 5173)

### Database Seeding

Seed default hospital departments (`General Medicine`, `Cardiology`, `Neurology`, `Orthopedics`, `Pediatrics`) and the initial Admin account:

```bash
cd backend
npm run seed
```

---

## Development Workflow

### Branch Naming Conventions

- `fix/description` (e.g., `fix/department-select-empty`)
- `feat/description` (e.g., `feat/prescription-notes`)
- `docs/description` (e.g., `docs/update-readme`)
- `test/description` (e.g., `test/auth-controller`)

### Commit Message Guidelines

Follow the Conventional Commits specification:
- `fix(scope): description`
- `feat(scope): description`
- `docs(scope): description`
- `test(scope): description`

### Submitting a Pull Request

Before submitting a PR, verify frontend tests and production build locally:
```bash
cd frontend
npm test
npm run build
```

---

## Actionable Issues List (15 Categorized Tasks)

---

### 🟢 EASY Issues (5 Beginner Tasks)

#### Task 1: [Docs] Expand Deployment Instructions & API Curl Samples ([Issue #5](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/5))
- **Scope**: Document Vercel (`VITE_API_URL`) and Render setup, Atlas IP whitelisting, and API curl request samples.
- **Files**: `README.md`, `frontend/.env.example`, `backend/.env.example`
- **Labels**: `documentation`, `good first issue`

#### Task 2: [CI/CD] Add GitHub Actions Workflow for Build & Test Checks ([Issue #2](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/2))
- **Scope**: Add `.github/workflows/ci.yml` running frontend tests (`npm test`) and Vite production build (`npm run build`).
- **Files**: `.github/workflows/ci.yml`
- **Labels**: `enhancement`, `good first issue`

#### Task 3: [UX] Reusable Animated Skeleton Loaders for Dashboard Cards
- **Scope**: Build reusable `Skeleton.jsx` and replace text loaders on Patient and Doctor dashboards.
- **Files**: `frontend/src/components/common/Skeleton.jsx`, `frontend/src/pages/patient/PatientDashboard.jsx`
- **Labels**: `enhancement`, `good first issue`

#### Task 4: [Admin] CSV Report Export for Appointment Schedules & Patient Records
- **Scope**: Add "Export CSV" buttons on Admin Appointments and Patients management tables.
- **Files**: `frontend/src/pages/admin/Appointments.jsx`, `frontend/src/pages/admin/Patients.jsx`
- **Labels**: `enhancement`, `good first issue`

#### Task 5: [Testing] Unit Tests for Frontend Formatters & Validation Utilities
- **Scope**: Add unit tests in `frontend/tests/utils.test.js` for `isValidEmail`, `formatDate`, and `getErrorMessage`.
- **Files**: `frontend/src/utils/format.js`, `frontend/src/utils/validation.js`, `frontend/tests/utils.test.js`
- **Labels**: `enhancement`, `good first issue`

---

### 🟡 MEDIUM Issues (5 Intermediate Tasks)

#### Task 6: [Testing] Integration Tests for Backend Auth & Registration ([Issue #3](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/3))
- **Scope**: Test patient/doctor registration, duplicate email rejection (409), and invalid credentials (401).
- **Files**: `backend/tests/auth.test.js`, `backend/controllers/authController.js`
- **Labels**: `enhancement`

#### Task 7: [Testing] Appointment Booking Validation & Double-Booking Prevention Tests ([Issue #4](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/4))
- **Scope**: Test database slot exclusivity indexes and automatic waiting list reassignment on cancellation.
- **Files**: `backend/tests/appointment.test.js`, `backend/models/Appointment.js`
- **Labels**: `enhancement`

#### Task 8: [Doctor Portal] Consultation Notes & Prescription Entry Modal
- **Scope**: Add modal dialog in `AppointmentDetail.jsx` to enter notes/prescriptions when completing consultations.
- **Files**: `frontend/src/components/appointments/AppointmentDetail.jsx`, `backend/controllers/appointmentController.js`
- **Labels**: `enhancement`

#### Task 9: [Security] Rate Limiting Middleware for Public Auth Endpoints
- **Scope**: Add rate limiting middleware to `/api/auth/login` and `/api/auth/register` (returns 429).
- **Files**: `backend/middlewares/rateLimiter.js`, `backend/server.js`
- **Labels**: `enhancement`, `help wanted`

#### Task 10: [Patient Portal] Cancellation Reason Form & Patient Rating/Review System
- **Scope**: Collect cancellation reasons and allow patients to rate completed consultations (1–5 stars).
- **Files**: `frontend/src/pages/patient/MyAppointments.jsx`, `backend/models/Appointment.js`
- **Labels**: `enhancement`

---

### 🔴 HARD Issues (5 Advanced Tasks)

#### Task 11: [Real-Time] Server-Sent Events (SSE) / WebSocket Notifications for Waiting List Reassignments
- **Scope**: Implement SSE/Socket.io service to send real-time browser push notifications when a waiting list slot is assigned.
- **Files**: `backend/services/notificationService.js`, `frontend/src/context/NotificationContext.jsx`
- **Labels**: `enhancement`, `architecture`

#### Task 12: [Scheduling] Recurring Doctor Availability Windows & Break Exclusions Engine
- **Scope**: Redesign availability system to support weekly recurring rules (e.g. Mon–Fri) and custom lunch break exclusions.
- **Files**: `backend/models/Availability.js`, `backend/controllers/availabilityController.js`
- **Labels**: `enhancement`, `architecture`

#### Task 13: [Performance] Redis Caching Layer for Doctor Search & Department Queries
- **Scope**: Add Redis caching for `GET /api/departments` and `GET /api/doctors` with automatic cache invalidation.
- **Files**: `backend/config/redis.js`, `backend/controllers/doctorController.js`
- **Labels**: `enhancement`, `performance`

#### Task 14: [Analytics] Real-Time Hospital Administrative Analytics Suite & Metrics Charts
- **Scope**: Create MongoDB aggregation pipelines and Chart.js views for revenue, utilization, and peak booking hours.
- **Files**: `backend/controllers/adminAnalyticsController.js`, `frontend/src/pages/admin/AnalyticsDashboard.jsx`
- **Labels**: `enhancement`, `analytics`

#### Task 15: [Security] Refresh Token Rotation, Session Revocation & RBAC Audit Logging
- **Scope**: Implement HTTP-only cookie Refresh Token rotation, multi-device session revocation, and admin audit logs.
- **Files**: `backend/models/RefreshToken.js`, `backend/middlewares/authMiddleware.js`
- **Labels**: `security`, `architecture`

---

## Issue & PR Labels

| Label | Description |
| :--- | :--- |
| `bug` | Something isn't working as expected |
| `enhancement` | New feature or improvement |
| `documentation` | Additions or updates to documentation |
| `good first issue` | Starter tasks well-suited for newcomers |
| `help wanted` | Tasks requiring extra attention or specialized skills |
