# WorkFlowPro – Project & Team Management System

WorkFlowPro is a full-stack **Project and Team Management System** designed to help organizations manage projects, tasks, teams, users, and day-to-day project activities from a centralized platform.

The application is built using **React.js, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, and MySQL**.

---

## 🚀 Project Overview

WorkFlowPro provides a centralized workspace where users can:

- Create and manage projects
- Create and assign tasks
- Manage project teams
- Track task and project progress
- Manage users based on roles
- Add comments to tasks
- Receive notifications
- Track project activities
- Authenticate securely using JWT
- Access features based on role permissions

The project follows a modern **Frontend + REST API + Database** architecture.

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Recharts

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL

### Development Tools

- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  React + Vite + Tailwind    │
│  React Router + Axios       │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│                             │
│  Controllers                │
│  Services                   │
│  Repositories               │
│  Spring Security            │
│  JWT Authentication         │
└──────────────┬──────────────┘
               │
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│          MySQL              │
│                             │
│  Users                      │
│  Projects                   │
│  Tasks                      │
│  Teams                      │
│  Notifications              │
│  Activities                 │
│  Comments                   │
└─────────────────────────────┘
```

---

# ✨ Features

## 🔐 Authentication

WorkFlowPro uses JWT-based authentication for secure user access.

Features include:

- User registration
- User login
- JWT token generation
- JWT token validation
- Secure API access
- Logout
- Password-based authentication
- Role-based authorization

---

## 👥 Role-Based Access Control

The application supports multiple user roles:

```text
USER
TEAM_LEAD
MANAGER
ADMIN
```

Each role can have different permissions within the application.

### USER

Regular users can work with assigned projects and tasks.

### TEAM_LEAD

Team leads can manage team activities and assigned project tasks.

### MANAGER

Managers can manage projects, teams, and project-level activities.

### ADMIN

Administrators have higher-level access for managing users and system-related operations.

---

# 📊 Dashboard

The dashboard provides a centralized overview of the application.

Dashboard information includes:

- Total Projects
- Total Tasks
- Completed Tasks
- Team Members
- Project activity
- Quick navigation
- Project management shortcuts

The dashboard is designed to provide users with a quick understanding of their current work.

---

# 📁 Project Management

The Projects module allows users to manage projects.

Project functionality includes:

- View projects
- Create projects
- Update projects
- Delete projects
- Project status tracking
- Project dates
- Project descriptions
- Project members

Project statuses can include:

```text
PLANNED
IN_PROGRESS
COMPLETED
```

---

# ✅ Task Management

Tasks can be created and managed under projects.

Task functionality includes:

- Create tasks
- Update tasks
- Delete tasks
- Assign tasks
- Track task status
- Set task priority
- Set due dates
- Add task descriptions
- Add comments
- Track task activity

Example task statuses:

```text
TODO
IN_PROGRESS
COMPLETED
```

---

# 👨‍👩‍👧‍👦 Team Management

The team module provides functionality for organizing users into project teams.

Features include:

- Create teams
- Add members
- Remove members
- View team members
- Assign team members to projects
- Manage team activities

---

# 💬 Task Comments

Users can communicate about tasks using comments.

Comment functionality allows users to:

- Add comments
- View comments
- Associate comments with tasks
- Track discussions related to tasks

---

# 🔔 Notifications

WorkFlowPro includes a notification system for communicating important project and task events.

Notifications can be generated for activities such as:

- Task assignments
- Project updates
- Task updates
- Team-related activities
- Other important system events

---

# 📝 Activity Tracking

The application maintains activity information for important actions.

Examples include:

```text
Project Created
Project Updated
Task Created
Task Assigned
Task Completed
Team Member Added
```

This provides better visibility into project activities.

---

# 🗄️ Database Design

The application uses MySQL as the relational database.

Main database entities include:

```text
users
projects
tasks
teams
team_members
task_comments
notifications
activities
```

Relationships between entities are managed using:

- JPA
- Hibernate
- Entity relationships
- Foreign keys
- Repository interfaces

---

# 🔑 JWT Authentication Flow

The authentication process works approximately as follows:

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /auth/login
 ▼
Spring Boot Backend
 │
 │ Validate Credentials
 ▼
UserRepository
 │
 │ User Found
 ▼
Spring Security
 │
 │ Generate JWT
 ▼
JWT Token
 │
 ▼
React Frontend
 │
 │ Store Token
 ▼
Protected API Requests
 │
 │ Authorization: Bearer <token>
 ▼
Spring Security JWT Filter
 │
 ▼
Protected Controller
```

