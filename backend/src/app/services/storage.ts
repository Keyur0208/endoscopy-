import fs from 'fs';
import path from 'path';
import { prisma } from '../../config/database';
import { CAMERA_CAPTURE_KEYS, MODULE_KEYS, SUBMODULE_KEYS } from 'endoscopy-shared';

// ── Default paths ─────────────────────────────────────────────────────────────

const DEFAULT_RECORDINGS_PATH = path.resolve(process.cwd(), 'data', 'recordings');
const DEFAULT_BACKUP_PATH = path.resolve(process.cwd(), 'data', 'recordings_backup');

// ── Config lookup helpers ─────────────────────────────────────────────────────

async function getConfigValue(
    module: string,
    fieldKey: string,
    subModule: string,
    branchId?: number | null,
    organizationId?: number | null
): Promise<string | null> {
    // Try branch scope first, then org scope, then global (no scope).
    const scopes: Array<Record<string, unknown>> = [];
    if (branchId) scopes.push({ branchId, organizationId: organizationId ?? undefined });
    if (organizationId) scopes.push({ branchId: null, organizationId });
    scopes.push({ branchId: null, organizationId: null });

    for (const scopeWhere of scopes) {
        const record = await prisma.configurationModule.findFirst({
            where: {
                module,
                subModule,
                fieldKey,
                isActive: true,
                ...scopeWhere,
            },
            select: { value: true, defaultValue: true },
        });
        if (record) {
            return record.value ?? record.defaultValue ?? null;
        }
    }
    return null;
}

// ── Public path helpers ───────────────────────────────────────────────────────

export async function getRecordingsPath(
    branchId?: number | null,
    organizationId?: number | null
): Promise<string> {
    const configured = await getConfigValue(
        MODULE_KEYS.CAMERA_CAPTURE,
        SUBMODULE_KEYS.CAMERA_CAPTURE,
        CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_FOLDER_PATH,
        branchId,
        organizationId
    );
    return configured ? path.resolve(configured) : DEFAULT_RECORDINGS_PATH;
}

export async function getBackupPath(
    branchId?: number | null,
    organizationId?: number | null
): Promise<string> {
    const configured = await getConfigValue(
        MODULE_KEYS.CAMERA_CAPTURE,
        SUBMODULE_KEYS.CAMERA_CAPTURE,
        CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_BACKUP_FOLDER_PATH,
        branchId,
        organizationId
    );
    return configured ? path.resolve(configured) : DEFAULT_BACKUP_PATH;
}

/**
 * Returns true when camera capture is enabled via configuration.
 * Defaults to false (disabled) when no configuration record exists.
 */
export async function isCameraCaptureEnabled(
    userType: string,
    branchId?: number | null,
    organizationId?: number | null
): Promise<boolean> {
    if (userType == 'admin') {
        return true;
    }
    const value = await getConfigValue(
        MODULE_KEYS.CAMERA_CAPTURE,
        SUBMODULE_KEYS.CAMERA_CAPTURE,
        CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_ENABLED,
        branchId,
        organizationId
    );
    return value === 'true';
}

// ── Directory builders ────────────────────────────────────────────────────────

export function getCaptureRelativePath(
    patientId: string | number,
    date: string,
    sessionCode: string,
    filename: string
): string {
    return path
        .join(
            String(patientId),
            date,
            sessionCode,
            'captures',
            filename
        )
        .replace(/\\/g, '/');
}

export function getPatientDir(base: string, patientId: string | number): string {
    return path.join(base, String(patientId));
}

export function getSessionDir(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(base, String(patientId), date, sessionCode);
}

export function getChunksDir(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(getSessionDir(base, patientId, date, sessionCode), 'chunks');
}

export function getThumbnailsDir(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(getSessionDir(base, patientId, date, sessionCode), 'thumbnails');
}

export function getCapturesDir(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(getSessionDir(base, patientId, date, sessionCode), 'captures');
}

export function getFinalVideoPath(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(getSessionDir(base, patientId, date, sessionCode), 'final.mp4');
}

export function getThumbnailPath(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string {
    return path.join(getThumbnailsDir(base, patientId, date, sessionCode), 'thumb.jpg');
}

function getRecordingPath(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): string { return path.join(getSessionDir(base, patientId, date, sessionCode), 'recording.json'); }


// ── Directory creation ────────────────────────────────────────────────────────

export async function ensureSessionDirs(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): Promise<void> {
    const dirs = [
        getSessionDir(base, patientId, date, sessionCode),
        getChunksDir(base, patientId, date, sessionCode),
        getThumbnailsDir(base, patientId, date, sessionCode),
        getCapturesDir(base, patientId, date, sessionCode),
    ];
    for (const dir of dirs) {
        await fs.promises.mkdir(dir, { recursive: true });
    }
}

// ── Utility: today's date string ─────────────────────────────────────────────

export function todayDateString(): string {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// ── Utility: generate a unique session code ───────────────────────────────────

export function generateSessionCode(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `REC-${ts}-${rand}`;
}

// ── Chunk-list helper ─────────────────────────────────────────────────────────

/**
 * Returns sorted chunk file paths from the chunks directory.
 */
export async function listChunkFiles(chunkDir: string): Promise<string[]> {
    try {
        const files = await fs.promises.readdir(chunkDir);
        return files
            .filter((f) => /\.(webm|mp4|mkv|ogg)$/i.test(f))
            .sort()
            .map((f) => path.join(chunkDir, f));
    } catch {
        return [];
    }
}

// ── Backup helper ─────────────────────────────────────────────────────────────

/**
 * Copies the finished session directory into the backup location.
 * Uses fs.cp (Node ≥ 16.7) with recursive option.
 */
export async function backupSession(
    srcDir: string,
    backupBase: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): Promise<void> {
    const destDir = path.join(backupBase, String(patientId), date, sessionCode);
    await fs.promises.mkdir(path.dirname(destDir), { recursive: true });
    await fs.promises.cp(srcDir, destDir, { recursive: true });
}

// ── Recording metadata ────────────────────────────────────────────────────────
export async function readRecordingMeta(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string
): Promise<Record<string, unknown> | null> {
    try {
        return JSON.parse(await fs.promises.readFile(getRecordingPath(base, patientId, date, sessionCode), 'utf8'));
    } catch {
        return null;
    }
}

export async function writeRecordingMeta(
    base: string,
    patientId: string | number,
    date: string,
    sessionCode: string,
    meta: Record<string, unknown>
): Promise<void> {
    await fs.promises.writeFile(getRecordingPath(base, patientId, date, sessionCode), JSON.stringify(meta, null, 2), 'utf8');
}
