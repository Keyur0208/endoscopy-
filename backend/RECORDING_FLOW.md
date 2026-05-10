# Recording System – Flow & Architecture

## Overview

This module enables video recording from a browser camera (via `MediaRecorder`), still-image capture (camera snapshots), and post-processing (FFmpeg concatenation + thumbnail extraction).

All feature flags and storage paths are controlled through `ConfigurationModule` records in the database — no code change required to enable/disable features per branch.

---

## How It Works

```
Browser (MediaRecorder)
        │
        │  POST /recordings/start
        ▼
┌─────────────────────────┐
│  Create DB row          │  RecordingSession  status=RECORDING
│  Ensure fs directories  │
└─────────────────────────┘
        │
        │  POST /recordings/:code/chunk?index=0  (raw binary body)
        │  POST /recordings/:code/chunk?index=1
        │  …
        ▼
┌─────────────────────────┐
│  Save chunk to disk     │  {recordingsPath}/{patientId}/{date}/{code}/chunks/video_0000.webm
│  Normalise MP4 chunks   │  (ffmpeg -movflags +faststart, for fMP4 streams)
└─────────────────────────┘
        │
        │  POST /recordings/:code/stop
        ▼
┌─────────────────────────┐
│  status → PROCESSING    │
│  FFmpeg concat demuxer  │  chunks/*.webm  →  final.mp4
│  FFmpeg thumbnail       │  final.mp4      →  thumbnails/thumb.jpg
│  Copy to backup dir     │  (non-fatal if fails)
│  status → READY         │
└─────────────────────────┘

        │  POST /recordings/:code/capture  { imageData: "data:image/jpeg;base64,..." }
        ▼
┌─────────────────────────┐
│  Check enable_capture   │  403 if disabled
│  Decode base64          │
│  Save  .jpg to disk     │  captures/cap_<timestamp>.jpg
│  Create CaptureImage row│
└─────────────────────────┘
```

---

## Directory Layout

```
{recordingsPath}/
└── {patientId}/
    └── {YYYY-MM-DD}/
        └── {sessionCode}/
            ├── chunks/          ← raw browser chunks (webm / mp4)
            ├── thumbnails/
            │   └── thumb.jpg    ← extracted by FFmpeg
            ├── captures/
            │   └── cap_<ts>.jpg ← camera still images
            └── final.mp4        ← assembled by FFmpeg
```

---

## Configuration (via ConfigurationModule)

Seed these rows (or create them via the `/configurations` API) to control the feature:

| module    | subModule | fieldKey          | value (example)          | description                     |
|-----------|-----------|-------------------|--------------------------|---------------------------------|
| recording | storage   | recordings_path   | /var/data/recordings     | Base folder for all sessions    |
| recording | storage   | backup_path       | /var/data/recordings_bak | Backup folder (copied on stop)  |
| recording | camera    | enable_capture    | true                     | Enable/disable camera captures  |

- Scope can be set per **branch** (`branchId`), per **organisation** (`organizationId`), or globally (both `null`).
- Branch-scoped config takes priority over org-scoped, which takes priority over global.
- If no record exists, defaults are used (`./data/recordings`, `./data/recordings_backup`, capture **disabled**).

---

## API Endpoints

All endpoints require a valid `Authorization: Bearer <token>` header.

### Sessions

| Method | Path                           | Description                           |
|--------|--------------------------------|---------------------------------------|
| GET    | /recordings                    | List sessions (paginated)             |
| POST   | /recordings/start              | Start a new session                   |
| GET    | /recordings/:sessionCode       | Get session detail + capture list     |
| POST   | /recordings/:sessionCode/chunk | Upload a raw video chunk              |
| POST   | /recordings/:sessionCode/stop  | Stop recording, run FFmpeg            |

### Captures (camera stills)

| Method | Path                              | Description                 |
|--------|-----------------------------------|-----------------------------|
| POST   | /recordings/:sessionCode/capture  | Save a camera still image   |
| GET    | /recordings/:sessionCode/captures | List all stills for session |

---

## Request & Response Examples

### Start

```http
POST /recordings/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientId": 42,
  "mimeType": "video/webm;codecs=vp9",
  "remark": "Pre-op assessment"
}
```

