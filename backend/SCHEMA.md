# Database Schema Documentation

## 1. User

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

---

## 2. Organization

| Field       | Type       | Required | Default | Details                                              |
| ----------- | ---------- | -------- | ------- | ---------------------------------------------------- |
| \_id        | ObjectId   | auto     | auto    | Unique identifier                                    |
| name        | String     | yes      | -       | Unique, trimmed                                      |
| description | String     | no       | ""      | Trimmed                                              |
| inviteCode  | String     | no       | auto    | Unique, auto-generated 8-char hex (e.g., `A1B2C3D4`) |
| createdBy   | ObjectId   | yes      | -       | Ref: User — the admin who created it                 |
| memberIds   | [ObjectId] | no       | []      | Ref: User — array of user IDs in this org            |
| status      | String     | no       | active  | Enum: `active`, `inactive` (soft delete)             |
| createdAt   | Date       | auto     | auto    | Mongoose timestamp                                   |
| updatedAt   | Date       | auto     | auto    | Mongoose timestamp                                   |

---

## 3. Video

| Field             | Type       | Required | Default   | Details                                                        |
| ----------------- | ---------- | -------- | --------- | -------------------------------------------------------------- |
| \_id              | ObjectId   | auto     | auto      | Unique identifier                                              |
| title             | String     | yes      | -         | Trimmed                                                        |
| description       | String     | no       | ""        | Trimmed                                                        |
| originalFileName  | String     | yes      | -         | Original uploaded filename                                     |
| fileUrl           | String     | yes      | -         | URL of original uploaded file                                  |
| streamUrl         | String     | no       | null      | URL of FFmpeg processed file (null until processing complete)  |
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

---

## 4. Category

| Field          | Type     | Required | Default | Details                                  |
| -------------- | -------- | -------- | ------- | ---------------------------------------- |
| \_id           | ObjectId | auto     | auto    | Unique identifier                        |
| name           | String   | yes      | -       | Trimmed                                  |
| organizationId | ObjectId | yes      | -       | Ref: Organization — scoped to org        |
| createdBy      | ObjectId | yes      | -       | Ref: User — who created it               |
| status         | String   | no       | active  | Enum: `active`, `inactive` (soft delete) |
| createdAt      | Date     | auto     | auto    | Mongoose timestamp                       |
| updatedAt      | Date     | auto     | auto    | Mongoose timestamp                       |

---

## Relationships

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

## Soft Delete Pattern

All schemas use `status: active/inactive` instead of hard deletes. When querying, always filter by `status: 'active'` to exclude soft-deleted records.
