import fs from 'fs';
import path from 'path';
import { prisma } from '../../config/database';
import { AuthenticatedUser } from '../../config/types/auth';
import {
    IStartRecordingSession,
    IListRecordingSessionsQuery,
} from '../../config/types/recording';
import { MESSAGES } from '../../utils/messages';
import { AppError } from '../../utils/app-error';
import { applyBranchScope, assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';
import * as storageService from './storage';
import * as ffmpegService from './ffmpeg';
import { RecordingStatus } from 'endoscopy-shared';
import { getRecordingsPath } from './storage';

// ── Helpers ───────────────────────────────────────────────────────────────────

function chunkExtensionFromMime(mimeType?: string): string {
    if (!mimeType) return 'webm';
    if (mimeType.includes('mp4')) return 'mp4';
    if (mimeType.includes('ogg')) return 'ogg';
    if (mimeType.includes('mkv')) return 'mkv';
    return 'webm';
}

// ── Start recording ───────────────────────────────────────────────────────────

export async function startSession(
    user: AuthenticatedUser,
    payload: IStartRecordingSession & { mimeType?: string; captureDate?: string; entryDate?: string }
) {
    const audit = assignCreatedBy(user);
    const sessionCode = storageService.generateSessionCode();
    const date = storageService.todayDateString();
    const branchId = audit.branchId ?? null;
    const organizationId = audit.organizationId ?? null;

    const recordingsBase = await storageService.getRecordingsPath(branchId, organizationId);

    await storageService.ensureSessionDirs(
        recordingsBase,
        payload.patientId ?? 'unknown',
        date,
        sessionCode
    );

    const session = await prisma.recordingSession.create({
        data: {
            sessionCode,
            patientId: payload.patientId ?? null,
            remark: payload.remark ?? null,
            mimeType: payload.mimeType ?? null,
            captureDate: payload.captureDate ?? null,
            entryDate: payload.entryDate ?? null,
            status: RecordingStatus.Recording,
            branchId,
            organizationId,
            resourceInfo: audit.resourceInfo,
            createdBy: audit.createdBy,
            createdByAdmin: audit.createdByAdmin,
            updatedBy: null,
            updatedByAdmin: null,
        },
    });

    // ── recording.json ─────────────────────────────

    const recordingMeta = {
        sessionId: sessionCode,
        patientId: payload.patientId ?? 'unknown',
        date: date,
        source: 'frontend-browser',
        deviceName: 'Browser camera',
        mimeType: payload.mimeType ?? 'video/webm',
        chunkExtension: chunkExtensionFromMime(payload.mimeType),
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'recording',
        chunkDuration: 10,
        chunks: [],
        totalDuration: 0,
        liveHlsUrl: null,
        finalMp4: null,
        hlsReady: false,
        hlsMasterUrl: null,
        thumbnailsReady: false,
        thumbnails: [],
        error: null,
    };

    await storageService.writeRecordingMeta(
        recordingsBase,
        payload.patientId ?? 'unknown',
        date,
        sessionCode,
        recordingMeta
    );


    return {
        success: true,
        message: MESSAGES.RECORDING_STARTED_SUCCESSFULLY,
        data: {
            ...session,
            _meta: {
                date,
                chunkExtension: chunkExtensionFromMime(payload.mimeType),
                recordingsBase,
            },
        },
    };
}

// ── Append chunk ──────────────────────────────────────────────────────────────

/**
 * Save a raw video chunk buffer to disk.
 *
 * @param sessionCode  - The unique session identifier.
 * @param chunkIndex   - Zero-based chunk sequence number (used for filename ordering).
 * @param buffer       - Raw binary data from the browser's MediaRecorder.
 * @param mimeType     - Optional MIME type to derive file extension.
 */
export async function appendChunk(
    sessionCode: string,
    chunkIndex: number,
    buffer: Buffer,
    mimeType?: string
): Promise<{ filename: string; size: number }> {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new AppError(400, 'Recording chunk is empty');
    }

    const session = await prisma.recordingSession.findUnique({
        where: { sessionCode },
        select: { id: true, status: true, patientId: true, branchId: true, organizationId: true },
    });

    if (!session) throw new AppError(404, MESSAGES.RECORDING_SESSION_NOT_FOUND);
    if (session.status !== RecordingStatus.Recording) {
        throw new AppError(409, MESSAGES.RECORDING_NOT_IN_PROGRESS);
    }

    const date = storageService.todayDateString();
    const recordingsBase = await storageService.getRecordingsPath(session.branchId, session.organizationId);
    const ext = chunkExtensionFromMime(mimeType);
    const filename = `video_${String(chunkIndex).padStart(4, '0')}.${ext}`;
    const chunkDir = storageService.getChunksDir(
        recordingsBase,
        session.patientId ?? 'unknown',
        date,
        sessionCode
    );

    await fs.promises.mkdir(chunkDir, { recursive: true });

    const chunkPath = path.join(chunkDir, filename);
    await fs.promises.writeFile(chunkPath, buffer, {
        flag: 'wx',
    });
    const stat = await fs.promises.stat(chunkPath);

    // ── recording.json update ─────────────────────

    const meta = await storageService.readRecordingMeta(
        recordingsBase,
        session.patientId ?? 'unknown',
        date,
        sessionCode
    );

    if (meta) {
        const chunks = Array.isArray(meta.chunks)
            ? meta.chunks
            : [];

        chunks.push({
            index: chunkIndex,
            filename,
            size: stat.size,
            createdAt: new Date().toISOString(),
        });

        meta.chunks = chunks;

        await storageService.writeRecordingMeta(
            recordingsBase,
            session.patientId ?? 'unknown',
            date,
            sessionCode,
            meta
        );
    }

    return { filename, size: stat.size };
}

