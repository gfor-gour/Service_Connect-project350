# Service Connect - Project350

A modern, AI-powered web platform that connects customers with trusted local service providers, streamlining discovery, booking, and communication.

---

## Table of Contents

- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Features](#features)
- [Technical Implementation](#technical-implementation)
- [Deployment](#deployment)
- [Expected Outcomes](#expected-outcomes)
- [Challenges](#challenges)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

In the digital era, both customers and service providers face challenges in connecting efficiently and securely. This project bridges that gap with a responsive, AI-enhanced web platform, simplifying the process of discovering and booking reliable local service providers.

## Problem Statement

Finding skilled and trustworthy local service providers (electricians, plumbers, babysitters, etc.) is often difficult due to unstructured discovery and lack of trust. Customers struggle to verify provider credibility, while providers lack effective ways to showcase their skills.

## Objectives

- Develop a user-friendly, responsive web platform.
- Utilize AI models for smart, personalized recommendations.
- Enable geolocation and map-based navigation.
- Facilitate secure, real-time messaging between users and providers.
- Provide dashboards for users, providers, and admins.
- Integrate a secure payment gateway (SSLCommerz).

## Features

- **AI-Powered Recommendations:** Personalized suggestions using LLM-based chatbot.
- **Maps Integration:** Location-aware filtering and navigation.
- **Dynamic Booking System:** Schedule appointments with time/date selection.
- **Secure Messaging:** Real-time, one-to-one communication.
- **Dashboards:** Separate interfaces for users, providers, and admins.
- **Admin Panel:** Centralized user and service management.
- **Payment Gateway:** Secure online transactions (SSLCommerz).

## Technical Implementation

**Frontend:**
- [Next.js](https://nextjs.org/): Server-side rendering and optimized performance.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS for responsive design.

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/): RESTful API and routing.
- JWT & Nodemailer: Authentication and email notifications.

**Database:**
- [MongoDB](https://www.mongodb.com/): Cloud-hosted database for users, providers, and bookings.

**APIs & Integrations:**
- Maps API: Geolocation and navigation.
- Gemini: AI chatbot for recommendations.

## Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com/) for high availability and fast global delivery.
- **Backend:** Node.js/Express server with MongoDB Atlas.

## Expected Outcomes

- Centralized, AI-powered platform for local services.
- Enhanced trust and communication between users and providers.
- Improved visibility for service providers.
- Scalable, extensible architecture for future upgrades.

## Challenges

- Ensuring accurate AI recommendations.
- Integrating third-party services (geolocation, payments) while maintaining stability.
- Handling booking conflicts and real-time messaging edge cases.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/AI-Integrated-Local-Service-Provider-Platform.git
cd AI-Integrated-Local-Service-Provider-Platform
```

#### 2. Install dependencies

**For the backend:**
```bash
cd server
npm install
```

**For the frontend:**
```bash
cd ../client
npm install
```

#### 3. Environment Variables

- Copy `.env.example` to `.env` in both `server` and `client` folders.
- Fill in the required environment variables (MongoDB URI, JWT secret, SMTP credentials, etc.).

#### 4. Running the Application

**Start the backend:**
```bash
cd server
npm run dev
```

**Start the frontend:**
```bash
cd ../client
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
AI-Integrated-Local-Service-Provider-Platform/
│
├── client/      # Next.js frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/      # Node.js/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
│
└── README.md
```

## Contributors

- **Gour Gupal Talukder Shawon**  
  Registration No.: 2020831037

- **Amit Kumar Sharma**  
  Registration No.: 2020831009

## License

This project is for academic purposes. For other uses, please contact the authors.

---

*Course Title: Project Work - III (SWE 350)*
