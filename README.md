# University Management System - App (Frontend)

A modern, responsive university management platform that simplifies academic and administrative operations through role-based dashboards and an intuitive web interface.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Backend Integration](#backend-integration)
- [Contributions](#contributions)
- [How to Contribute](#how-to-contribute)
- [License](#license)
- [Contact](#contact)

---

## About the Project

**University Management System (UMS)** is a complete web application designed to simplify university academic and administrative workflows through a centralized digital platform.

The frontend provides an intuitive interface for students, instructors and administrators allowing each role to access relevant features through dedicated dashboards.

I built this application using Next.js, TypeScript and modern frontend technologies to create a responsive, maintainable and user-friendly experience.

The application communicates with a dedicated REST API backend to manage academic information, authentication, course registration, attendance, examination results, student fees and other university operations.

---

## Project Overview

The primary objective of this project is to bring essential university operations into one centralized platform, reducing manual administrative work and improving communication between students, instructors and administrators.

### Application Architecture

The frontend communicates with the backend through RESTful APIs.

```text
             University Management System
                         |
                 Next.js Frontend
                         |
                 REST API Integration
                         |
                Express.js Backend
                         |
                  Prisma ORM
                         |
                  PostgreSQL
```

### User Roles

| Role | Responsibilities |
|---|---|
| ADMIN | Manage university operations, academic structures, users, courses, payments and administrative records. |
| INSTRUCTOR | Access instructor dashboard, manage assigned courses, attendance, assessments and academic activities. |
| STUDENT | Manage profile, explore courses, register for courses, view attendance, results, fees and payment information. |

### Project Objectives

- Create a centralized university management platform.
- Provide role-specific dashboards and functionality.
- Simplify academic and administrative workflows.
- Improve the student course registration experience.
- Organize student academic records and financial information.
- Deliver a responsive and accessible user interface.
- Integrate frontend functionality with a scalable REST API.

---

## Key Features

### Authentication & User Management

- Secure user authentication.
- Role-based access for ADMIN, INSTRUCTOR and STUDENT.
- Role-specific dashboard navigation.
- Protected application routes.
- User profile management.

### Admin Dashboard

- Manage departments and academic programs.
- Manage courses, semesters and course prerequisites.
- Manage students and instructors.
- Review instructor applications.
- Manage course sections and registrations.
- Monitor student attendance and examination results.
- Manage student fees and payment records.
- Access administrative records and audit logs.

### Instructor Dashboard

- Access instructor-specific information.
- View assigned courses and sections.
- Manage student attendance.
- Work with academic results and grading activities.
- Access relevant course and student information.

### Student Dashboard

- View student profile information.
- Update personal profile details and profile photo.
- Explore available academic programs and courses.
- Register for available courses.
- View registered courses and academic information.
- Track attendance and examination results.
- Review student fees and payment information.

### Payment Management

- Student fee management.
- Payment status tracking.
- Integration with the bKash payment system through the backend.
- Access to relevant payment information.

### User Experience

- Responsive design for desktop, tablet and mobile.
- Dark and light theme support.
- Reusable UI components.
- Form validation and user-friendly feedback.
- API integration using TanStack Query.
- Toast notifications and loading states.
- Smooth navigation and organized dashboard layouts.

---

## Tech Stack

### Frontend

- **Next.js** - React framework with App Router.
- **TypeScript** - Type-safe application development.
- **Tailwind CSS** - Utility-first styling.
- **shadcn/ui** - Reusable interface components.
- **Lucide React** - Icon library.

### State Management & API Integration

- **TanStack React Query** - Server state management and API caching.
- **React Hook Form** - Form management.
- **Zod** - Data validation.
- **ofetch** - HTTP requests.

### Additional Libraries

- next-themes
- Sonner
- Base UI
- Class Variance Authority

### Development Tools

- Biome
- Git
- GitHub
- Visual Studio Code

---

## Dependencies

The following are the main dependencies used in the project.

### Production Dependencies

```json
{
  "@base-ui/react": "^1.8.0",
  "@hookform/resolvers": "^5.9.1",
  "@tanstack/react-form": "^1.33.5",
  "@tanstack/react-query": "^5.104.0",
  "class-variance-authority": "^0.7.1",
  "cn": "^0.4.0",
  "lucide-react": "^1.48.0",
  "next": "16.3.6",
  "next-themes": "^0.4.6",
  "ofetch": "^1.5.1",
  "react": "19.2.8",
  "react-dom": "19.2.8",
  "react-hook-form": "^7.89.0",
  "shadcn": "^4.21.0",
  "sonner": "^2.0.8",
  "tw-animate-css": "^1.4.0"
}
```

### Development Dependencies

```json
{
  "@biomejs/biome": "2.4.2",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "babel-plugin-react-compiler": "1.0.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js 24 or a compatible version.
- npm.
- Git.
- A running instance of the backend API.

### 1. Clone the Repository

```bash
git clone https://github.com/AsifHossain22/University-Management-System-App.git
```

### 2. Navigate to the Project Directory

```bash
cd University-Management-System-App
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_BASE_URL=YOUR_PUBLIC_API_BASE_URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Replace the placeholder values with your actual backend API URL and Google OAuth client ID.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Open the Application

Visit:

```text
http://localhost:3000
```

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### Code Quality

Run Biome checks:

```bash
npm run lint
```

Format the code:

```bash
npm run format
```

---

## Environment Variables

| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_BASE_URL | Base URL of the backend REST API. |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google OAuth client ID. |

**Important:** Never expose private API credentials or backend secrets through frontend environment variables. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Folder Structure

The project follows a structured Next.js application architecture.

```text
University-Management-System-App/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── features/
│   │   ├── programs/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   └── ...
│   │
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   ├── types/
│   └── ...
│
├── .env.example
├── .gitignore
├── biome.json
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

*This is a simplified architectural overview; consult the repository for the complete directory tree.*

### Directory Overview

- **`public/`** - Static assets and public resources.
- **`src/app/`** - Next.js App Router pages, layouts and route groups.
- **`src/components/`** - Reusable application and UI components.
- **`src/hooks/`** - Custom React hooks.
- **`src/lib/`** - Shared utilities and application configuration.
- **`src/providers/`** - Context providers and application-level providers.
- **`src/services/`** - API integration and service functions.
- **`src/types/`** - TypeScript interfaces and type definitions.

---

## Backend Integration

This frontend application works with a separate Express.js backend.

**Backend Repository:** [University Management System Server](https://github.com/AsifHossain22/University-Management-System-Server)

The backend provides REST APIs for authentication, academic management, student operations, instructor activities, fees, payments and other university workflows.

---

## Contributions

| Contributor | Role | Contribution |
|---|---|---|
| Asif Hossain | Full Stack Developer | Frontend architecture, UI development, API integration, authentication, dashboards and application functionality. |

---

## How to Contribute

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes.

```bash
git commit -m "Add AmazingFeature"
```

4. Push your branch.

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request.

---

## License

This project is currently distributed under the terms specified by the repository owner. Please check the repository for licensing information before redistributing or modifying the source code.

---

## Contact

**Developer:** Asif Hossain

- **Live Demo:** [University Management System](https://university-management-system-app.vercel.app/)
- **Frontend Repository:** [University-Management-System-App](https://github.com/AsifHossain22/University-Management-System-App)
- **Backend Repository:** [University-Management-System-Server](https://github.com/AsifHossain22/University-Management-System-Server)
- **Portfolio:** [web-developer-asif.netlify.app](https://web-developer-asif.netlify.app/)
- **GitHub:** [AsifHossain22](https://github.com/AsifHossain22/)
- **LinkedIn:** [Asif Hossain](https://www.linkedin.com/in/asifhossain22/)
- **Email:** [hiasifhossain22@gmail.com](mailto:hiasifhossain22@gmail.com)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Designed and developed by Asif Hossain.**