// ── Stop recording ────────────────────────────────────────────────────────────


export async function stopSession(
    sessionCode: string,
    user: AuthenticatedUser,
    durationSeconds?: number
) {
    const session = await prisma.recordingSession.findUnique({
        where: { sessionCode },
        select: {
            id: true, status: true, patientId: true,
            branchId: true, organizationId: true,
        },
    });

    if (!session) throw new AppError(404, MESSAGES.RECORDING_SESSION_NOT_FOUND);
    if (session.status !== RecordingStatus.Recording) {
        throw new AppError(409, MESSAGES.RECORDING_NOT_IN_PROGRESS);
    }

    const audit = assignUpdatedBy(user);
    const date = storageService.todayDateString();
    const recordingsBase = await storageService.getRecordingsPath(session.branchId, session.organizationId);
    const patId = session.patientId ?? 'unknown';

    const chunkDir = storageService.getChunksDir(recordingsBase, patId, date, sessionCode);
    const finalPath = storageService.getFinalVideoPath(recordingsBase, patId, date, sessionCode);
    const thumbPath = storageService.getThumbnailPath(recordingsBase, patId, date, sessionCode);
    const sessionDir = storageService.getSessionDir(recordingsBase, patId, date, sessionCode);

    // Mark as PROCESSING while FFmpeg runs.
    await prisma.recordingSession.update({
        where: { sessionCode },
        data: { status: RecordingStatus.Processing, stoppedAt: new Date(), updatedBy: audit.updatedBy, updatedByAdmin: audit.updatedByAdmin },
    });

    let finalVideoPath: string | null = null;
    let thumbnailPath: string | null = null;

    try {
        const chunks = await storageService.listChunkFiles(chunkDir);

        if (chunks.length > 0) {
            await ffmpegService.mergeChunks(chunks, finalPath);
            finalVideoPath = finalPath;

            try {
                await ffmpegService.extractThumbnail(finalPath, thumbPath);
                thumbnailPath = thumbPath;
            } catch {
                console.warn(`[recording] thumbnail extraction failed for ${sessionCode}`);
            }
        }

        // recording.json update

        const meta = await storageService.readRecordingMeta(
            recordingsBase,
            patId,
            date,
            sessionCode
        );

        if (meta) {
            meta.status = RecordingStatus.Ready;
            meta.endTime = new Date().toISOString();
            meta.totalDuration = durationSeconds ?? 0;
            meta.finalMp4 = 'final.mp4';
            meta.thumbnailsReady = !!thumbnailPath;
            meta.error = null;


            await storageService.writeRecordingMeta(
                recordingsBase,
                patId,
                date,
                sessionCode,
                meta
            );
        }

        // BackUp
        try {
            const backupBase = await storageService.getBackupPath(session.branchId, session.organizationId);
            await storageService.backupSession(sessionDir, backupBase, patId, date, sessionCode);
        } catch {
            console.warn(`[recording] backup failed for ${sessionCode}`);
        }


        const updated = await prisma.recordingSession.update({
            where: { sessionCode },
            data: {
                status: RecordingStatus.Ready,
                finalVideoPath,
                thumbnailPath,
                durationSeconds: durationSeconds ?? null,
                updatedBy: audit.updatedBy,
                updatedByAdmin: audit.updatedByAdmin,
            },
        });

        return {
            success: true,
            message: MESSAGES.RECORDING_STOPPED_SUCCESSFULLY,
            data: updated,
        };
    } catch (err) {
        // Mark as ERROR so the client knows something went wrong.
        await prisma.recordingSession.update({
            where: { sessionCode },
            data: { status: RecordingStatus.Error, updatedBy: audit.updatedBy, updatedByAdmin: audit.updatedByAdmin },
        }).catch(() => undefined);

        throw err;
    }
}