The JWT contains authentication information such as the user's identity and role.

---

# 📂 Frontend Structure

A simplified frontend structure:

```text
workflowpro-ui/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── Tasks.jsx
│   │   ├── Teams.jsx
│   │   └── ...
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# 📂 Backend Structure

A simplified backend structure:

```text
workflowpro-backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── workflowpro/
│       │           └── backend/
│       │
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
├── pom.xml
└── README.md
```

The backend follows a layered architecture:

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
```

---

# 🔌 REST API

The backend exposes REST APIs that are consumed by the React frontend.

Example API areas:

```text
/auth
/users
/projects
/tasks
/teams
/notifications
/activities
```

Example authentication endpoints:

```text
POST /auth/register
POST /auth/login
```

The frontend communicates with these APIs using Axios.

---

# 🧪 API Testing

Postman can be used to test the backend APIs.

Example:

```text
POST /auth/register
POST /auth/login
GET  /projects
POST /projects
GET  /tasks
POST /tasks
```

Protected APIs require the JWT token:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# ⚙️ Backend Setup

## 1. Clone the Repository

```bash
git clone <backend-repository-url>
cd workflowpro-backend
```

---

## 2. Create MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE workflowpro_db;
```

---

## 3. Configure Database

Update the backend `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workflowpro_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 4. Configure JWT

Configure the JWT secret and expiration:

```properties
jwt.secret=YOUR_SECRET_KEY
jwt.expiration-ms=86400000
```

Use a strong secret in a real deployment.

---

## 5. Run Backend

Using Maven:

```bash
mvn spring-boot:run
```

The backend will normally run at:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

## 1. Clone the Repository

```bash
git clone <frontend-repository-url>
cd workflowpro-ui
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Development Server

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔗 Frontend and Backend Connection

The React frontend communicates with the Spring Boot backend through REST APIs.

Example Axios configuration:

```javascript
const API_BASE_URL = "http://localhost:8080";
```

The frontend sends authenticated requests using the JWT token.

Example:

```text
React
  ↓
Axios
  ↓
Spring Boot REST API
  ↓
Spring Security
  ↓
JWT Validation
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL
```

---

# 🌐 Deployment

The frontend can be deployed using platforms such as Vercel.

The WorkFlowPro frontend deployment:

```text
https://workflowpro-ui.vercel.app/
```

For production deployment, the frontend API URL should point to the deployed Spring Boot backend instead of the local:

```text
http://localhost:8080
```

---

# 🔒 Security

Security features implemented in WorkFlowPro include:

- JWT authentication
- Spring Security
- Password authentication
- Role-based authorization
- Protected API endpoints
- Token-based API requests
- Unique user email validation

Sensitive configuration values should not be committed directly to GitHub.

---

# 📈 Future Enhancements

Possible future improvements include:

- WebSocket real-time notifications
- Email notifications
- Advanced project reports
- Advanced analytics
- Cloud deployment
- Docker containerization
- CI/CD pipeline
- File attachments
- Advanced task filtering
- Improved reporting dashboards

---

# 🎯 Learning Objectives

This project demonstrates practical experience with:

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST API development
- Spring Data JPA
- Hibernate
- MySQL
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Role-Based Access Control
- Full-stack application development
- Git and GitHub
- API testing using Postman

---

# 👨‍💻 Project Type

**Full Stack Web Application**

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

# 📌 Project Status

WorkFlowPro is an actively developed full-stack project with authentication, role-based access, dashboard functionality, and project-management functionality implemented.

The project is designed as an intermediate-level application demonstrating how a modern React frontend communicates with a Spring Boot REST API and MySQL database.

---

## 👨‍💻 Author

**Gowsik B. S.**

B.E. Computer Science and Engineering

Full Stack Java + MERN Stack Developer

LinkedIn:  
https://www.linkedin.com/in/gowsik-balamurugan

---

## ⭐ If you find this project useful

Feel free to explore the project, review the source code, and use the architecture as a reference for learning full-stack application development.
