# Hospital Management System — Databases Laboratory Project

A full-stack hospital management application built as a Databases laboratory project. The system models a hospital domain with **10 relational tables** and exposes a REST API backed by a React frontend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 4.0.6, Spring Data JPA |
| Database | MySQL |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Frontend | React 19, Vite, React Router, Axios |

## Database Schema (10 Tables)

```
departments
    └── doctors  ──────────────────────────────┐
                                               │
patients ──── appointments ─────── doctors     │
    │                                          │
    ├──── medical_records ──── doctors         │
    │         └── prescriptions ── medications │
    │                                          │
    ├──── admissions ──── rooms ── departments ┘
    │
    └──── bills
```

| # | Table | Key Relations |
|---|-------|---------------|
| 1 | `departments` | root — no FK dependencies |
| 2 | `doctors` | belongs to `departments` |
| 3 | `patients` | root — no FK dependencies |
| 4 | `rooms` | belongs to `departments` |
| 5 | `appointments` | patient + doctor |
| 6 | `medical_records` | patient + doctor |
| 7 | `prescriptions` | medical_record + medication |
| 8 | `medications` | root — no FK dependencies |
| 9 | `admissions` | patient + room |
| 10 | `bills` | patient |

### Enums

- `BloodType` — A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG
- `Gender` — MALE, FEMALE, OTHER
- `AppStatus` — SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
- `AdmissionStatus` — ADMITTED, DISCHARGED, TRANSFERRED
- `BillStatus` — PENDING, PAID, CANCELLED
- `RoomStatus` — AVAILABLE, OCCUPIED, MAINTENANCE
- `Type` — room type enum
- `Dosage` — prescription dosage enum

## Project Structure

```
proiect_db/
├── src/main/java/com/example/proiect_db/
│   ├── Model/          # JPA entities (10 tables)
│   ├── Repository/     # Spring Data JPA repositories
│   ├── Service/        # Business logic layer
│   ├── Controller/     # REST controllers
│   ├── Enum/           # Domain enumerations
│   └── CorsConfig.java # CORS configuration for frontend
├── frontend/           # React + Vite frontend
│   └── src/
│       ├── api/
│       │   └── axiosClient.js      # Axios instance (baseURL, headers)
│       ├── services/
│       │   └── api.js              # CRUD helpers for all 10 entities
│       ├── components/
│       │   ├── Layout.jsx          # App shell: sidebar nav + topbar
│       │   └── Modal.jsx           # Reusable modal dialog
│       ├── pages/
│       │   ├── DashboardPage.jsx   # Live stat cards for all entities
│       │   ├── DepartmentsPage.jsx
│       │   ├── DoctorsPage.jsx
│       │   ├── PatientsPage.jsx
│       │   ├── RoomsPage.jsx
│       │   ├── AppointmentsPage.jsx
│       │   ├── MedicalRecordsPage.jsx
│       │   ├── MedicationsPage.jsx
│       │   ├── PrescriptionsPage.jsx
│       │   ├── AdmissionsPage.jsx
│       │   └── BillsPage.jsx
│       └── App.jsx                 # Router (all 10 routes + dashboard)
└── pom.xml
```

## Running the Project

### Prerequisites

- Java 17+
- Maven
- MySQL (running locally)
- Node.js + npm

### Backend

1. Configure your database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db
   spring.datasource.username=<your_user>
   spring.datasource.password=<your_password>
   spring.jpa.hibernate.ddl-auto=update
   ```

2. Build and run:
   ```bash
   mvn spring-boot:run
   ```

   The API will be available at `http://localhost:8081/api/hospital`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Documentation

Swagger UI is available at:

```
http://localhost:8081/swagger-ui.html
```

## REST Endpoints

Each entity exposes standard CRUD endpoints:

| Entity | Base Path |
|--------|-----------|
| Departments | `/api/hospital/departments` |
| Doctors | `/api/hospital/doctors` |
| Patients | `/api/hospital/patients` |
| Rooms | `/api/hospital/rooms` |
| Appointments | `/api/hospital/appointments` |
| Medical Records | `/api/hospital/medical-records` |
| Medications | `/api/hospital/medications` |
| Prescriptions | `/api/hospital/prescriptions` |
| Admissions | `/api/hospital/admissions` |
| Bills | `/api/hospital/bills` |