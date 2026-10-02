# 🚀 WorkFlowPro – Project & Team Management System

WorkFlowPro is a **full-stack Project & Team Management System** developed to help teams organize projects, manage tasks, collaborate with team members, and track project progress from a centralized platform.

The application is built using **React.js, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, and MySQL**.

---

## 📌 Project Overview

WorkFlowPro provides a centralized platform for managing projects and team activities.

Users can:

- Register and log in securely
- Access the system based on their role
- Create and manage projects
- Create and manage tasks
- Assign tasks to team members
- Manage teams
- Track project and task progress
- Add task comments
- View notifications
- Track project activities

The project follows a **full-stack architecture** where the React frontend communicates with a Spring Boot REST API connected to a MySQL database.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Recharts

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven

## Database

- MySQL

## Tools

- Visual Studio Code
- IntelliJ IDEA
- MySQL Workbench
- Postman
- Git
- GitHub

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ React + Vite        │
                    │ Tailwind CSS        │
                    │ Axios               │
                    │ React Router        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Repositories        │
                    │ Spring Security     │
                    │ JWT                 │
                    └──────────┬──────────┘
                               │
                               │ JPA / Hibernate
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │                     │
                    │ Users               │
                    │ Projects            │
                    │ Tasks               │
                    │ Teams               │
                    │ Comments            │
                    │ Notifications       │
                    │ Activities          │
                    └─────────────────────┘
```

---

# ✨ Features

## 🔐 Authentication & Authorization

WorkFlowPro uses **JWT-based authentication** with Spring Security.

Features include:

- User registration
- User login
- JWT token generation
- JWT token validation
- Secure API access
- Logout
- Role-based authorization
- Protected routes

Authentication flow:

```text
User
 ↓
Login
 ↓
React Frontend
 ↓
Spring Boot API
 ↓
Validate Credentials
 ↓
Generate JWT
 ↓
Frontend Stores Token
 ↓
Protected API Requests
```

---

# 👥 Role-Based Access Control

WorkFlowPro supports multiple user roles:

```text
USER
TEAM_LEAD
MANAGER
ADMIN
```

Roles are used to control access to different features of the application.

---

# 📊 Dashboard

The dashboard provides a centralized overview of the user's workspace.

Dashboard includes:

- Total Projects
- Total Tasks
- Completed Tasks
- Team Members
- Project navigation
- Quick actions
- Project overview

---

# 📁 Project Management

Users can manage projects through the Projects module.

Features include:

- Create projects
- View projects
- Update projects
- Delete projects
- Track project status
- Set project dates
- Add project descriptions
- Manage project members

Project statuses include:

```text
PLANNED
IN_PROGRESS
COMPLETED
```

---

# ✅ Task Management

Tasks can be created and managed under projects.

Features include:

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Assign tasks
- Track task status
- Set task priority
- Set due dates
- Add descriptions
- Add comments

Example task statuses:

```text
TODO
IN_PROGRESS
COMPLETED
```

---

# 👨‍👩‍👧‍👦 Team Management

The team module helps organize users into project teams.

Features include:

- Create teams
- View teams
- Add team members
- Remove team members
- View team members
- Associate members with projects

---

# 💬 Task Comments

Users can communicate through task comments.

Features include:

- Add comments
- View comments
- Associate comments with tasks
- Track task discussions

---

# 🔔 Notifications

The notification system provides information about important events.

Examples:

```text
Task Assigned
Task Updated
Project Updated
Team Member Added
Task Completed
```

---

# 📝 Activity Tracking

The application can track important project activities.

Examples:

```text
Project Created
Project Updated
Task Created
Task Assigned
Task Completed
Team Member Added
```

---

# 🗄️ Database

WorkFlowPro uses **MySQL** as the relational database.

The backend uses:

```text
Spring Data JPA
       +
Hibernate
       +
