# Assumptions & Design Decisions

---

## Assumptions

1. **Single Organization per User**
   A user can belong to only one organization at a time. This simplifies data isolation and permission checks. If a user needs to switch organizations, they would leave their current one first.

2. **Simulated Sensitivity Analysis**
   Since real content moderation AI (e.g., AWS Rekognition, Google Video Intelligence) is out of scope, the sensitivity analysis is simulated with a random classification (80% safe, 20% flagged) and timed progress updates to demonstrate the real-time pipeline architecture.

3. **Local File Storage**
   Videos are stored on the local file system (`uploads/` directory). In production, this would be replaced with cloud storage (e.g., AWS S3, Google Cloud Storage) for durability and scalability. Local storage is sufficient for demonstrating the upload/processing/streaming workflow.

4. **FFmpeg Availability**
   The system assumes FFmpeg is installed and accessible on the host machine's PATH. Without it, video transcoding will fail but the application will still function for non-upload features (auth, org management, viewing metadata).

5. **No Email Verification**
   Registration does not require email verification. In production, email confirmation and password reset flows would be added to prevent fake accounts and improve security.

6. **Single Server Deployment**
   The architecture assumes a single server instance. Socket.io events are emitted in-process without a message broker. For horizontal scaling, a Redis adapter for Socket.io and shared file storage would be needed.

---

## Design Decisions

### Backend

1. **Express 5 + ES Modules**
   Chose Express 5 for native async error handling support (async route handlers automatically forward errors to the error middleware) and ES modules (`import/export`) for modern JavaScript syntax consistency across the entire codebase.

2. **Soft Deletes**
   All models use a `status: active/inactive` field instead of hard deletes. This preserves referential integrity (e.g., a deleted user's uploaded videos still reference a valid user document), enables data recovery, and maintains audit trails. All queries filter by `status: 'active'`.

3. **JWT via Bearer Token + Query Parameter**
   Authentication uses JWT tokens sent in the `Authorization: Bearer <token>` header. Tokens are also accepted via query parameter (`?token=`) to support scenarios where setting headers is not possible (e.g., direct video streaming URLs in `<video>` tags).

4. **Room-Based Socket.io**
   Each user joins a Socket.io room identified by their user ID. Processing events are emitted to the specific user's room, ensuring progress updates reach only the uploader — not the entire organization or all connected clients. This is both a privacy and a performance consideration.

5. **FFmpeg with `faststart`**
   Videos are transcoded with the `-movflags +faststart` flag, which moves the moov atom to the beginning of the file. This enables progressive playback — the browser can start playing the video before the entire file is downloaded, which is critical for a good streaming experience.

6. **HTTP Range Requests with 1MB Chunks**
   The streaming endpoint implements RFC 7233 range requests with a 1MB chunk size. This enables video seeking (jumping to any position) without downloading the entire file, and provides efficient bandwidth usage for large video files.

7. **Multer with Randomized Filenames**
   Uploaded files are renamed to random 32-character hex strings (via `crypto.randomBytes(16)`) with the original extension preserved. This prevents filename collisions when multiple users upload files with the same name and mitigates directory traversal attacks from malicious filenames.

8. **Input Validation via express-validator**
   All API inputs are validated and sanitized at the route level using `express-validator` middleware. Validation runs before the controller logic, returning consistent `400` error responses with descriptive messages. This centralizes validation logic and keeps controllers focused on business logic.

9. **Centralized Error Handling**
   The backend uses a single global error handler middleware that normalizes different error types into consistent JSON responses:
   - Mongoose `ValidationError` → 400
   - Mongoose duplicate key (code 11000) → 409
   - Mongoose `CastError` (bad ObjectId) → 400
   - `JsonWebTokenError` / `TokenExpiredError` → 401
   - Multer file size errors → 400
   
   This ensures the client always receives a predictable error format regardless of where the error originated.

### Frontend

10. **Vite Proxy for Development**
    The frontend's Vite dev server proxies `/api` and `/socket.io` requests to the backend at `localhost:5000`. This avoids CORS issues during development without requiring environment-specific API base URLs or CORS headers in the backend. The frontend API client uses a relative `/api` base URL.

11. **shadcn/ui + Tailwind CSS**
    Chose shadcn/ui for accessible, customizable React components (built on Radix UI primitives) with Tailwind CSS for utility-first styling. Components are copied into the project (not imported from a package), allowing full customization. This combination provides a professional, accessible UI with minimal custom CSS.

12. **React Error Boundary**
    A global error boundary wraps the entire application to catch unhandled JavaScript errors in the component tree and display a fallback UI with recovery options (try again / go home) instead of a white screen.

13. **React Context for Auth State**
    Auth state (user, token, loading) is managed via React Context (`AuthContext`) rather than a state management library like Redux. For this application's scope — a single authenticated user with a token — Context provides sufficient capability without additional dependencies or boilerplate.

14. **Axios Interceptors for Auth**
    The Axios client automatically attaches the JWT token to every request via a request interceptor, and handles `401` responses globally via a response interceptor (clearing the token and redirecting to login). This ensures consistent auth handling across all API calls without repetitive code in each component.
