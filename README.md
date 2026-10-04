# Hospital Appointment Allocation Platform (SIH260136)

A full-stack MERN application for managing hospital departments, doctor profiles, doctor availability windows, appointment scheduling, and automated patient waiting lists.

---

## Problem Statement
**SIH260136 — Hospital Appointment Allocation Platform**

Hospitals often struggle with inefficient scheduling, slot conflicts, and underutilized appointment capacity when bookings are cancelled. This platform provides a clean baseline system that enables:
- **Patients** to search for doctors by department/specialization, view real-time availability slots, book appointments, manage their schedule, and join a waiting list when slots are full.
- **Doctors** to publish custom availability windows, view upcoming appointments, complete consultations, and manage their profile.
- **Administrators** to oversee system operations, manage departments, doctors, and patients, view global appointment schedules, and inspect waiting lists.
- **Backend conflict prevention** to guarantee that double-booking for the same doctor, date, and time slot is impossible at the database level.
- **Automated waiting list reassignment** to automatically offer freed slots to eligible waiting patients when an existing booking is cancelled.

---

## Tech Stack

- **Frontend**: React (Vite), React Router v7, Tailwind CSS v4, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## Features

### Authentication & Authorization
- Secure JWT-based authentication for Patients, Doctors, and Administrators.
- Password hashing with `bcryptjs`.
- Sensitive fields (passwords) are excluded from API responses.
- Role-based authorization middleware protecting endpoints and frontend routes.

### Patient Portal
- **Dashboard**: View statistics (upcoming, completed, cancelled appointments, waiting list status).
- **Find Doctors**: Search by name, filter by department or specialization.
- **View Slots**: Live availability slot generation (30 min / customizable duration).
- **Book Appointment**: Real-time slot validation to prevent past or duplicate bookings.
- **My Appointments**: Filter by status, view detailed info, and cancel bookings.
- **Waiting List**: Join a waiting list when a doctor's date is fully booked; auto-assigned on slot cancellation.
- **Profile Management**: Update contact info, date of birth, blood group, address.

### Doctor Portal
- **Dashboard**: Today's schedule, upcoming appointments count, waiting patient count.
- **Manage Availability**: Add, update, or remove working time windows with custom slot durations.
- **Manage Appointments**: Filter appointments by date and status, add consultation notes, mark completed/cancelled.
- **Doctor Profile**: Update bio, consultation fees, experience, and qualifications.

### Admin Portal
- **System Statistics**: Overview of total patients, active doctors, departments, appointment counts, and waiting list metrics.
- **Department Management**: Create, update, and deactivate hospital departments.
- **Doctor Management**: Onboard new doctors, edit profiles, assign departments, and toggle active status.
- **Patient Management**: Search patient records, toggle user account active status.
- **Appointments & Waiting Lists**: Monitor all system appointments and waiting list queues.

---

## Project Structure

```
hospital-appointment-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── availabilityController.js
│   │   ├── departmentController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   ├── userController.js
│   │   └── waitingListController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Bearer token verification
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── roleMiddleware.js     # Role authorization guard
│   ├── models/
│   │   ├── Appointment.js        # Holds unique compound partial index
│   │   ├── Availability.js
│   │   ├── Department.js
│   │   ├── Doctor.js
│   │   ├── User.js
│   │   └── WaitingList.js
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── availabilityRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── userRoutes.js
│   │   └── waitingListRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── scripts/
│   │   └── seed.js               # Initial admin & department seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                  # Axios instance & domain API methods
│   │   ├── components/           # UI components (admin, appointments, common, doctors)
│   │   ├── context/              # AuthContext provider
│   │   ├── hooks/                # Custom hooks (useAuth, useFetch)
│   │   ├── pages/                # Auth, Patient, Doctor, Admin pages
│   │   ├── utils/                # Date/time formatters & validators
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind v4 configuration & styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js**: `v18.x` or later
- **npm**: `v9.x` or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/hospital_appointments`) or MongoDB Atlas connection string.

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd hospital-appointment-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` by copying `.env.example`:
```bash
cp .env.example .env
```

Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hospital_appointments
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

> **MongoDB Atlas Note**: If connecting to MongoDB Atlas (`mongodb+srv://...`), make sure your current physical IP address is whitelisted under **Network Access** in the MongoDB Atlas Console.

Seed the initial database (creates Admin account and initial departments):
```bash
npm run seed
```

Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` by copying `.env.example`:
```bash
cp .env.example .env
```

Configure `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

## API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System and DB health check |
| `POST` | `/api/auth/register` | Public | Register a patient or doctor account |
| `POST` | `/api/auth/login` | Public | User login (returns JWT token) |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details |
| `GET` | `/api/departments` | Public | List active hospital departments |
| `POST` | `/api/departments` | Admin | Create a new department |
| `GET` | `/api/doctors` | Authenticated | List/search doctors with filters |
| `GET` | `/api/doctors/:id` | Authenticated | Get doctor details |
| `GET` | `/api/availability/doctor/:doctorId` | Authenticated | Get doctor availability windows |
| `GET` | `/api/availability/doctor/:doctorId/slots` | Authenticated | Get computed time slots for a date |
| `POST` | `/api/availability` | Doctor | Publish a doctor availability window |
| `POST` | `/api/appointments` | Patient | Book an appointment slot |
| `GET` | `/api/appointments/my` | Patient | View patient's appointments |
| `PATCH`| `/api/appointments/:id/cancel` | Patient/Doc/Admin| Cancel appointment & trigger waiting list assignment |
| `PATCH`| `/api/appointments/:id/status` | Doctor/Admin | Update status to `completed` or `cancelled` |
| `POST` | `/api/waiting-list` | Patient | Join doctor waiting list for a date |
| `GET` | `/api/waiting-list/my` | Patient | View patient's waiting list entries |
| `GET` | `/api/users/stats` | Admin | Get system overview statistics |

---

## Basic Workflow

1. **System Admin**: Log in with default admin credentials (`admin@example.com` / `Admin@12345`). Seed or manage departments and onboard doctors.
2. **Doctor**: Log in with doctor credentials. Navigate to **Availability** and publish working windows (e.g. `09:00 - 12:00` with 30 min duration).
3. **Patient**: Register a patient account, search for a doctor, select an available time slot, and book an appointment.
4. **Duplicate Booking Test**: Attempt to book the same doctor, date, and slot with another account — verify the system rejects the booking.
5. **Waiting List & Reassignment**: If a date is fully booked, join the waiting list. When the existing appointment is cancelled, the system automatically assigns the slot to the waiting patient.