// ── Camera capture ────────────────────────────────────────────────────────────

export async function saveCaptureImage(
    sessionCode: string,
    file: Express.Multer.File,
    user: AuthenticatedUser
) {
    const session = await prisma.recordingSession.findUnique({
        where: { sessionCode },
        select: { id: true, status: true, patientId: true, branchId: true, organizationId: true },
    });

    if (!session) throw new AppError(404, MESSAGES.RECORDING_SESSION_NOT_FOUND);

    const captureEnabled = await storageService.isCameraCaptureEnabled(
        user.userType,
        session.branchId,
        session.organizationId
    );
    if (!captureEnabled) {
        throw new AppError(403, MESSAGES.CAMERA_CAPTURE_DISABLED);
    }

    if (!file || !file.buffer) {
        throw new AppError(
            400,
            MESSAGES.INVALID_IMAGE_DATA
        );
    }

    const imageBuffer = file.buffer;
    const audit = assignCreatedBy(user);
    const date = storageService.todayDateString();
    const recordingsBase = await storageService.getRecordingsPath(session.branchId, session.organizationId);
    const capturesDir = storageService.getCapturesDir(
        recordingsBase,
        session.patientId ?? 'unknown',
        date,
        sessionCode
    );

    await fs.promises.mkdir(capturesDir, { recursive: true });

    const extension = path.extname(file.originalname) || '.png';
    const filename = `cap_${Date.now()}${extension}`;

    const relativePath = storageService.getCaptureRelativePath(
        session.patientId ?? 'unknown',
        date,
        sessionCode,
        filename
    );

    const imagePath = path.join(capturesDir, filename);

    await fs.promises.writeFile(imagePath, imageBuffer);

    const capture = await prisma.captureImage.create({
        data: {
            sessionId: session.id,
            imagePath: relativePath,
            capturedAt: new Date(),
            resourceInfo: audit.resourceInfo,
            createdBy: audit.createdBy,
            createdByAdmin: audit.createdByAdmin,
            updatedBy: null,
            updatedByAdmin: null,
        },
    });

    return {
        success: true,
        message: MESSAGES.CAPTURE_IMAGE_SAVED_SUCCESSFULLY,
        data: capture,
    };
}

