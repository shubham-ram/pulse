# Architecture Overview

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

## Project Structure

```
pulse/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Multer, Socket.io, env configuration
│   │   ├── controllers/     # Request handlers (auth, video, org, stream)
│   │   ├── middleware/       # Auth (JWT + RBAC), input validation
│   │   ├── models/          # Mongoose schemas (User, Organization, Video, Category)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Video processing pipeline (FFmpeg + sensitivity)
│   │   ├── utils/           # JWT helpers
│   │   ├── app.js           # Express app setup & middleware
│   │   └── server.js        # HTTP server + Socket.io init
│   └── uploads/
│       ├── originals/       # Raw uploaded video files
│       └── processed/       # FFmpeg-transcoded videos (H.264 mp4)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (shadcn/ui, layout, routing)
│   │   ├── contexts/        # React Context (AuthContext)
│   │   ├── pages/           # Page components (Login, Register, Dashboard, etc.)
│   │   ├── services/        # API client (Axios), Socket.io client
│   │   └── lib/             # Utility functions
│   └── vite.config.js       # Vite config with API proxy
│
├── docs/                    # Documentation
└── README.md
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                  │
│                                                                 │
│   Login/Register → Organization → Dashboard → Upload → Player  │
│        │                                        │         │     │
│        │              Socket.io Client          │         │     │
│        └──────────────────┬─────────────────────┘         │     │
└───────────────────────────┼───────────────────────────────┼─────┘
                            │ WebSocket                     │ HTTP
                            │ (progress updates)            │ (range requests)
┌───────────────────────────┼───────────────────────────────┼─────┐
│                        Backend (Node.js + Express)              │
│                                                                 │
│   ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│   │   Auth   │  │  Video CRUD  │  │   Streaming Service    │   │
│   │  (JWT)   │  │  (Multer)    │  │  (HTTP Range Requests) │   │
│   └──────────┘  └──────┬───────┘  └────────────────────────┘   │
│                         │                                       │
│              ┌──────────▼──────────┐                            │
│              │  Processing Pipeline │                           │
│              │  1. FFmpeg transcode  │                          │
│              │  2. Sensitivity scan  │                          │
│              │  3. Socket.io events  │                          │
│              └──────────┬───────────┘                           │
│                         │                                       │
│              ┌──────────▼──────────┐     ┌────────────────┐    │
│              │      MongoDB        │     │   File System   │    │
│              │ (Users, Orgs, Vids) │     │ (uploads/)      │    │
│              └─────────────────────┘     └────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow — Video Processing Pipeline

1. **Upload** — Client sends multipart form data with video file
2. **Storage** — Multer saves original file to `uploads/originals/` with a randomized filename
3. **Transcoding** — FFmpeg converts to H.264 `.mp4` with `faststart` flag for streaming
4. **Progress** — Real-time transcoding progress emitted via Socket.io
5. **Sensitivity Analysis** — Simulated analysis classifies video as `safe` or `flagged` (80/20 split)
6. **Ready** — Video marked as `ready`, `streamUrl` set, client notified via Socket.io
7. **Streaming** — Video served via HTTP range requests for seeking support

---

## Multi-Tenant Data Isolation

- Every video and category is scoped to an `organizationId`
- API queries always filter by the authenticated user's organization
- Users can only belong to one organization at a time
- RBAC middleware enforces role permissions on every protected route

---

## Database Schema

### User

| Field          | Type     | Required | Default | Details                                                  |
| -------------- | -------- | -------- | ------- | -------------------------------------------------------- |
| \_id           | ObjectId | auto     | auto    | Unique identifier                                        |
| name           | String   | yes      | -       | Trimmed                                                  |
| email          | String   | yes      | -       | Unique, lowercase, trimmed                               |
| password       | String   | yes      | -       | Min 6 chars, hashed with bcrypt, not returned in queries |
| organizationId | ObjectId | no       | null    | Ref: Organization — null until user joins/creates an org |
| role           | String   | no       | null    | Enum: `admin`, `editor`, `viewer` — null until in an org |
| status         | String   | no       | active  | Enum: `active`, `inactive` (soft delete)                 |
| createdAt      | Date     | auto     | auto    | Mongoose timestamp                                       |
| updatedAt      | Date     | auto     | auto    | Mongoose timestamp                                       |

### Organization

| Field       | Type       | Required | Default | Details                                               |
| ----------- | ---------- | -------- | ------- | ----------------------------------------------------- |
| \_id        | ObjectId   | auto     | auto    | Unique identifier                                     |
| name        | String     | yes      | -       | Unique, trimmed                                       |
| description | String     | no       | ""      | Trimmed                                               |
| inviteCode  | String     | no       | auto    | Unique, auto-generated 8-char hex (e.g., `A1B2C3D4`) |
| createdBy   | ObjectId   | yes      | -       | Ref: User — the admin who created it                  |
| memberIds   | [ObjectId] | no       | []      | Ref: User — array of user IDs in this org             |
| status      | String     | no       | active  | Enum: `active`, `inactive` (soft delete)              |
| createdAt   | Date       | auto     | auto    | Mongoose timestamp                                    |
| updatedAt   | Date       | auto     | auto    | Mongoose timestamp                                    |

### Video

| Field             | Type       | Required | Default   | Details                                                        |
| ----------------- | ---------- | -------- | --------- | -------------------------------------------------------------- |
| \_id              | ObjectId   | auto     | auto      | Unique identifier                                              |
| title             | String     | yes      | -         | Trimmed                                                        |
| description       | String     | no       | ""        | Trimmed                                                        |
| originalFileName  | String     | yes      | -         | Original uploaded filename                                     |
| fileUrl           | String     | yes      | -         | Path to original uploaded file                                 |
| streamUrl         | String     | no       | null      | Path to FFmpeg processed file (null until processing complete) |
| fileSize          | Number     | yes      | -         | In bytes                                                       |
| duration          | Number     | no       | null      | In seconds, extracted via FFmpeg                               |
| mimeType          | String     | yes      | -         | e.g., `video/mp4`                                              |
| processingStatus  | String     | no       | uploading | Enum: `uploading`, `processing`, `analyzed`, `ready`, `failed` |
| sensitivityStatus | String     | no       | pending   | Enum: `pending`, `safe`, `flagged`                             |
| categoryIds       | [ObjectId] | no       | []        | Ref: Category — user-defined categories                        |
| uploadedBy        | ObjectId   | yes      | -         | Ref: User — who uploaded                                       |
| organizationId    | ObjectId   | yes      | -         | Ref: Organization — which org it belongs to                    |
| status            | String     | no       | active    | Enum: `active`, `inactive` (soft delete)                       |
| createdAt         | Date       | auto     | auto      | Mongoose timestamp                                             |
| updatedAt         | Date       | auto     | auto      | Mongoose timestamp                                             |

### Category

| Field          | Type     | Required | Default | Details                                  |
| -------------- | -------- | -------- | ------- | ---------------------------------------- |
| \_id           | ObjectId | auto     | auto    | Unique identifier                        |
| name           | String   | yes      | -       | Trimmed                                  |
| organizationId | ObjectId | yes      | -       | Ref: Organization — scoped to org        |
| createdBy      | ObjectId | yes      | -       | Ref: User — who created it               |
| status         | String   | no       | active  | Enum: `active`, `inactive` (soft delete) |
| createdAt      | Date     | auto     | auto    | Mongoose timestamp                       |
| updatedAt      | Date     | auto     | auto    | Mongoose timestamp                       |

### Relationships

```
User.organizationId        →  Organization._id     (many-to-one)
Organization.createdBy     →  User._id             (one-to-one)
Organization.memberIds     →  [User._id]           (one-to-many)
Video.uploadedBy           →  User._id             (many-to-one)
Video.organizationId       →  Organization._id     (many-to-one)
Video.categoryIds          →  [Category._id]       (many-to-many)
Category.organizationId    →  Organization._id     (many-to-one)
Category.createdBy         →  User._id             (many-to-one)
```

### Soft Delete Pattern

All schemas use `status: active/inactive` instead of hard deletes. When querying, always filter by `status: 'active'` to exclude soft-deleted records.
