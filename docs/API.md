# API Documentation

**Base URL:** `http://localhost:5000/api`

All protected endpoints require the `Authorization: Bearer <token>` header.

All responses follow a consistent format:

```json
{
  "success": true | false,
  "message": "...",
  "data": { ... }
}
```

---

## Table of Contents

- [Health Check](#health-check)
- [Authentication](#authentication)
- [Organization](#organization)
- [Videos](#videos)
- [Socket.io Events](#socketio-events)

---

## Health Check

| Method | Endpoint      | Auth | Description      |
| ------ | ------------- | ---- | ---------------- |
| GET    | `/api/health` | No   | API health check |

**Response:**

```json
{ "status": "ok", "message": "Pulse API is running" }
```

---

## Authentication

### POST `/api/auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation Rules:**

- `name` — required, trimmed
- `email` — required, valid email format, normalized
- `password` — required, minimum 6 characters

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "664f1a2b3c...",
      "name": "John Doe",
      "email": "john@example.com",
      "organizationId": null,
      "role": null,
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

- `400` — Validation error (missing/invalid fields)
- `409` — Email already exists

---

### POST `/api/auth/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "organizationId": "...",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

- `400` — Validation error
- `401` — Invalid credentials

---

### GET `/api/auth/me`

Get the current authenticated user's profile. **Requires auth.**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "organizationId": {
        "_id": "...",
        "name": "Acme Corp",
        "inviteCode": "A1B2C3D4"
      },
      "role": "admin",
      "status": "active"
    }
  }
}
```

---

## Organization

### POST `/api/organizations/create`

Create a new organization. The creator becomes admin. **Requires auth.**

**Request Body:**

```json
{
  "name": "Acme Corp",
  "description": "Video production team"
}
```

**Validation Rules:**

- `name` — required, trimmed

**Response (201):**

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization": {
      "_id": "...",
      "name": "Acme Corp",
      "description": "Video production team",
      "inviteCode": "A1B2C3D4",
      "createdBy": "...",
      "memberIds": ["..."]
    }
  }
}
```

**Errors:**

- `400` — Already in an organization, or validation error
- `409` — Organization name already exists

---

### POST `/api/organizations/join`

Join an existing organization via invite code. User becomes viewer. **Requires auth.**

**Request Body:**

```json
{
  "inviteCode": "A1B2C3D4"
}
```

**Validation Rules:**

- `inviteCode` — required, trimmed

**Response (200):**

```json
{
  "success": true,
  "message": "Joined organization successfully",
  "data": { "organization": { "..." } }
}
```

**Errors:**

- `400` — Already in an organization
- `404` — Invalid invite code

---

### GET `/api/organizations/me`

Get the current user's organization details. **Requires auth.**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "organization": {
      "_id": "...",
      "name": "Acme Corp",
      "inviteCode": "A1B2C3D4",
      "description": "...",
      "memberIds": ["..."]
    }
  }
}
```

---

### GET `/api/organizations/members`

List all members in the organization. **Requires auth + admin role.**

**Response (200):**

```json
{
  "success": true,
  "data": {
    "members": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "createdAt": "..."
      },
      {
        "_id": "...",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "editor",
        "createdAt": "..."
      }
    ]
  }
}
```

---

### PUT `/api/organizations/members/:id/role`

Change a member's role. Cannot change your own role. **Requires auth + admin role.**

**Request Body:**

```json
{
  "role": "editor"
}
```

**Validation Rules:**

- `:id` — valid MongoDB ObjectId
- `role` — must be one of `admin`, `editor`, `viewer`

**Response (200):**

```json
{
  "success": true,
  "message": "Member role updated to 'editor'",
  "data": {
    "member": {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "editor"
    }
  }
}
```

**Errors:**

- `400` — Invalid role, invalid member ID, or attempting to change own role
- `404` — Member not found

---

### DELETE `/api/organizations/members/:id`

Remove a member from the organization. Cannot remove yourself. **Requires auth + admin role.**

**Validation Rules:**

- `:id` — valid MongoDB ObjectId

**Response (200):**

```json
{ "success": true, "message": "Member removed from organization" }
```

**Errors:**

- `400` — Invalid member ID, or attempting to remove yourself
- `404` — Member not found

---

## Videos

### POST `/api/videos/upload`

Upload a video file. Triggers the processing pipeline in the background. **Requires auth + editor/admin role.**

**Request:** `multipart/form-data`

| Field         | Type   | Required | Description                                      |
| ------------- | ------ | -------- | ------------------------------------------------ |
| `video`       | File   | Yes      | Video file (mp4, mkv, avi, webm, mov). Max 50MB |
| `title`       | String | Yes      | Video title                                      |
| `description` | String | No       | Video description                                |
| `categoryIds` | String | No       | JSON array of category IDs                       |

**Response (201):**

```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "_id": "...",
      "title": "Product Demo",
      "processingStatus": "uploading",
      "sensitivityStatus": "pending",
      "fileSize": 15728640,
      "mimeType": "video/mp4"
    }
  }
}
```

**Errors:**

- `400` — No file uploaded, invalid file type, file too large, or missing title

---

### GET `/api/videos`

List all videos in the user's organization. **Requires auth + org membership.**

**Query Parameters (all optional):**

| Param               | Values                                                   |
| ------------------- | -------------------------------------------------------- |
| `processingStatus`  | `uploading`, `processing`, `analyzed`, `ready`, `failed` |
| `sensitivityStatus` | `pending`, `safe`, `flagged`                             |
| `categoryId`        | A valid category ObjectId                                |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "...",
        "title": "Product Demo",
        "processingStatus": "ready",
        "sensitivityStatus": "safe",
        "duration": 120,
        "fileSize": 15728640,
        "uploadedBy": {
          "_id": "...",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET `/api/videos/:id`

Get a single video's details. **Requires auth + org membership.**

**Validation Rules:**

- `:id` — valid MongoDB ObjectId

**Response (200):**

```json
{
  "success": true,
  "data": { "video": { "..." } }
}
```

**Errors:**

- `400` — Invalid video ID format
- `404` — Video not found

---

### GET `/api/videos/:id/stream`

Stream a processed video with HTTP range request support. **Requires auth + org membership.**

**Validation Rules:**

- `:id` — valid MongoDB ObjectId

**Behavior:**

- Returns `206 Partial Content` with `Content-Range` headers when `Range` header is present
- Returns `200 OK` with full file when no `Range` header
- Chunk size: 1MB

**Response Headers (206):**

```
Content-Range: bytes 0-1048575/5242880
Accept-Ranges: bytes
Content-Length: 1048576
Content-Type: video/mp4
```

**Errors:**

- `400` — Invalid video ID format
- `404` — Video not found or file missing on disk
- `422` — Video is not yet processed (status is not `ready`)

---

### DELETE `/api/videos/:id`

Soft-delete a video. Editors can only delete their own videos; admins can delete any. **Requires auth + editor/admin role.**

**Validation Rules:**

- `:id` — valid MongoDB ObjectId

**Response (200):**

```json
{ "success": true, "message": "Video deleted successfully" }
```

**Errors:**

- `400` — Invalid video ID format
- `403` — Editor trying to delete another user's video
- `404` — Video not found

---

## Socket.io Events

### Connection

The client connects to the Socket.io server and joins a room identified by the user's ID:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
socket.emit("join", userId);
```

### Server → Client Events

| Event                 | Payload                                                                 | Description                          |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `processing-progress` | `{ stage: 'transcoding' \| 'analyzing', progress: 0-100 }`              | Real-time processing progress update |
| `processing-complete` | `{ videoId, processingStatus, sensitivityStatus, streamUrl, duration }` | Processing finished successfully     |
| `processing-error`    | `{ videoId, message }`                                                  | Processing failed                    |

### Processing Stages

1. `starting` — Pipeline initiated (progress: 0)
2. `transcoding` — FFmpeg is converting the video (progress: 0–100)
3. `transcoding-complete` — Transcoding finished (progress: 100)
4. `analyzing` — Sensitivity analysis in progress (progress: 10, 30, 50, 70, 90, 100)
5. `processing-complete` — Final event with results

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

### Common Error Codes

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 400  | Bad request (validation error, bad input)  |
| 401  | Unauthorized (missing/invalid/expired JWT) |
| 403  | Forbidden (insufficient role permissions)  |
| 404  | Resource not found                         |
| 409  | Conflict (duplicate resource)              |
| 422  | Unprocessable (video not ready)            |
| 500  | Internal server error                      |
