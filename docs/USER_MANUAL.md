# User Manual

A step-by-step guide covering the complete user journey through the Pulse platform.

---

## Table of Contents

- [1. Register an Account](#1-register-an-account)
- [2. Create or Join an Organization](#2-create-or-join-an-organization)
- [3. Dashboard (Video Library)](#3-dashboard-video-library)
- [4. Upload a Video](#4-upload-a-video)
- [5. Watch a Video](#5-watch-a-video)
- [6. Admin Panel](#6-admin-panel)
- [Role Permissions Summary](#role-permissions-summary)

---

## 1. Register an Account

- Navigate to `/register`
- Fill in your name, email, and password (minimum 6 characters)
- Click **Register** — you'll be redirected to the organization page
- Already have an account? Click the **Login** link to sign in instead

---

## 2. Create or Join an Organization

After registration, you need to be part of an organization to access the platform. You'll see two options side by side:

### Create an Organization

- Enter an organization name and optional description
- Click **Create** — you'll become the **admin** of this organization
- An invite code is automatically generated — share it with team members so they can join

### Join an Organization

- Enter an invite code shared by an admin
- Click **Join** — you'll join as a **viewer** by default
- An admin can later promote you to editor or admin

Once you're in an organization, you'll be redirected to the dashboard.

---

## 3. Dashboard (Video Library)

The main dashboard shows all videos uploaded within your organization:

- **Video cards** display the title, uploader name, upload date, processing status, and sensitivity classification
- **Status badges** indicate the current state:
  - Processing status: `processing` (yellow), `ready` (green), `failed` (red)
  - Sensitivity status: `safe` (green), `flagged` (red)
- **Filter videos** using the filter bar:
  - By processing status: all / processing / ready / failed
  - By sensitivity status: all / safe / flagged
- **Click any video card** to open the video player page
- When no videos exist, an empty state message is shown

---

## 4. Upload a Video

> **Available to: Editor and Admin roles only**

- Navigate to the **Upload** page from the sidebar
- Fill in the upload form:
  - **Title** (required) — give your video a descriptive name
  - **Description** (optional) — add context about the video
  - **Video file** — drag and drop a file or click to browse
- Supported formats: MP4, MKV, AVI, WebM, MOV
- Maximum file size: 500MB
- Click **Upload** to start

### Real-Time Processing Progress

After uploading, you'll see live progress updates:

1. **Transcoding stage** — FFmpeg converts your video to web-optimized H.264 format. A progress bar shows the percentage complete.
2. **Analysis stage** — The sensitivity analysis runs, with progress updating in steps (10%, 30%, 50%, 70%, 90%, 100%).
3. **Complete** — Your video is classified as either `safe` or `flagged` and is immediately available for streaming.

If processing fails, an error message is displayed and you can try re-uploading.

---

## 5. Watch a Video

- From the dashboard, click on any video with `ready` status
- The integrated HTML5 video player loads with full controls:
  - Play / Pause
  - Seek to any position (supported by HTTP range requests)
  - Volume control
  - Fullscreen mode
- Below the player, video metadata is displayed:
  - Title and description
  - Uploader name
  - Upload date
  - Duration
  - File size
  - Sensitivity status
- **Delete button** — visible to admins (for any video) and editors (for their own videos only). A confirmation dialog appears before deletion.

---

## 6. Admin Panel

> **Available to: Admin role only**

Access the Admin Panel from the sidebar to manage your organization:

### Organization Info

- View your organization's name, description, and invite code
- **Copy** the invite code with a single click to share with new team members

### Member Management

A table lists all organization members with:

- Name
- Email
- Current role
- Join date

**Actions per member:**

- **Change Role** — Use the dropdown to assign a new role (admin, editor, or viewer). Changes take effect immediately. You cannot change your own role.
- **Remove Member** — Click the remove button and confirm in the dialog. The member loses access to all organization data. You cannot remove yourself.

---

## Role Permissions Summary

| Action              | Viewer | Editor | Admin |
| ------------------- | ------ | ------ | ----- |
| View video library  | Yes    | Yes    | Yes   |
| Stream/watch videos | Yes    | Yes    | Yes   |
| Upload videos       | No     | Yes    | Yes   |
| Delete own videos   | No     | Yes    | Yes   |
| Delete any video    | No     | No     | Yes   |
| Access admin panel  | No     | No     | Yes   |
| Manage member roles | No     | No     | Yes   |
| Remove members      | No     | No     | Yes   |
