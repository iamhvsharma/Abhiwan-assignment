# Quillboard  - Live Collaborative Todo List

A real-time collaborative task management application that enables teams to work together seamlessly with live updates, role-based access control, and modern UI/UX.

## 🚀 Project Overview

Quillboard  is a full-stack web application that provides a collaborative workspace for teams to manage tasks in real-time. The application features a dual-role system where managers can create workspaces, assign tasks, and oversee team progress, while team members can update task statuses and add progress notes.

### ✨ Key Features

- **🔐 Role-Based Authentication**: Separate interfaces for Managers and Team members
- **🏢 Workspace Management**: Create and join workspaces with unique workspace numbers
- **📋 Task Management**: Create, assign, update, and delete tasks with real-time updates
- **🔄 Live Collaboration**: Real-time task updates using Socket.IO
- **📝 Progress Tracking**: Add notes and track task progress
- **👥 Team Management**: Invite members, manage workspace participants
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **🔒 Secure API**: JWT authentication with role-based middleware
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt for password hashing
- **Real-time**: Socket.IO for live updates
- **Validation**: Zod for request validation
- **Development**: Nodemon for hot reloading

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

### Database

- **Primary**: PostgreSQL
- **ORM**: Prisma Client
- **Migrations**: Prisma Migrate

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│   Socket.IO     │
                        │   (Real-time)   │
                        └─────────────────┘
```

### Project Structure

```
Quillboard /
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth & validation middleware
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utilities (JWT, Prisma, Socket)
│   │   ├── types/           # TypeScript type definitions
│   │   └── socket.ts        # Socket.IO server setup
│   ├── prisma/              # Database schema & migrations
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API utilities
│   │   └── App.tsx          # Main application component
│   └── package.json
└── README.md
```

## 🗄 Database Schema Design

### Entity Relationships

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        enum role
        datetime createdAt
    }

    Workspace {
        string id PK
        int workspaceNumber UK
        string name
        string createdBy FK
        datetime createdAt
    }

    Task {
        string id PK
        string title
        string description
        enum status
        string assignedToId FK
        string createdById FK
        string workspaceId FK
        datetime createdAt
    }

    ProgressNote {
        string id PK
        string note
        string userId FK
        string taskId FK
        datetime createdAt
    }

    User ||--o{ Task : "assignedTo"
    User ||--o{ Task : "createdBy"
    User ||--o{ ProgressNote : "writes"
    User ||--o{ Workspace : "manages"
    User }o--o{ Workspace : "memberOf"
    Workspace ||--o{ Task : "contains"
    Task ||--o{ ProgressNote : "has"
```

### Models & Relationships

#### User Model

- **Primary Key**: `id` (UUID)
- **Unique Fields**: `email`
- **Relationships**:
  - One-to-Many: `tasks` (assigned tasks)
  - One-to-Many: `Task` (created tasks)
  - One-to-Many: `ProgressNote` (notes written)
  - One-to-Many: `Workspace` (managed workspaces)
  - Many-to-Many: `Workspace` (member of workspaces)

#### Workspace Model

- **Primary Key**: `id` (UUID)
- **Unique Fields**: `workspaceNumber` (auto-incrementing)
- **Relationships**:
  - Many-to-One: `User` (manager)
  - One-to-Many: `Task` (tasks in workspace)
  - Many-to-Many: `User` (members)

#### Task Model

- **Primary Key**: `id` (UUID)
- **Relationships**:
  - Many-to-One: `User` (assigned to)
  - Many-to-One: `User` (created by)
  - Many-to-One: `Workspace` (belongs to)
  - One-to-Many: `ProgressNote` (notes)

#### ProgressNote Model

- **Primary Key**: `id` (UUID)
- **Relationships**:
  - Many-to-One: `User` (author)
  - Many-to-One: `Task` (belongs to)

## 🚀 Local Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (recommended) or npm

### Backend Setup

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/Quillboard _db"
   JWT_SECRET="your-super-secret-jwt-key"
   CORS_ORIGIN="http://localhost:8080"
   PORT=8000
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   pnpm prisma:generate

   # Run database migrations
   pnpm prisma:migrate
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Authentication Endpoints

#### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "MANAGER" | "TEAM"
}
```

**Response:**

```json
{
  "msg": "User registered",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MANAGER"
  },
  "token": "jwt-token"
}
```

#### Login User

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "msg": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MANAGER"
  },
  "token": "jwt-token"
}
```

#### Get User Profile

```http
GET /auth/profile
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MANAGER",
    "workspaces": [
      {
        "workspaceNumber": 1001,
        "name": "My Workspace"
      }
    ],
    "workspaceNumber": 1001
  }
}
```

---

### 🏢 Workspace Endpoints

#### Create Workspace (Manager Only)

```http
POST /workspace
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "My Workspace"
}
```

**Response:**

