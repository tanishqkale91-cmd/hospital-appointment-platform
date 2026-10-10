# Contributing to Hospital Appointment Allocation Platform

Thank you for your interest in contributing to the **Hospital Appointment Allocation Platform** (SIH260136)! This document provides guidelines, environment setup instructions, Git workflow standards, and a curated list of actionable issues for open-source contributors.

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
- [Curated Contributor Issues & Micro-Tasks](#curated-contributor-issues--micro-tasks)
  - [Category A: Testing & Automation](#category-a-testing--automation)
  - [Category B: Features & Enhancements](#category-b-features--enhancements)
  - [Category C: Security & Reliability](#category-c-security--reliability)
  - [Category D: Admin & Reporting Tools](#category-d-admin--reporting-tools)
  - [Category E: User Experience & Accessibility](#category-e-user-experience--accessibility)
- [Issue & PR Labels](#issue--pr-labels)

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/hospital_appointments`) or MongoDB Atlas URI.

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
   *Configure `backend/.env` with your `MONGO_URI` and `JWT_SECRET`.*

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```
   *Ensure `VITE_API_URL` is set to `http://localhost:5000/api`.*

4. **Run Servers**:
   - Backend: `npm run dev` (starts Express server on port 5000)
   - Frontend: `npm run dev` (starts Vite dev server on port 5173)

### Database Seeding

To seed default hospital departments (`General Medicine`, `Cardiology`, `Neurology`, `Orthopedics`, `Pediatrics`) and the initial Admin account:

```bash
cd backend
npm run seed
```

*Note: The seed script is idempotent and safe to run repeatedly.*

---

## Development Workflow

### Branch Naming Conventions

Always create a new branch from `main` or `feature/core-platform` for your work:

- `fix/description` (e.g., `fix/department-select-empty`)
- `feat/description` (e.g., `feat/prescription-notes`)
- `docs/description` (e.g., `docs/update-readme`)
- `test/description` (e.g., `test/auth-controller`)
- `ci/description` (e.g., `ci/github-actions`)

### Commit Message Guidelines

We follow the Conventional Commits specification:

- `fix(scope): concise description of bug fix`
- `feat(scope): concise description of new feature`
- `docs(scope): documentation updates`
- `test(scope): addition or modification of tests`
- `refactor(scope): code change that neither fixes a bug nor adds a feature`

### Submitting a Pull Request

1. Run frontend tests and build check before pushing:
   ```bash
   cd frontend
   npm test
   npm run build
   ```
2. Push your branch to GitHub and open a Pull Request.
3. Link the PR to the relevant issue (e.g., `Closes #3`).
4. Ensure your PR description clearly explains the changes made, testing steps executed, and screenshot evidence (if modifying UI).

---

## Curated Contributor Issues & Micro-Tasks

The following list contains actionable, self-contained issues ready for contributors to take on.

### Category A: Testing & Automation

#### Task A1: Backend Authentication & Registration Integration Tests ([GitHub Issue #3](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/3))
- **Description**: Add automated unit/integration tests for `authController.js` using Node.js test runner or Supertest.
- **Scope**:
  - Test patient registration with valid payloads (201 Created).
  - Test doctor registration requiring `departmentId` and `specialization`.
  - Test rejection of admin registration via public endpoint (403 Forbidden).
  - Test duplicate email registration handling (409 Conflict).
  - Verify invalid credentials return 401 Unauthorized.
- **Target Files**: `backend/tests/auth.test.js`, `backend/controllers/authController.js`.
- **Labels**: `enhancement`, `good first issue`

#### Task A2: Appointment Conflict & Exclusivity Tests ([GitHub Issue #4](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/4))
- **Description**: Implement automated tests verifying database compound partial indexes (`unique_active_doctor_slot`, `unique_active_patient_slot`) and cancellation reassignment.
- **Scope**:
  - Test double-booking prevention for same doctor, date, and time slot.
  - Test double-booking prevention for same patient at overlapping times.
  - Test automatic slot assignment to waiting list patients when an appointment is cancelled.
- **Target Files**: `backend/tests/appointment.test.js`, `backend/models/Appointment.js`.
- **Labels**: `enhancement`

#### Task A3: GitHub Actions CI/CD Pipeline ([GitHub Issue #2](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/2))
- **Description**: Add `.github/workflows/ci.yml` to automatically run tests and production builds on pull requests.
- **Scope**:
  - Run frontend unit tests (`npm test`) and Vite build (`npm run build`).
  - Run backend linting and test scripts.
- **Target Files**: `.github/workflows/ci.yml`.
- **Labels**: `enhancement`, `good first issue`

---

### Category B: Features & Enhancements

#### Task B1: Doctor Consultation Notes & Prescription Entry
- **Description**: Enhance the Doctor portal so doctors can write detailed consultation notes and prescribed medication when marking an appointment as `completed`.
- **Scope**:
  - Add a modal dialog in `AppointmentDetail.jsx` when clicking "Complete Consultation".
  - Send `notes` and `prescription` fields to `PATCH /api/appointments/:id/status`.
  - Display prescription notes in Patient appointment history view.
- **Target Files**: `frontend/src/components/appointments/AppointmentDetail.jsx`, `backend/controllers/appointmentController.js`.
- **Labels**: `enhancement`

#### Task B2: Waiting List Email & Toast Notifications
- **Description**: Notify patients when a cancelled appointment slot is automatically assigned to them from the waiting list queue.
- **Scope**:
  - Integrate email notification dispatcher in `waitingListController.js` when auto-assigning slots.
  - Add in-app alert banner on patient dashboard when a slot is assigned.
- **Target Files**: `backend/controllers/waitingListController.js`, `backend/utils/mailer.js`, `frontend/src/pages/patient/PatientDashboard.jsx`.
- **Labels**: `enhancement`

---

### Category C: Security & Reliability

#### Task C1: Authentication Rate Limiting Middleware
- **Description**: Protect authentication routes against brute-force attacks.
- **Scope**:
  - Implement rate limiting middleware for `/api/auth/login` and `/api/auth/register` (e.g., max 10 requests per 15 minutes per IP).
  - Return standardized 429 Too Many Requests response with retry-after header.
- **Target Files**: `backend/middlewares/rateLimiter.js`, `backend/server.js`.
- **Labels**: `enhancement`, `help wanted`

---

### Category D: Admin & Reporting Tools

#### Task D1: Admin CSV Report Export for Appointments & Waiting Lists
- **Description**: Enable administrators to export filtered appointment records and waiting list queues to downloadable CSV files.
- **Scope**:
  - Add "Export CSV" button on Admin Appointments and Waiting Lists pages.
  - Generate formatted CSV data client-side or via backend utility.
- **Target Files**: `frontend/src/pages/admin/Appointments.jsx`, `frontend/src/pages/admin/WaitingLists.jsx`.
- **Labels**: `enhancement`, `good first issue`

---

### Category E: User Experience & Accessibility

#### Task E1: UI Skeleton Loaders & Optimistic State Improvements
- **Description**: Replace full-page loading text with animated Tailwind skeleton loaders across Dashboard and Doctor search pages.
- **Scope**:
  - Create reusable `Skeleton.jsx` component.
  - Integrate skeleton placeholders in `PatientDashboard.jsx`, `DoctorDashboard.jsx`, and `DoctorCard.jsx`.
- **Target Files**: `frontend/src/components/common/Skeleton.jsx`, `frontend/src/pages/patient/Doctors.jsx`.
- **Labels**: `enhancement`, `good first issue`

---

## Issue & PR Labels

| Label | Description |
| :--- | :--- |
| `bug` | Something isn't working as expected |
| `enhancement` | New feature or improvement |
| `documentation` | Additions or updates to documentation |
| `good first issue` | Starter tasks well-suited for newcomers |
| `help wanted` | Tasks requiring extra attention or specialized skills |

---

Happy contributing! If you have any questions, feel free to open a discussion or comment on an existing GitHub issue.