MySQL
```

Main entities include:

```text
User
Project
Task
Team
TeamMember
TaskComment
Notification
Activity
```

---

# 🔗 Backend Architecture

The Spring Boot backend follows a layered architecture:

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

### Controller

Handles HTTP requests and responses.

### Service

Contains application business logic.

### Repository

Communicates with the database using Spring Data JPA.

### Entity

Represents database tables and relationships.

---

# 📂 Project Structure

```text
WorkFlowPro/
│
├── workflowpro-ui/
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── workflowpro-backend/
    │
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── workflowpro/
    │       │           └── backend/
    │       │               ├── user/
    │       │               ├── project/
    │       │               ├── task/
    │       │               ├── team/
    │       │               ├── notification/
    │       │               ├── activity/
    │       │               ├── security/
    │       │               └── config/
    │       │
    │       └── resources/
    │           └── application.properties
    │
    └── pom.xml
```

---

# 🌐 REST API

The backend exposes REST APIs consumed by the React frontend.

Main API areas:

```text
/auth
/users
/projects
/tasks
/teams
/notifications
/activities
```

Authentication endpoints:

```http
POST /auth/register
POST /auth/login
```

Example project endpoints:

```http
GET    /projects
GET    /projects/{id}
POST   /projects
PUT    /projects/{id}
DELETE /projects/{id}
```

Example task endpoints:

```http
GET    /tasks
GET    /tasks/{id}
POST   /tasks
PUT    /tasks/{id}
DELETE /tasks/{id}
```

---

# 🔒 JWT Security

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

Security flow:

```text
React
 ↓
Axios
 ↓
JWT Token
 ↓
Spring Security
 ↓
JWT Validation
 ↓
Authorization
 ↓
Controller
```

---

# 🧪 API Testing

APIs can be tested using **Postman**.

Typical workflow:

```text
1. Register User
       ↓
2. Login
       ↓
3. Receive JWT
       ↓
4. Add JWT to Authorization Header
       ↓
5. Test Protected APIs
```

---

# ⚙️ Local Setup

## Prerequisites

Install:

- Java JDK
- Maven
- Node.js
- MySQL
- IntelliJ IDEA
- Visual Studio Code
- Postman

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd WorkFlowPro
```

---

## 2. Create MySQL Database

```sql
CREATE DATABASE workflowpro_db;
```

---

## 3. Configure Backend

Update:

```text
workflowpro-backend/src/main/resources/application.properties
```

Example:

```properties
spring.application.name=workflowpro-backend

spring.datasource.url=jdbc:mysql://localhost:3306/workflowpro_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=YOUR_SECRET_KEY
jwt.expiration-ms=86400000
```

Do not commit real passwords or JWT secrets to GitHub.

---

## 4. Run Backend

```bash
cd workflowpro-backend
mvn clean install
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## 5. Run Frontend

Open another terminal:

```bash
cd workflowpro-ui
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌐 Live Demo

Frontend:

https://workflowpro-ui.vercel.app/

---

# 🚧 Future Enhancements

Planned improvements include:

- WebSocket real-time communication
- Real-time notifications
- Email notifications
- Advanced project reports
- Project analytics
- File attachments
- Docker deployment
- CI/CD pipeline
- Cloud deployment
- Swagger/OpenAPI documentation
- Advanced task filtering

---

# 🎯 Skills Demonstrated

This project demonstrates practical experience with:

- Java
- Spring Boot
- Spring MVC
- Spring Security
- JWT
- REST API
- Spring Data JPA
- Hibernate
- MySQL
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Role-Based Access Control
- Entity Relationships
- Full-Stack Development
- API Testing
- Git & GitHub

---

# 📌 Project Type

**Full-Stack Web Application**

### Frontend

```text
React.js
Vite
Tailwind CSS
Axios
React Router
```

### Backend

```text
Java
Spring Boot
Spring Security
JWT
Spring Data JPA
Hibernate
Maven
```

### Database

```text
MySQL
```

---

# 👨‍💻 Author

**Gowsik B. S.**

B.E. Computer Science and Engineering

Full Stack Java + MERN Stack Developer

LinkedIn:

https://www.linkedin.com/in/gowsik-balamurugan

---

⭐ **WorkFlowPro** is a full-stack project demonstrating the integration of a modern React frontend with a secure Spring Boot REST API and MySQL database.