```json
{
  "msg": "Workspace created",
  "workspace": {
    "id": "uuid",
    "workspaceNumber": 1001,
    "name": "My Workspace",
    "createdBy": "manager-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Join Workspace (Team Only)

```http
POST /workspace/join
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "workspaceNumber": 1001
}
```

**Response:**

```json
{
  "msg": "Joined workspace",
  "workspaceNumber": 1001
}
```

#### Get Workspace Details

```http
GET /workspace/:workspaceNumber
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "workspace": {
    "id": "uuid",
    "workspaceNumber": 1001,
    "name": "My Workspace",
    "createdBy": "manager-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "manager": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "MANAGER"
      }
    ]
  }
}
```

#### Get Manager Workspaces

```http
GET /workspace/manager
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "workspaces": [
    {
      "id": "uuid",
      "workspaceNumber": 1001,
      "name": "My Workspace",
      "createdBy": "manager-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "manager": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ]
    }
  ]
}
```

#### Get User Workspace

```http
GET /workspace/user
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "workspace": {
    "id": "uuid",
    "workspaceNumber": 1001,
    "name": "My Workspace",
    "createdBy": "manager-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "manager": {
      "name": "John Doe"
    },
    "members": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "MANAGER"
      }
    ]
  }
}
```

#### Leave Workspace (Team Only)

```http
PATCH /workspace/leave
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "workspaceNumber": 1001
}
```

**Response:**

```json
{
  "msg": "You have left the workspace"
}
```

#### Remove User from Workspace (Manager Only)

```http
POST /workspace/remove-user
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "userId": "user-uuid",
  "workspaceId": "workspace-uuid"
}
```

**Response:**

```json
{
  "msg": "User removed from workspace"
}
```

#### Invite User to Workspace (Manager Only)

```http
POST /workspace/invite
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "email": "team@example.com"
}
```

**Response:**

```json
{
  "msg": "User John Doe added to workspace #1001"
}
```

---

### 📋 Task Endpoints

#### Create Task (Manager Only)

```http
POST /tasks
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "assignedToId": "user-uuid",
  "workspaceNumber": 1001
}
```

**Response:**

```json
{
  "msg": "Task created",
  "task": {
    "id": "uuid",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "status": "PENDING",
    "assignedToId": "user-uuid",
    "createdById": "manager-uuid",
    "workspaceId": "workspace-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "John Doe"
    },
    "notes": []
  }
}
```

#### Get Tasks by Workspace

```http
GET /tasks/:workspaceNumber
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the project",
      "status": "PENDING",
      "assignedToId": "user-uuid",
      "createdById": "manager-uuid",
      "workspaceId": "workspace-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "assignedTo": {
        "id": "user-uuid",
        "name": "John Doe"
      },
      "notes": []
    }
  ]
}
```

#### Update Task (Manager Only)

```http
PUT /tasks/:taskId
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

**Response:**

```json
{
  "msg": "Task updated",
  "task": {
    "id": "uuid",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "assignedToId": "user-uuid",
    "createdById": "manager-uuid",
    "workspaceId": "workspace-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "John Doe"
    },
    "notes": []
  }
}
```

#### Delete Task (Manager Only)

```http
DELETE /tasks/:taskId
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "msg": "Task deleted"
}
```

#### Update Task Status (Team Only)

```http
PATCH /tasks/status
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "taskId": "task-uuid",
  "status": "COMPLETED"
}
```

**Response:**

```json
{
  "msg": "Status updated",
  "task": {
    "id": "uuid",
    "title": "Task title",
    "description": "Task description",
    "status": "COMPLETED",
    "assignedToId": "user-uuid",
    "createdById": "manager-uuid",
    "workspaceId": "workspace-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Add Note to Task (Team Only)

```http
POST /tasks/note
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "taskId": "task-uuid",
  "note": "Made significant progress on the documentation"
}
```

**Response:**

```json
{
  "msg": "Note added",
  "note": {
    "id": "uuid",
    "note": "Made significant progress on the documentation",
    "userId": "user-uuid",
    "taskId": "task-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe"
    }
  }
}
```

#### Get Task Notes

```http
GET /tasks/notes/:taskId
```

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "notes": [
    {
      "id": "uuid",
      "note": "Made significant progress on the documentation",
      "userId": "user-uuid",
      "taskId": "task-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

---

## 🔄 Real-time Events

The application uses Socket.IO for real-time updates. Clients should connect to the socket server and join workspace rooms to receive live updates.

### Socket Events

#### Client to Server

- `joinWorkspace(workspaceId)` - Join a workspace room for real-time updates

#### Server to Client

- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `task:status` - Task status changed
- `task:note` - New note added to task
- `workspace:memberJoined` - New member joined workspace
- `workspace:memberRemoved` - Member left/removed from workspace

### Socket Connection Example

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:8000");

// Join workspace room
socket.emit("joinWorkspace", "1001");

// Listen for task updates
socket.on("task:created", (task) => {
  console.log("New task created:", task);
});

socket.on("task:updated", (task) => {
  console.log("Task updated:", task);
});
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-Based Access Control**: Different permissions for managers and team members
- **Input Validation**: Zod schemas for request validation
- **CORS Protection**: Configured CORS for frontend-backend communication
- **SQL Injection Protection**: Prisma ORM with parameterized queries

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and loading indicators
- **Form Validation**: Client-side validation with error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern Components**: Built with Radix UI primitives

---

## 🚀 Deployment

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGIN="https://your-frontend-domain.com"
PORT=8000
NODE_ENV="production"
```

#### Frontend (.env)

```env
VITE_API_BASE_URL="https://your-backend-domain.com/api/v1"
VITE_SOCKET_URL="https://your-backend-domain.com"
```

### Production Build

#### Backend

```bash
cd backend
pnpm build
pnpm start
```

#### Frontend

```bash
cd frontend
pnpm build
# Serve the dist folder with your preferred web server
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation above
- Review the setup instructions

---

_Built with ❤️ by Harshvardhan_
