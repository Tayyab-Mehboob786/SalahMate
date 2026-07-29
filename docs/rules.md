# Development Rules & Coding Standards

# SalahMate
### Project Development Guidelines

---

# Purpose

This document defines the development rules, coding standards, architectural boundaries, approved libraries, and best practices for the SalahMate project.

Every contributor and AI assistant must follow these rules to ensure the project remains consistent, scalable, secure, and maintainable.

---

# 1. General Principles

## MUST

- Write clean and readable code.
- Follow TypeScript best practices.
- Keep components small and reusable.
- Follow SOLID principles where applicable.
- Prefer composition over inheritance.
- Use feature-based folder organization.
- Keep business logic separate from UI.
- Write meaningful variable and function names.
- Maintain consistency throughout the codebase.

---

## NEVER

- Write unnecessary comments.
- Duplicate code.
- Create extremely large components.
- Mix UI with business logic.
- Hardcode API URLs.
- Hardcode secrets or API keys.
- Ignore TypeScript errors.
- Disable ESLint rules without justification.

---

# 2. Frontend Rules

## Framework

✅ React Native CLI

NOT Expo.

---

## Language

✅ TypeScript

Never JavaScript.

---

## Styling

Use only:

- React Native StyleSheet

Do NOT use:

- Tailwind CSS
- NativeWind
- Styled Components
- Inline styling (except dynamic values)

---

## Navigation

Use:

- React Navigation

Avoid:

- Custom navigation implementations.

---

## API Calls

Use:

- Axios

Do NOT use:

- fetch()

---

## Forms

Use:

- React Hook Form

Validation:

- Zod

Avoid:

- Manual validation whenever possible.

---

## State Management

Current Version:

- React Context API
- Custom Hooks

Future (only if needed):

- Zustand

Do NOT use:

- Redux
- MobX

Unless project complexity requires it.

---

## Storage

Use:

- AsyncStorage
- Secure Storage for authentication tokens

Never store:

- Passwords
- API Keys

---

# 3. Backend Rules

Framework:

✅ NestJS

Language:

✅ TypeScript

---

## Architecture

Every feature must follow:

Controller

↓

Service

↓

Prisma

↓

Database

Never place database queries inside controllers.

---

## Validation

Use:

- class-validator
- class-transformer

Every DTO must include validation.

---

## Authentication

Use:

- JWT
- Passport

Passwords:

- bcrypt hashing

Never:

- Store plain text passwords.

---

## Logging

Use:

- NestJS Logger

Never use:

```ts
console.log()
```

except during temporary debugging.

---

# 4. Database Rules

Database:

✅ PostgreSQL

ORM:

✅ Prisma

Never write raw SQL unless absolutely necessary.

Prefer Prisma Client methods.

Always use Prisma Migrations.

Never manually modify production database tables.

---

# 5. API Design Rules

Follow REST principles.

Example:

GET /users

GET /users/:id

POST /auth/login

POST /auth/register

PATCH /users/profile

DELETE /notifications/:id

---

## Responses

Success

```json
{
  "success": true,
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# 6. Folder Structure Rules

Use feature-first organization.

Good:

```text
users/
auth/
dashboard/
analytics/
```

Avoid:

```text
controllers/
services/
models/
```

at the project root.

---

# 7. Naming Conventions

Variables

camelCase

```ts
userProfile
```

Functions

camelCase

```ts
getPrayerLogs()
```

Classes

PascalCase

```ts
UserService
```

Interfaces

PascalCase

```ts
User
PrayerLog
```

Files

kebab-case

```text
user-profile.screen.tsx
prayer-card.component.tsx
```

---

# 8. Component Rules

Components should have one responsibility.

Avoid components larger than approximately 250 lines.

If a component becomes too large:

Split it.

---

# 9. Error Handling

Never silently ignore errors.

Frontend

Use:

- Try/Catch
- User-friendly messages

Backend

Use:

- NestJS Exception Filters
- HttpException
- Validation Exceptions

Never expose:

- Stack traces
- Database errors
- Internal implementation details

---

# 10. Environment Variables

Store in:

.env

Examples:

DATABASE_URL

JWT_SECRET

GROQ_API_KEY

FCM_SERVER_KEY

Never commit:

.env

to GitHub.

---

# 11. Git Rules

Commit messages should follow:

feat:

fix:

refactor:

docs:

style:

test:

Example:

```
feat: add prayer tracking module
```

Avoid commits like:

```
update

changes

final

done
```

---

# 12. AI Integration Rules

The AI system is **supportive**, not authoritative.

### AI Responsibilities

Allowed:

- Generate motivational messages
- Encourage consistency
- Analyze prayer habits
- Suggest positive habits
- Personalize encouragement

Not Allowed:

- Issue religious rulings (Fatwas)
- Interpret Islamic law
- Judge a user's faith
- Provide legal or theological opinions
- Replace qualified scholars
- Answer controversial religious questions
- Modify or invent Quranic verses or Hadith

---

## AI Tone

The AI should always be:

- Respectful
- Encouraging
- Positive
- Compassionate
- Non-judgmental
- Simple
- Motivational

Never:

- Shame users
- Threaten users
- Use guilt as motivation
- Make political statements
- Debate religious differences

---

## AI Prompt Safety

Never send:

- Passwords
- JWT Tokens
- Email addresses
- Phone numbers
- Personal identifiers

Only send anonymized prayer statistics necessary to generate a motivational response.

---

# 13. Performance Rules

Avoid unnecessary re-renders.

Use:

- memo()
- useMemo()
- useCallback()

only when profiling indicates a benefit.

Avoid premature optimization.

---

# 14. Security Rules

Always:

- Hash passwords
- Validate input
- Sanitize user data
- Verify JWT tokens
- Use HTTPS
- Protect private routes

Never:

- Trust client-side data
- Expose secrets
- Store sensitive data in plaintext
- Return confidential information in API responses

---

# 15. Testing Rules

Backend

- Unit tests for services
- Integration tests for APIs

Frontend

- Test critical user flows
- Validate forms
- Test navigation

---

# 16. Future Scalability

The architecture should allow adding:

- Premium subscriptions
- Family groups
- Offline mode
- Admin dashboard
- Wearable integrations
- Multiple AI providers
- Localization

without requiring major architectural changes.

---

# 17. Code Review Checklist

Before merging code:

- Project builds successfully
- No TypeScript errors
- No ESLint errors
- No unused imports
- No dead code
- No hardcoded values
- Proper validation
- Proper error handling
- Consistent naming
- Feature follows architecture
- Documentation updated if required

---

# 18. Libraries Approved for This Project

## Frontend

- React Native CLI
- React Navigation
- Axios
- React Hook Form
- Zod
- React Native Vector Icons
- AsyncStorage

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- Passport
- JWT
- bcrypt
- class-validator
- class-transformer

## AI

- Groq SDK (or approved LLM provider)

## Notifications

- Firebase Cloud Messaging (FCM)

---

# 19. Final Rule

Every new feature should answer **YES** to the following questions:

- Does it align with the PRD?
- Does it follow the architecture?
- Does it respect these development rules?
- Is it secure?
- Is it scalable?
- Is it maintainable?
- Is it understandable by another developer?

If the answer to any question is **NO**, revise the implementation before merging.