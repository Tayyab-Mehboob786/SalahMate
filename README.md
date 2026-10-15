SalahMate – AI-Based Salah Activity Tracker

**SalahMate** is an AI-powered mobile application designed to help Muslims build consistency in their daily Salah, monitor prayer activity, track personal spiritual goals, and strengthen their connection with Islam through personalized AI-powered guidance.

The application combines prayer tracking, prayer timings, Quran content, spiritual insights, and an AI chatbot in a single mobile experience.

## ✨ Features

- Prayer Tracking: Record daily Salah activity and monitor prayer completion.
- Prayer Timings: View daily prayer timings using the AlAdhan API.
- Prayer Streaks: Track consistency in daily prayer activity.
- Progress Analytics: Review prayer completion statistics and identify prayer patterns.
- Personal Spiritual Goals: Create and manage goals related to Quran, Salah, Adhkar, learning, and custom activities.
- AI SalahMate Chatbot: Interact with an AI assistant for Salah-related questions and spiritual guidance.
- Daily Spiritual Insights: Receive dynamically generated spiritual insights.
- Sunnah Reminders: Explore reminders that encourage positive spiritual habits.
- Quran Content and Audio: Access Quran-related content and audio through API integration.
- User Authentication: Register and log in to access personalized application features.

 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Mobile Application | React Native, Expo |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Integration | Groq API |
| Prayer Timings | AlAdhan API |
| Quran Content and Audio | Quran API |
| API Testing | Postman |
| Version Control | Git, GitHub |

## 🏗️ Project Structure

```text
SalahMate/
├── app/          # React Native Expo mobile application
├── backend/      # NestJS backend application
├── README.md
└── ...
```

*Note: The directory structure above is a simplified overview. Refer to the repository for the complete project structure.*

## ⚙️ Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js and npm
- PostgreSQL
- Expo Go or an Android development environment
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Tayyab-Mehboob786/SalahMate
cd SalahMate
```

Replace `https://github.com/Tayyab-Mehboob786/SalahMate` with your repository's actual HTTPS or SSH URL.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Configure the environment variables required by the backend in your local `.env` file. These may include database connection settings and API credentials, depending on the current implementation.

Ensure PostgreSQL is running and your database is configured.

Run the Prisma commands specified by your project's current Prisma configuration and package scripts. Then start the backend using the appropriate development command from `package.json`.

For example, if the project defines the standard NestJS development script:

```bash
npm run start:dev
```

### 3. Set Up the Mobile Application

Open a separate terminal:

```bash
cd app
npm install
```

Configure the backend API base URL and any required application environment variables for your device or emulator.

Start Expo using the script defined in the app's `package.json`. For a standard Expo setup, this is typically:

```bash
npx expo start
```

Follow the Expo terminal instructions to open the application on a compatible device or emulator.

*Important: Exact setup commands, database migrations, and environment variable names should be confirmed against the current repository configuration.*

## 🔐 Environment Variables

Create local environment files as required by the backend and mobile application.

Typical configuration may include:

- PostgreSQL database connection URL.
- AI provider API key.
- Backend API base URL.
- Other API credentials required by the application.

**Never commit `.env` files, database passwords, API keys, access tokens, or other secrets to GitHub.** Provide an `.env.example` file containing placeholder values if you want to document the required configuration.

## 🧪 Testing

Use Postman to test the backend endpoints and verify authentication, prayer tracking, goal management, analytics, and AI chatbot functionality.

The exact endpoints and available automated tests are defined by the current backend implementation.

## 🎯 Project Objective

SalahMate aims to make daily Salah tracking more accessible and engaging by combining activity monitoring, progress analytics, personal spiritual goals, Quran resources, and AI-assisted guidance in one mobile application.

## 👨‍💻 Developed As

**Final Year Project (FYP)**  
AI-Based Salah Activity Tracker — SalahMate

## 📄 License

No license has been specified yet. If you intend to make this repository open source, consider adding an appropriate license file.