// ── List sessions ─────────────────────────────────────────────────────────────

export async function listSessions(
    user: AuthenticatedUser,
    {
        page = 1,
        perPage = 20,
        searchedValue,
    }: IListRecordingSessionsQuery = {}
) {
    const pageNumber = Math.max(1, Number(page));
    const perPageNumber = Math.max(1, Math.min(100, Number(perPage)));
    const skip = (pageNumber - 1) * perPageNumber;

    const baseWhere: Record<string, unknown> = {};
    const where = applyBranchScope(baseWhere, user);

    if (searchedValue && searchedValue.trim() !== '') {
        where.OR = [
            { sessionCode: { contains: searchedValue } },
        ];
    }

    const [sessions, total, lastPatient] = await Promise.all([
        prisma.recordingSession.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: perPageNumber,
            include: {
                _count: { select: { captures: true, } },
                createdByAdminUser: true,
                updatedByAdminUser: true,
                createdByUser: true, updatedByUser: true,
                patient: true,
            },

        }),
        prisma.recordingSession.count({ where }),
        prisma.recordingSession.findFirst({
            orderBy: { id: 'desc' },
            select: { id: true },
        }),
    ]);


    const lastPage = Math.ceil(total / perPageNumber);

    return {
        success: true,
        message: MESSAGES.RECORDING_LIST_FETCHED_SUCCESSFULLY,
        data: sessions,
        meta: {
            currentPage: pageNumber,
            perPage: perPageNumber,
            total,
            lastPage,
            lastId: lastPatient?.id ?? null,
        },
    };
}

// ── Get session by code ───────────────────────────────────────────────────────

export async function getSessionByCode(id: number) {

    const session = await prisma.recordingSession.findFirst({
        where: { id },
        include: {
            captures: true,
            _count: {
                select: {
                    captures: true,
                },
            },
            branch: true,
            organization: true,
            createdByAdminUser: true,
            updatedByAdminUser: true,
            createdByUser: true,
            updatedByUser: true,
            patient: true,
        },
    });

    if (!session) {
        return { success: false, message: MESSAGES.PATIENT_NOT_FOUND };
    }

    const [next, previous, positionResult, totalResult] = await Promise.all([
        prisma.recordingSession.findFirst({
            where: { id: { gt: id } },
            orderBy: { id: 'asc' },
            select: { id: true },
        }),
        prisma.recordingSession.findFirst({
            where: { id: { lt: id } },
            orderBy: { id: 'desc' },
            select: { id: true },
        }),
        prisma.recordingSession.count({ where: { id: { lte: id } } }),
        prisma.recordingSession.count(),
    ]);

    return {
        success: true,
        message: MESSAGES.RECORDING_FETCHED_SUCCESSFULLY,
        data: session,
        meta: {
            position: positionResult,
            total: totalResult,
            nextId: next?.id ?? null,
            prevId: previous?.id ?? null,
        },
    };
}

// ── List captures for a session ───────────────────────────────────────────────

export async function listCaptures(sessionCode: string) {
    const session = await prisma.recordingSession.findUnique({
        where: { sessionCode },
        select: { id: true },
    });

    if (!session) throw new AppError(404, MESSAGES.RECORDING_SESSION_NOT_FOUND);

    const basePath = await storageService.getRecordingsPath();

    const captures = await prisma.captureImage.findMany({
        where: { sessionId: session.id },
        orderBy: { capturedAt: 'asc' },
    });

    const capturesWithUrls = captures.map(capture => ({
        ...capture,
        imageUrl: `${basePath}/${capture.imagePath}`,
    }));

    return {
        success: true,
        message: MESSAGES.CAPTURE_IMAGES_FETCHED_SUCCESSFULLY,
        data: capturesWithUrls,
    };
}
