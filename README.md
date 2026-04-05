# Pulse — Video Upload, Sensitivity Processing & Streaming Platform

A full-stack application that enables organizations to upload videos, process them through a simulated content sensitivity analysis pipeline, and stream them with real-time progress tracking. Built with a multi-tenant architecture and role-based access control.

---

## Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| **Backend**    | Node.js, Express 5, MongoDB (Mongoose ODM)       |
| **Frontend**   | React 19, Vite, Tailwind CSS, shadcn/ui          |
| **Real-Time**  | Socket.io (server + client)                      |
| **Auth**       | JWT (JSON Web Tokens), bcrypt password hashing   |
| **Processing** | FFmpeg (via fluent-ffmpeg) for video transcoding |
| **Uploads**    | Multer with disk storage                         |

---

## Documentation

| Document                                      | Description                                       |
| --------------------------------------------- | ------------------------------------------------- |
| [Architecture Overview](docs/ARCHITECTURE.md) | System design, project structure, database schema |
| [API Documentation](docs/API.md)              | All endpoints with request/response examples      |
| [User Manual](docs/USER_MANUAL.md)            | Step-by-step guide for the complete user journey  |
| [Design Decisions](docs/DESIGN_DECISIONS.md)  | Assumptions and architectural decisions           |

---

## Quick Start

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **MongoDB** v6+ (local or MongoDB Atlas)
- **FFmpeg** installed and available on system PATH
- **pnpm** / **npm**

```bash
# Install FFmpeg (macOS)
brew install ffmpeg

# Install FFmpeg (Ubuntu/Debian)
sudo apt update && sudo apt install ffmpeg
```

### 1. Clone & Setup Backend

```bash
git clone <repository-url>
cd pulse/backend

npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulse
JWT_SECRET=your_secure_random_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd pulse/frontend

pnpm install
pnpm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server automatically proxies API and WebSocket requests to the backend.

---

## Key Features

- **Video Upload & Processing** — Upload videos (mp4, mkv, avi, webm, mov up to 50MB), auto-transcode to H.264 with FFmpeg
- **Real-Time Progress** — Live transcoding and analysis progress via Socket.io
- **Sensitivity Analysis** — Simulated content classification (safe/flagged) with progress tracking
- **Video Streaming** — HTTP range request support for seeking and efficient playback
- **Multi-Tenant Architecture** — Organization-based data isolation with invite codes
- **Role-Based Access Control** — Admin, Editor, and Viewer roles with granular permissions
- **Responsive UI** — Built with shadcn/ui and Tailwind CSS with dark mode support

---

## Project Structure

```
pulse/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Multer, Socket.io, env config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth (JWT + RBAC), validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Video processing pipeline
│   │   └── utils/           # JWT helpers
│   └── uploads/             # Video file storage
│
├── frontend/
│   └── src/
│       ├── components/      # UI components (shadcn/ui, layout)
│       ├── contexts/        # Auth state (React Context)
│       ├── pages/           # Page components
│       └── services/        # API client, Socket.io client
│
└── docs/                    # Documentation
```
