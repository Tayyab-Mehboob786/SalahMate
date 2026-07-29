# Product Requirements Document (PRD)

# SalahMate
### AI-Powered Salah Tracking & Motivation Application

---

# 1. Product Overview

SalahMate is a mobile application designed to help Muslims build consistency in performing the five daily prayers. The application enables users to track their prayers, monitor progress through analytics, maintain prayer streaks, and receive personalized AI-generated motivational messages based on their prayer habits.

Unlike traditional prayer reminder applications, SalahMate focuses on behavior improvement by combining prayer tracking, progress visualization, and AI-driven motivation to encourage long-term consistency.

---

# 2. Problem Statement

Many Muslims struggle to maintain consistency in praying all five daily prayers due to busy schedules, lack of motivation, or irregular routines.

Existing applications primarily provide prayer timings and reminders but do not actively encourage behavioral improvement or analyze user prayer patterns.

SalahMate aims to bridge this gap by providing intelligent motivation and meaningful progress tracking.

---

# 3. Product Vision

To become a personal Islamic companion that motivates users to develop a lifelong habit of performing Salah consistently through intelligent tracking, analytics, and personalized encouragement.

---

# 4. Target Users

## Primary Users

- Teenagers learning prayer discipline
- University students
- Working professionals
- Adults seeking consistency
- Muslims returning to regular Salah

## Secondary Users

- Parents monitoring personal progress
- Elderly users wanting a simple prayer tracker

---

# 5. Project Goals

- Help users maintain daily Salah.
- Increase prayer consistency.
- Encourage habit formation.
- Provide meaningful insights through analytics.
- Deliver AI-generated motivational messages.
- Build an intuitive and minimal user experience.

---

# 6. Core Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- Forgot Password (Future)
- Profile Management

---

## Prayer Tracking

Users can:

- Mark prayers as completed
- Mark prayers as missed
- View daily prayer status
- Edit today's prayer status
- View prayer history

Five prayers:

- Fajr
- Dhuhr
- Asr
- Maghrib
- Isha

---

## Prayer Streaks

Automatically calculate:

- Current streak
- Longest streak
- Daily completion percentage
- Weekly completion
- Monthly completion

---

## Dashboard

Display:

- Today's prayers
- Current streak
- Longest streak
- Weekly statistics
- Monthly statistics
- Prayer completion charts

---

## Prayer Timings

- Automatic location detection
- Manual city selection
- Accurate prayer timings
- Next prayer countdown

---

## AI Motivation

Analyze user prayer history.

Generate personalized motivational messages based on:

- Frequently missed prayers
- Streak performance
- User consistency
- Recent activity

Example:

> "You've completed Fajr consistently for 5 days. Keep the momentum going!"

---

## Analytics

Provide:

- Prayer completion percentage
- Missed prayer analysis
- Weekly charts
- Monthly charts
- Prayer-wise statistics

---

## Notifications

- Prayer reminders
- Daily motivation
- Streak reminders

---

## User Settings

- Dark Mode
- Light Mode
- Notification Settings
- Location Settings
- Account Settings

---

# 7. Premium Features (Future)

- Unlimited AI motivation
- Advanced analytics
- Historical insights
- Export prayer reports
- Family prayer groups
- Personalized AI coaching

---

# 8. User Flow

Launch App

↓

Authentication

↓

Home Dashboard

↓

Track Today's Prayers

↓

View Analytics

↓

Receive AI Motivation

↓

Maintain Daily Streak

---

# 9. Functional Requirements

## User

- Register
- Login
- Logout
- Update profile

## Prayer

- Add prayer log
- Update prayer status
- View prayer history

## Dashboard

- Display statistics
- Display streaks
- Display completion percentage

## AI

- Generate motivational messages
- Analyze prayer history

## Notifications

- Schedule reminders
- Daily motivation

---

# 10. Non-Functional Requirements

## Performance

- API response < 300 ms
- Smooth mobile experience
- Fast dashboard loading

## Security

- JWT Authentication
- Password hashing
- Secure APIs
- HTTPS communication

## Scalability

Architecture should support:

- Thousands of users
- AI integration
- Premium subscriptions

## Reliability

- High availability
- Data consistency
- Backup support

---

# 11. Tech Stack

## Frontend

- React Native CLI
- TypeScript

## Backend

- NestJS
- TypeScript

## Database

- PostgreSQL

## ORM

- Prisma ORM

## Authentication

- JWT
- Passport.js

## AI

- Groq API (or other LLM)

## Notifications

- Firebase Cloud Messaging (FCM)

---

# 12. Success Metrics

- Daily Active Users
- Prayer Logging Rate
- Average Prayer Streak
- User Retention
- AI Motivation Engagement
- Premium Conversion Rate (Future)

---

# 13. Future Roadmap

Version 1.0

- Authentication
- Prayer Tracking
- Dashboard
- Prayer Timings
- Analytics
- AI Motivation

Version 1.5

- Enhanced AI coaching
- Better analytics
- Smart recommendations

Version 2.0

- Family groups
- Leaderboards
- Community challenges
- Wearable device integration
- Multi-language support

---

# 14. Out of Scope (Version 1)

- Social networking
- Public prayer sharing
- Mosque management
- Donation platform
- Quran learning modules
- Live scholar chat

---

# 15. Project Objective

Build a clean, scalable, and production-ready mobile application that helps Muslims improve their Salah consistency through intelligent tracking, personalized motivation, and meaningful progress analytics.