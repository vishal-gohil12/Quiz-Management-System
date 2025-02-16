# Quizo: Quiz Management System

Quizo is a web-based quiz management platform that allows teachers to create, manage, and view quizzes. This repository includes a backend built with Express and Prisma, and a frontend built with React and ShadCN UI components.

## Table of Contents

- [Project Setup](#project-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Quiz Endpoints](#quiz-endpoints)
    - [Create Quiz](#create-quiz)
    - [Get Quizzes by Teacher](#get-quizzes-by-teacher)
    - [Get Quiz Details](#get-quiz-details)
    - [Update Quiz](#update-quiz)
    - [Delete Quiz](#delete-quiz)
- [Notes](#notes)

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (or another database if you update the Prisma datasource)
- [Prisma CLI](https://www.prisma.io/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/quizo.git
   cd quiz
   ```
2. **Install backend dependencies :**
   ```bash
    cd backend
    npm install
    ```
3. **Configure Environment Variables :**
    ```bash
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/quizo?schema=public"
    PORT=3000
    ```
4. **Run Prisma Migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```
5. **Install frontend dependencies:**
    **In another terminal, navigate to the frontend directory and install dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

## API Endpoints
**Authentication**
    POST /login
    Demo credentials: demoTeacher, password=demoTeacher
    Request:
    ```bash
    {
        "username": "admin",
        "password": "password"
    }
    ```
**Quiz Management**
Create Quiz
POST /quizzes

**Get Quizzes by Teacher**
GET /quizzes?teacherName=demoTeacher

**Get Quiz Details**
GET /quizzes/{id}

**Update Quiz**
PUT /quizzes/{id}

**Delete Quiz**
DELETE /quizzes/{id}

**Database Schema (Prisma)**
```bash
    model User {
    id       String @id @default(uuid())
    username String @unique
    password String
    quizzes  Quiz[]
    }

    model Quiz {
    id          String @id @default(uuid())
    title       String
    description String
    createdAt   DateTime @default(now())
    teacher     User @relation(fields: [teacherId], references: [id])
    teacherId   String
    questions   Question[]
    }

    model Question {
    id          String @id @default(uuid())
    questionText String
    quiz        Quiz @relation(fields: [quizId], references: [id])
    quizId      String
    options     Option[]
    }

    model Option {
    id          String @id @default(uuid())
    text        String
    isCorrect   Boolean @default(false)
    question    Question @relation(fields: [questionId], references: [id])
    questionId  String
    }
```

**License**

This version includes:
1. Explicit database setup instructions
2. Complete Prisma schema reference
3. Ready-to-use endpoint examples
4. Clear environment variable setup
5. Full workflow from installation to API usage