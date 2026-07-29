# System Architecture

# SalahMate
### AI-Powered Salah Tracking & Motivation Application

---

# 1. Overview

SalahMate follows a modern client-server architecture where the mobile application communicates with a RESTful backend API. The backend handles authentication, business logic, AI integration, and database operations, while PostgreSQL stores all application data using Prisma ORM.

The architecture is designed to be scalable, maintainable, and modular, allowing new features to be added with minimal changes.

---

# 2. High-Level Architecture

```text
                   +-----------------------+
                   |    React Native App   |
                   |      (Frontend)       |
                   +-----------+-----------+
                               |
                               |
                         HTTPS / REST API
                               |
                               |
                   +-----------v-----------+
                   |       NestJS API      |
                   |      (Backend)        |
                   +-----------+-----------+
                               |
               +---------------+----------------+
               |               |                |
               |               |                |
      Authentication      Business Logic     AI Service
      JWT + Passport        Services        Motivation
               |               |                |
               +---------------+----------------+
                               |
                         Prisma ORM
                               |
                   +-----------v-----------+
                   |     PostgreSQL DB     |
                   +-----------------------+
```

---

# 3. Application Flow

## User Authentication

```text
User

↓

Login / Register

↓

NestJS Authentication Module

↓

Validate Credentials

↓

Generate JWT Token

↓

Return Token

↓

Store Token Securely

↓

Access Protected Features
```

---

## Prayer Tracking Flow

```text
User Marks Prayer

↓

React Native

↓

REST API

↓

Prayer Service

↓

Prisma ORM

↓

PostgreSQL

↓

Updated Statistics

↓

Response Returned

↓

Dashboard Refreshes
```

---

## AI Motivation Flow

```text
User Opens Dashboard

↓

Backend Retrieves Prayer History

↓

Analyze Prayer Patterns

↓

Generate Prompt

↓

LLM API

↓

Receive Motivational Message

↓

Return to Mobile App
```

---

# 4. Technology Stack

## Frontend

- React Native CLI
- TypeScript
- React Navigation
- Axios
- React Hook Form
- Zod (Validation)
- React Native Vector Icons
- AsyncStorage / Secure Storage

---

## Backend

- NestJS
- TypeScript
- Express (Default NestJS Adapter)
- JWT Authentication
- Passport.js
- Class Validator
- Class Transformer

---

## Database

- PostgreSQL

---

## ORM

- Prisma ORM

---

## AI

- Groq API (or another LLM provider)

---

## Notifications

- Firebase Cloud Messaging (FCM)

---

## Development Tools

- Android Studio
- VS Code / Google AI Studio (Antigravity)
- Postman
- Git
- GitHub

---

# 5. Project Structure

## Frontend Structure

```text
mobile/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── cards/
│   │   ├── buttons/
│   │   ├── charts/
│   │   └── modals/
│   │
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── prayers/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── profile/
│   │
│   ├── navigation/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── types/
│   │
│   └── App.tsx
│
├── android/
├── ios/
└── package.json
```

---

## Backend Structure

```text
backend/
│
├── src/
│   │
│   ├── auth/
│   │
│   ├── users/
│   │
│   ├── prayers/
│   │
│   ├── dashboard/
│   │
│   ├── analytics/
│   │
│   ├── motivation/
│   │
│   ├── notifications/
│   │
│   ├── common/
│   │
│   ├── config/
│   │
│   ├── prisma/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
└── package.json
```

---

# 6. Module Architecture

Each backend feature follows NestJS's modular architecture.

```text
Feature Module

├── Controller
│      │
│      ▼
├── Service
│      │
│      ▼
├── Prisma Service
│      │
│      ▼
└── PostgreSQL
```

Example:

```text
Prayers Module

prayers.controller.ts

↓

prayers.service.ts

↓

prisma.service.ts

↓

PostgreSQL
```

---

# 7. Database Architecture

The database is relational and managed through Prisma ORM.

Core entities include:

- Users
- PrayerLogs
- PrayerStreaks
- Motivations
- Notifications
- Settings

Relationships:

```text
User

├── Prayer Logs

├── Prayer Streak

├── Motivation History

├── Notification Preferences

└── Settings
```

---

# 8. API Communication

The frontend communicates with the backend using REST APIs over HTTPS.

Typical request flow:

```text
React Native

↓

Axios Request

↓

NestJS Controller

↓

NestJS Service

↓

Prisma ORM

↓

PostgreSQL

↓

JSON Response

↓

React Native UI
```

---

# 9. Authentication Architecture

Authentication uses JWT.

```text
Register

↓

Password Hashing

↓

Store User

↓

Login

↓

Validate Password

↓

Generate JWT

↓

Return Access Token

↓

Authenticated Requests
```

Protected endpoints require a valid JWT token in the Authorization header.

---

# 10. Error Handling

Errors are handled centrally by the backend.

Examples:

- Validation Errors
- Unauthorized Access
- Resource Not Found
- Internal Server Errors

The frontend displays user-friendly messages while logging technical details for debugging.

---

# 11. Scalability Considerations

The architecture is designed to support future enhancements, including:

- Premium subscriptions
- AI coaching improvements
- Family groups
- Offline synchronization
- Multi-language support
- Admin dashboard
- Cloud deployment
- Push notification scheduling

---

# 12. Security

Security measures include:

- JWT Authentication
- Password hashing (bcrypt)
- Input validation
- Environment variables
- Secure API endpoints
- HTTPS communication
- SQL injection protection through Prisma
- CORS configuration

---

# 13. Deployment Architecture (Future)

```text
React Native App

↓

NestJS API

↓

AWS EC2

↓

Prisma ORM

↓

AWS RDS PostgreSQL

↓

Firebase Cloud Messaging

↓

Groq API
```

---

# 14. Design Principles

The project follows these architectural principles:

- Modular architecture
- Separation of concerns
- Clean code practices
- Reusable components
- Feature-based organization
- Scalable backend modules
- Strong typing with TypeScript
- Database abstraction through Prisma ORM
- Maintainable and testable codebase