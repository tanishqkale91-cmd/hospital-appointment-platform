# Categorized Contributor Issues (15 Actionable Tasks)

This file contains 15 curated, highly actionable issues categorized by difficulty: **Easy**, **Medium**, and **Hard** (5 issues per category).

---

## 🟢 EASY (5 Beginner-Friendly Issues)

### Issue 1: [Docs] Expand Deployment Instructions, Environment References & API Curl Examples
- **Difficulty**: Easy
- **Labels**: `documentation`, `good first issue`
- **GitHub Issue**: [#5](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/5)
- **Problem**: Onboarding developers need explicit guidance for Vercel/Render deployments, environment setup, and API request samples.
- **Scope**:
  - Document Vercel environment variables (`VITE_API_URL`).
  - Document Render backend configuration (`CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`).
  - Add troubleshooting guide for MongoDB Atlas IP Whitelisting.
  - Provide curl / Postman request examples for `/api/auth/register`, `/api/auth/login`, and `/api/appointments`.
- **Target Files**: `README.md`, `frontend/.env.example`, `backend/.env.example`

### Issue 2: [CI/CD] Add GitHub Actions Workflow for Build & Test Checks
- **Difficulty**: Easy
- **Labels**: `enhancement`, `good first issue`
- **GitHub Issue**: [#2](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/2)
- **Problem**: PRs are not automatically verified against frontend build failures or syntax errors.
- **Scope**:
  - Create `.github/workflows/ci.yml` running on push and PRs to `main` and `feature/*`.
  - Install dependencies, run frontend tests (`npm test`), and run Vite production build (`npm run build`).
- **Target Files**: `.github/workflows/ci.yml`

### Issue 3: [UX] Reusable Animated Skeleton Loaders for Dashboard Cards
- **Difficulty**: Easy
- **Labels**: `enhancement`, `good first issue`
- **Problem**: Plain text loading states look basic; animated skeleton components improve perceived UI performance.
- **Scope**:
  - Build a reusable Tailwind CSS `Skeleton.jsx` component.
  - Integrate skeleton loading placeholders into `PatientDashboard.jsx` and `DoctorDashboard.jsx`.
- **Target Files**: `frontend/src/components/common/Skeleton.jsx`, `frontend/src/pages/patient/PatientDashboard.jsx`

### Issue 4: [Admin] CSV Report Export for Appointment Schedules & Patient Records
- **Difficulty**: Easy
- **Labels**: `enhancement`, `good first issue`
- **Problem**: System administrators currently cannot export appointment logs or patient lists for offline record keeping.
- **Scope**:
  - Add an "Export to CSV" button on Admin Appointments and Patients views.
  - Generate a formatted downloadable `.csv` file from current table data.
- **Target Files**: `frontend/src/pages/admin/Appointments.jsx`, `frontend/src/pages/admin/Patients.jsx`

### Issue 5: [Testing] Add Unit Tests for Frontend Formatters & Validation Helpers
- **Difficulty**: Easy
- **Labels**: `enhancement`, `good first issue`
- **Problem**: Date/time formatting and validation helper functions in `frontend/src/utils/` lack automated test coverage.
- **Scope**:
  - Create `frontend/tests/utils.test.js` using Node test runner.
  - Test `isValidEmail`, `formatDate`, `formatTime`, and `getErrorMessage` edge cases.
- **Target Files**: `frontend/src/utils/format.js`, `frontend/src/utils/validation.js`, `frontend/tests/utils.test.js`

---

## 🟡 MEDIUM (5 Intermediate Complexity Issues)

### Issue 6: [Testing] Automated Unit & Integration Tests for Backend Auth & Registration
- **Difficulty**: Medium
- **Labels**: `enhancement`
- **GitHub Issue**: [#3](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/3)
- **Problem**: Authentication controllers lack automated test coverage for validation rules, duplicate email checks, and JWT response payloads.
- **Scope**:
  - Create `backend/tests/auth.test.js`.
  - Test patient registration (201 Created), doctor registration with required department fields, duplicate email rejection (409 Conflict), and invalid credential rejection (401 Unauthorized).
- **Target Files**: `backend/tests/auth.test.js`, `backend/controllers/authController.js`

### Issue 7: [Testing] Appointment Booking Validation & Double-Booking Prevention Tests
- **Difficulty**: Medium
- **Labels**: `enhancement`
- **GitHub Issue**: [#4](https://github.com/tanishqkale91-cmd/hospital-appointment-platform/issues/4)
- **Problem**: MongoDB partial unique indexes (`unique_active_doctor_slot`, `unique_active_patient_slot`) need automated verification under duplicate request scenarios.
- **Scope**:
  - Create `backend/tests/appointment.test.js`.
  - Verify that double-booking the same doctor date/slot returns 409 Conflict.
  - Verify cancellation triggers automatic assignment to eligible waiting list entries.
- **Target Files**: `backend/tests/appointment.test.js`, `backend/controllers/appointmentController.js`

### Issue 8: [Doctor Portal] Consultation Notes & Prescription Entry Modal
- **Difficulty**: Medium
- **Labels**: `enhancement`
- **Problem**: Doctors currently mark appointments as completed without a dedicated interface to record diagnosis notes and prescribed medications.
- **Scope**:
  - Add a modal dialog in `AppointmentDetail.jsx` when completing an appointment.
  - Send `notes` and `prescription` fields to `PATCH /api/appointments/:id/status`.
  - Display consultation notes in the Patient appointment history view.
- **Target Files**: `frontend/src/components/appointments/AppointmentDetail.jsx`, `backend/controllers/appointmentController.js`

### Issue 9: [Security] Rate Limiting Middleware for Public Authentication Endpoints
- **Difficulty**: Medium
- **Labels**: `enhancement`, `help wanted`
- **Problem**: Public authentication endpoints (`/api/auth/login`, `/api/auth/register`) need rate limiting to protect against brute-force attacks.
- **Scope**:
  - Implement rate limiting middleware (e.g. max 10 requests per 15 minutes per IP).
  - Return standardized HTTP 429 Too Many Requests response.
- **Target Files**: `backend/middlewares/rateLimiter.js`, `backend/server.js`

### Issue 10: [Patient Portal] Cancellation Reason Form & Patient Rating/Review System
- **Difficulty**: Medium
- **Labels**: `enhancement`
- **Problem**: When patients cancel an appointment, there is no structured feedback form, nor can patients leave ratings for completed appointments.
- **Scope**:
  - Add cancellation reason prompt before cancelling an appointment.
  - Allow patients to rate (1–5 stars) and review completed consultations.
  - Compute average rating on doctor profile cards.
- **Target Files**: `frontend/src/pages/patient/MyAppointments.jsx`, `backend/models/Appointment.js`, `backend/models/Doctor.js`

---

## 🔴 HARD (5 Advanced Complexity Issues)

### Issue 11: [Real-Time] Server-Sent Events (SSE) / WebSocket Notifications for Waiting List Reassignments
- **Difficulty**: Hard
- **Labels**: `enhancement`, `architecture`
- **Problem**: When an appointment is cancelled, waiting patients must manually refresh to see if they were assigned a slot.
- **Scope**:
  - Implement Server-Sent Events (SSE) or Socket.io connection manager on backend.
  - When an appointment cancellation auto-assigns a slot to a waiting patient, push an immediate real-time event to the patient's browser.
  - Display an interactive push notification toast with quick confirmation actions.
- **Target Files**: `backend/services/notificationService.js`, `backend/controllers/waitingListController.js`, `frontend/src/context/NotificationContext.jsx`

### Issue 12: [Scheduling] Recurring Doctor Availability Windows & Break Exclusions Engine
- **Difficulty**: Hard
- **Labels**: `enhancement`, `architecture`
- **Problem**: Doctors can only set single static availability windows. They cannot set recurring weekly schedules (e.g. Mon–Fri 9:00–17:00 with 13:00–14:00 lunch break).
- **Scope**:
  - Redesign `Availability` model to support recurring day-of-week rules and break exclusions.
  - Upgrade the slot computation engine in `availabilityController.js` to dynamically generate 30-minute slots while excluding lunch breaks and holiday blackouts.
  - Build an interactive calendar UI for doctors to manage weekly working rules.
- **Target Files**: `backend/models/Availability.js`, `backend/controllers/availabilityController.js`, `frontend/src/pages/doctor/AvailabilityManagement.jsx`

### Issue 13: [Performance] Redis Caching Layer for Doctor Search & Department Queries
- **Difficulty**: Hard
- **Labels**: `enhancement`, `performance`
- **Problem**: High-volume queries for active departments and doctor search filters hit MongoDB repeatedly, slowing down response times.
- **Scope**:
  - Integrate Redis client into backend.
  - Cache responses for `GET /api/departments` and `GET /api/doctors` with configurable TTL.
  - Implement automatic cache invalidation whenever an admin updates doctor profiles or toggles department active status.
- **Target Files**: `backend/config/redis.js`, `backend/controllers/doctorController.js`, `backend/controllers/departmentController.js`

### Issue 14: [Analytics] Real-Time Hospital Administrative Analytics Suite & Metrics Charts
- **Difficulty**: Hard
- **Labels**: `enhancement`, `analytics`
- **Problem**: Administrators lack visual data analytics to monitor hospital utilization rates, peak booking hours, and revenue trends.
- **Scope**:
  - Create MongoDB aggregation pipelines for monthly completion rates, peak booking time slots, department utilization percentages, and doctor revenue summaries.
  - Build an interactive Admin Analytics Dashboard using Chart.js or Recharts.
- **Target Files**: `backend/controllers/adminAnalyticsController.js`, `frontend/src/pages/admin/AnalyticsDashboard.jsx`

### Issue 15: [Security] Refresh Token Rotation, Multi-Device Session Revocation & RBAC Audit Logging
- **Difficulty**: Hard
- **Labels**: `security`, `architecture`
- **Problem**: Current JWT authentication relies on single bearer tokens without refresh token rotation, device session revocation, or security audit logs.
- **Scope**:
  - Implement HTTP-only secure cookie Refresh Tokens with automatic token rotation and reuse detection.
  - Allow users to view active logged-in devices and revoke sessions.
  - Build an audit log system recording all sensitive administrative role changes and status updates.
- **Target Files**: `backend/models/RefreshToken.js`, `backend/models/AuditLog.js`, `backend/middlewares/authMiddleware.js`, `backend/controllers/authController.js`
