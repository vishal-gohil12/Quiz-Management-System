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

    Response:
    ```
    res.status(200).json({
            status: true,
            message: "login"
        });
    ```
**Quiz Management**
Create Quiz
POST /quizzes
    ```bash{
        "title": "Science Quiz",
        "description": "Test your science knowledge",
        "username": "demoTeacher",
        "questions": [
            {
            "questionText": "What is H2O?",
            "options": [
                { "text": "Water", "isCorrect": true },
                { "text": "Oxygen", "isCorrect": false },
                { "text": "Carbon Dioxide", "isCorrect": false }
            ]
            }
        ]
        }```
    
    Response:
        ``` bsh{
    "quiz": {
        "id": "quiz_456",
        "title": "Science Quiz",
        "description": "Test your science knowledge",
        "createdAt": "2024-02-20T10:00:00.000Z",
        "teacherId": "teacher_789",
        "questions": [/* Full question details */]
    }
}```

**Get Quizzes by Teacher**
1. GET /quizzes?teacherName=demoTeacher
```bash{
  "quizzes": [
    {
      "id": "quiz_456",
      "title": "Science Quiz",
      "description": "Test your science knowledge",
      "createdAt": "2024-02-20T10:00:00.000Z",
      "teacherId": "teacher_789"
    }
  ]
}
```


**Get Quiz Details**
1. GET /quizzes/{id}
```bash{
  "quiz": {
    "title": "Science Quiz",
    "description": "Test your science knowledge"
  }
}```

**Update Quiz**
1. PUT /quizzes/{id}
```bash{
  "title": "Advanced Science Quiz",
  "description": "Updated description"
}

{
  "quiz": {
    "title": "Advanced Science Quiz",
    "description": "Updated description"
  }
}
```
**Delete Quiz**
1. DELETE /quizzes/{id}
```bash {
  "message": "Quiz deleted successfully."
}
```

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