Response:
```json
{
  "success": true,
  "message": "Recording session started successfully",
  "data": {
    "id": 1,
    "sessionCode": "REC-M5X1A2-K9PQ",
    "status": "RECORDING",
    "_meta": { "date": "2026-05-09", "chunkExtension": "webm" }
  }
}
```

### Upload Chunk

```http
POST /recordings/REC-M5X1A2-K9PQ/chunk?index=0
Content-Type: video/webm
Authorization: Bearer <token>

<raw binary>
```

### Stop

```http
POST /recordings/REC-M5X1A2-K9PQ/stop
Content-Type: application/json
Authorization: Bearer <token>

{ "durationSeconds": 120 }
```

### Camera Capture

```http
POST /recordings/REC-M5X1A2-K9PQ/capture
Content-Type: application/json
Authorization: Bearer <token>

{ "imageData": "data:image/jpeg;base64,/9j/4AAQ..." }
```

---

## Status Flow

```
RECORDING  →  PROCESSING  →  READY
                          →  ERROR   (FFmpeg failure)
```

---

## FFmpeg Requirements

- `ffmpeg` must be installed and available on `PATH`.
- Or set the `FFMPEG_BIN` environment variable to an absolute path.
- Minimum version: 4.x (concat demuxer + faststart support).

Install on Ubuntu/Debian:
```bash
sudo apt-get install ffmpeg
```

Install on Windows (via Chocolatey):
```bash
choco install ffmpeg
```

---

## Database Models

### RecordingSession (`recording_sessions`)

| Column            | Type     | Notes                                       |
|-------------------|----------|---------------------------------------------|
| id                | Int      | PK                                          |
| session_code      | String   | Unique code (e.g. `REC-M5X1A2-K9PQ`)        |
| patient_id        | Int?     | FK to patient_registrations (not enforced)  |
| remark            | String?  | Free-text note                              |
| status            | String   | RECORDING / PROCESSING / READY / ERROR      |
| live_hls_path     | String?  | Future: HLS stream path                     |
| final_video_path  | String?  | Absolute path to final.mp4 after processing |
| thumbnail_path    | String?  | Absolute path to thumb.jpg                  |
| duration_seconds  | Int?     | Set by the client on stop                   |
| started_at        | DateTime | Auto (default now)                          |
| stopped_at        | DateTime?| Set on stop                                 |
| branch_id         | Int?     | Branch scope                                |
| organization_id   | Int?     | Org scope                                   |
| created_at        | DateTime | Audit                                       |
| updated_at        | DateTime | Audit                                       |
| created_by        | Int?     | Audit – user                                |
| updated_by        | Int?     | Audit – user                                |
| created_by_admin  | Int?     | Audit – admin                               |
| updated_by_admin  | Int?     | Audit – admin                               |

### CaptureImage (`capture_images`)

| Column           | Type     | Notes                          |
|------------------|----------|--------------------------------|
| id               | Int      | PK                             |
| session_id       | Int      | FK → recording_sessions.id     |
| image_path       | String   | Absolute path to .jpg on disk  |
| captured_at      | DateTime | Auto (default now)             |
| created_at       | DateTime | Audit                          |
| updated_at       | DateTime | Audit                          |
| created_by       | Int?     | Audit – user                   |
| updated_by       | Int?     | Audit – user                   |
| created_by_admin | Int?     | Audit – admin                  |
| updated_by_admin | Int?     | Audit – admin                  |

---

## Setup Steps

1. **Apply schema changes** to the database:
   ```bash
   npm run prisma:push
   # or for migrations:
   # npx prisma migrate dev --schema=./src/prisma/schema.prisma
   ```

2. **Regenerate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

3. **Seed configuration** (optional — use the API or add rows manually):
   ```json
   [
     { "module": "recording", "subModule": "storage", "fieldKey": "recordings_path", "value": "/var/data/recordings",     "fieldLabel": "Recordings Path",  "fieldType": "text" },
     { "module": "recording", "subModule": "storage", "fieldKey": "backup_path",      "value": "/var/data/recordings_bak", "fieldLabel": "Backup Path",       "fieldType": "text" },
     { "module": "recording", "subModule": "camera",  "fieldKey": "enable_capture",   "value": "true",                     "fieldLabel": "Enable Capture",    "fieldType": "boolean" }
   ]
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```
