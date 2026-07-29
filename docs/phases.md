# Development Phases

# SalahMate
### Project Development Roadmap

---

# Overview

This document breaks the development of SalahMate into manageable phases. Each phase has a clear goal, deliverables, and completion criteria.

The phases are designed so that each completed phase results in a functional and testable part of the application before moving to the next.

---

# Development Order

```text
Phase 1
Authentication

↓

Phase 2
Home Dashboard

↓

Phase 3
Prayer Tracking

↓

Phase 4
Prayer Timings

↓

Phase 5
Analytics

↓

Phase 6
AI Motivation

↓

Phase 7
Notifications

↓

Phase 8
Settings & Profile

↓

Phase 9
Polishing & Testing

↓

Version 1.0 Release
```

---

# Phase 0 — Project Foundation

## Goal

Prepare the development environment and project architecture.

### Frontend

- Initialize React Native CLI project
- Configure TypeScript
- Install dependencies
- Configure navigation
- Create folder structure
- Configure theme
- Create reusable components
- Setup Axios
- Setup environment configuration

### Backend

- Initialize NestJS project
- Configure Prisma
- Setup PostgreSQL
- Configure environment variables
- Create module structure
- Configure validation
- Configure JWT
- Configure Swagger (optional)
- Configure global exception filters

### Deliverables

- Project builds successfully
- Backend connects to PostgreSQL
- Frontend communicates with backend
- Git repository initialized

---

# Phase 1 — Authentication

## Goal

Allow users to securely create an account and log in.

### Backend

- Register API
- Login API
- JWT generation
- Password hashing
- Authentication Guard
- Current User endpoint

### Frontend

- Splash Screen
- Welcome Screen
- Login Screen
- Register Screen
- Forgot Password placeholder
- Form validation
- Token storage
- Auto Login

### Deliverables

Users can:

- Register
- Login
- Stay logged in
- Logout

---

# Phase 2 — Home Dashboard

## Goal

Create the application's main dashboard.

### Features

- Greeting
- Today's Date
- Hijri Date
- Current Streak
- Longest Streak
- Today's Prayer Status
- Prayer Completion Percentage
- Quick Actions
- Daily Motivation Card

### Deliverables

Dashboard displays user information and today's progress.

---

# Phase 3 — Prayer Tracking

## Goal

Allow users to record daily prayers.

### Features

- Display five daily prayers
- Mark prayer completed
- Mark prayer missed
- Edit today's prayer
- Prayer history
- Daily completion calculation
- Update streak automatically

### Backend

- Prayer CRUD APIs
- Prayer Log service
- Streak calculation

### Deliverables

Users can track all daily prayers.

---

# Phase 4 — Prayer Timings

## Goal

Provide accurate prayer timings.

### Features

- Detect current location
- Manual city selection
- Daily prayer timetable
- Next prayer countdown
- Refresh timings

### Backend

- Prayer Timing service
- External Prayer API integration
- Caching

### Deliverables

Prayer timings display correctly based on location.

---

# Phase 5 — Analytics

## Goal

Help users understand their prayer habits.

### Features

- Weekly analytics
- Monthly analytics
- Completion percentage
- Prayer-wise statistics
- Missed prayer analysis
- Charts
- Progress summary

### Backend

- Analytics service
- Aggregated statistics

### Deliverables

Users can visualize their progress.

---

# Phase 6 — AI Motivation

## Goal

Provide personalized motivational messages.

### Features

- Analyze prayer history
- Generate AI prompt
- Request LLM response
- Display motivational message
- Save motivation history

### Backend

- AI Service
- Prompt Builder
- LLM Integration
- Motivation History

### Deliverables

Users receive personalized motivational messages based on prayer patterns.

---

# Phase 7 — Notifications

## Goal

Remind users about prayers and maintain engagement.

### Features

- Prayer reminders
- Daily motivation notification
- Streak reminders
- Notification preferences

### Backend

- Notification scheduling
- Push notification service

### Deliverables

Notifications are sent reliably and respect user preferences.

---

# Phase 8 — Profile & Settings

## Goal

Allow users to manage their account and preferences.

### Profile

- View profile
- Edit profile
- Change password (future)
- Logout

### Settings

- Dark mode
- Notification settings
- Location settings
- About screen
- Privacy policy
- Terms & Conditions

### Deliverables

Users can customize the application.

---

# Phase 9 — Testing & Polish

## Goal

Prepare the application for release.

### Tasks

- UI polishing
- Animation improvements
- Bug fixing
- Performance optimization
- Error handling review
- Accessibility improvements
- Code cleanup
- Remove unused files
- Improve loading states
- Improve empty states

### Deliverables

Stable Release Candidate.

---

# Phase 10 — Deployment

## Backend

- Deploy NestJS
- Configure environment variables
- Setup PostgreSQL production database
- Configure SSL
- Verify API endpoints

### Mobile

- Generate Android release build
- Test on physical devices
- App icon
- Splash screen
- Versioning

### Deliverables

Production-ready Version 1.0.

---

# Version 1.0 Feature Checklist

## Authentication

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Auto Login

---

## Dashboard

- [ ] Greeting
- [ ] Today's prayers
- [ ] Streak
- [ ] Daily summary

---

## Prayer Tracking

- [ ] Mark prayer
- [ ] Edit prayer
- [ ] Prayer history

---

## Prayer Timings

- [ ] Automatic location
- [ ] Manual city
- [ ] Countdown

---

## Analytics

- [ ] Weekly charts
- [ ] Monthly charts
- [ ] Completion percentage

---

## AI

- [ ] Personalized motivation
- [ ] Prayer analysis
- [ ] Motivation history

---

## Notifications

- [ ] Prayer reminders
- [ ] Daily motivation
- [ ] Streak reminders

---

## Settings

- [ ] Dark mode
- [ ] Notification preferences
- [ ] Location settings

---

# Future Phases (Post v1.0)

## Version 1.5

- Enhanced AI coaching
- Advanced analytics
- Historical insights
- Smart recommendations
- Export reports

---

## Version 2.0

- Premium subscriptions
- Family groups
- Community challenges
- Achievement badges
- Leaderboards
- Offline synchronization
- Multi-language support
- Admin dashboard

---

# Definition of Done (DoD)

A phase is considered complete only when:

- All planned features are implemented.
- Code follows `RULE.md`.
- APIs are tested.
- UI is responsive and functional.
- No critical bugs remain.
- Documentation is updated.
- The application builds successfully.
- The feature is ready for the next phase without requiring unfinished dependencies.