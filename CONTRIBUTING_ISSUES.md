# Actionable Contributor Issues List

This file contains a ready-to-use list of candidate GitHub issues for the **Hospital Appointment Allocation Platform**. Project maintainers and contributors can use these issue templates to create or claim tasks on GitHub.

---

## Issue 1: [CI/CD] Add GitHub Actions Workflow for Automated Build & Test Checks
- **Title**: `ci: Add GitHub Actions workflow for backend tests and frontend build checks`
- **Labels**: `enhancement`, `good first issue`
- **GitHub Issue Link**: [#2](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/2)
- **Problem Statement**: Currently, PRs submitted by contributors are not automatically verified against frontend build breaks or failing test suites.
- **Proposed Scope**: Create `.github/workflows/ci.yml` that runs on every push and pull request to `main` and `feature/*` branches.
- **Acceptance Criteria**:
  1. Installs frontend dependencies (`npm ci`), runs tests (`npm test`), and executes Vite build (`npm run build`).
  2. Installs backend dependencies and executes test suite when configured.
  3. Fails CI job if any test fails or syntax errors occur.
- **Target Files**: `.github/workflows/ci.yml`

---

## Issue 2: [Testing] Implement Automated Backend Unit and Integration Tests for Authentication
- **Title**: `test(backend): Implement automated unit and integration tests for authentication and registration`
- **Labels**: `enhancement`, `good first issue`
- **GitHub Issue Link**: [#3](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/3)
- **Problem Statement**: The authentication controller (`authController.js`) lacks automated test coverage for validation rules, duplicate email detection, and JWT response payloads.
- **Proposed Scope**: Create a test suite in `backend/` using Node.js native test runner or Supertest.
- **Acceptance Criteria**:
  1. Test patient registration with valid inputs (returns 201 Created and JWT).
  2. Test doctor registration requiring valid `departmentId` and `specialization`.
  3. Verify admin account registration via public endpoint is rejected (403 Forbidden).
  4. Verify duplicate email registration returns 409 Conflict.
  5. Verify invalid email formats and short passwords return 400 Bad Request.
  6. Verify passwords are never leaked in JSON responses.
- **Target Files**: `backend/tests/auth.test.js`, `backend/controllers/authController.js`

---

## Issue 3: [Testing] Implement Appointment Booking Validation & Exclusivity Tests
- **Title**: `test(backend): Implement appointment booking validation and double-booking prevention tests`
- **Labels**: `enhancement`
- **GitHub Issue Link**: [#4](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/4)
- **Problem Statement**: The backend uses compound partial indexes in MongoDB (`unique_active_doctor_slot`, `unique_active_patient_slot`) to enforce slot exclusivity, but lacks automated tests verifying concurrent conflict handling and waiting list auto-assignment.
- **Proposed Scope**: Create unit/integration tests for appointment booking, cancellation, and waiting list queue processing.
- **Acceptance Criteria**:
  1. Test successful booking for valid doctor availability windows.
  2. Attempting to book an already-booked slot returns 409 Conflict.
  3. Patient attempting to book two overlapping appointments returns 409 Conflict.
  4. Cancelling an appointment updates status to `cancelled` and automatically reassigns the freed slot to an eligible waiting list entry.
- **Target Files**: `backend/tests/appointment.test.js`, `backend/controllers/appointmentController.js`

---

## Issue 4: [Documentation] Enhance Deployment Instructions and Environment Setup Guide
- **Title**: `docs: Enhance deployment instructions and local environment setup guide`
- **Labels**: `documentation`
- **GitHub Issue Link**: [#5](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/5)
- **Problem Statement**: Onboarding contributors need clear step-by-step guidance for deploying to Render and Vercel and troubleshooting common environment setup issues.
- **Proposed Scope**: Expand `README.md` with explicit deployment guides and API curl examples.
- **Acceptance Criteria**:
  1. Document Vercel frontend environment variable setup (`VITE_API_URL`).
  2. Document Render backend setup (`CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`).
  3. Include troubleshooting notes for MongoDB Atlas IP Whitelisting.
  4. Provide curl / Postman request examples for core endpoints.
- **Target Files**: `README.md`, `backend/.env.example`, `frontend/.env.example`

---

## Issue 5: [Doctor Portal] Add Consultation Notes & Prescription Entry Modal
- **Title**: `feat(doctor): Add consultation notes and prescription entry modal on appointment completion`
- **Labels**: `enhancement`
- **Problem Statement**: Doctors currently mark appointments as completed without a dedicated input interface for medical notes and prescriptions.
- **Proposed Scope**: Enhance the Doctor Appointment details view to accept diagnosis notes and prescription details.
- **Acceptance Criteria**:
  1. Clicking "Complete Appointment" opens a modal dialog requesting consultation notes and prescription details.
  2. Updates appointment record via `PATCH /api/appointments/:id/status`.
  3. Displays saved consultation notes on Patient appointment history.
- **Target Files**: `frontend/src/components/appointments/AppointmentDetail.jsx`, `backend/controllers/appointmentController.js`

---

## Issue 6: [Notifications] Automated Email/Notification Alert on Waiting List Slot Assignment
- **Title**: `feat(patient): Add automated email/notification alert on waiting-list slot assignment`
- **Labels**: `enhancement`
- **Problem Statement**: Patients assigned a slot from the waiting list when an appointment is cancelled currently have no automated notification mechanism.
- **Proposed Scope**: Send email alerts or trigger in-app toast notifications upon waiting list assignment.
- **Acceptance Criteria**:
  1. Trigger email dispatcher in `waitingListController.js` upon automatic slot assignment.
  2. Display an active notification banner on the patient's dashboard.
- **Target Files**: `backend/controllers/waitingListController.js`, `backend/utils/mailer.js`, `frontend/src/pages/patient/PatientDashboard.jsx`

---

## Issue 7: [Security] Rate Limiting Middleware for Authentication Endpoints
- **Title**: `sec(backend): Implement rate limiting middleware on public authentication endpoints`
- **Labels**: `enhancement`, `help wanted`
- **Problem Statement**: Public authentication endpoints (`/api/auth/login`, `/api/auth/register`) need rate-limiting protection against brute-force attacks.
- **Proposed Scope**: Add `express-rate-limit` middleware to authentication routes.
- **Acceptance Criteria**:
  1. Restrict repeated login attempts from the same IP (e.g., max 10 requests per 15 minutes).
  2. Return HTTP 429 Too Many Requests with informative JSON message.
- **Target Files**: `backend/middlewares/rateLimiter.js`, `backend/server.js`

---

## Issue 8: [Admin Portal] CSV Report Export for Appointments & Waiting List Logs
- **Title**: `feat(admin): Add export to CSV for system appointment reports and waiting list logs`
- **Labels**: `enhancement`, `good first issue`
- **Problem Statement**: System administrators need to download offline reports of appointment schedules and waiting queues.
- **Proposed Scope**: Add "Export CSV" buttons on Admin Appointments and Waiting Lists management pages.
- **Acceptance Criteria**:
  1. Clicking "Export CSV" downloads a properly formatted `.csv` file containing filtered records.
- **Target Files**: `frontend/src/pages/admin/Appointments.jsx`, `frontend/src/pages/admin/WaitingLists.jsx`

---

## Issue 9: [UX / Frontend] Reusable Skeleton Loaders for Dashboard Cards and Lists
- **Title**: `feat(frontend): Implement skeleton loaders and optimistic UI state handling for dashboard cards`
- **Labels**: `enhancement`, `good first issue`
- **Problem Statement**: Text-based loading placeholders feel dated; animated skeleton loaders provide a much sleeker user experience.
- **Proposed Scope**: Build a reusable Tailwind CSS `Skeleton.jsx` component and integrate it into dashboard views.
- **Acceptance Criteria**:
  1. Render animated skeleton card placeholders during API data fetching on Patient and Doctor dashboards.
- **Target Files**: `frontend/src/components/common/Skeleton.jsx`, `frontend/src/pages/patient/PatientDashboard.jsx`
