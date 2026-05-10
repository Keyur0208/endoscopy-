/**
 * recording.ts  (controller layer)
 *
 * Endpoint handlers for recording sessions.
 *
 * Routes (mounted at /recordings):
 *
 *  GET    /                        – list sessions        (auth required)
 *  POST   /start                   – start a new session  (auth required)
 *  GET    /:sessionCode            – get session details  (auth required)
 *  POST   /:sessionCode/chunk      – upload a video chunk (auth required, raw binary body)
 *  POST   /:sessionCode/stop       – stop and process     (auth required)
 *  POST   /:sessionCode/capture    – save a camera still  (auth required, JSON body)
 *  GET    /:sessionCode/captures   – list captures        (auth required)
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../config/types/auth';
import { asyncHandler } from '../../utils/async-handler';
import { getRequestUser } from '../../utils/request-user';
import {
    startSession,
    appendChunk,
    stopSession,
    saveCaptureImage,
    listSessions,
    getSessionByCode,
    listCaptures,
} from '../services/recording';

// ── GET /recordings ───────────────────────────────────────────────────────────

export const listRecordingSessionsController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { page, perPage, searchedValue } = req.query;

        const result = await listSessions(user, {
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
            searchedValue: searchedValue as string | undefined,
        });

        res.status(200).json(result);
    }
);

// ── POST /recordings/start ────────────────────────────────────────────────────

export const startRecordingController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { patientId, remark, mimeType, captureDate, entryDate } = req.body;

        const result = await startSession(user, {
            patientId: patientId ? Number(patientId) : undefined,
            remark,
            mimeType,
            captureDate,
            entryDate,
        });

        res.status(201).json(result);
    }
);

// ── GET /recordings/:sessionCode ──────────────────────────────────────────────

export const getRecordingSessionController = asyncHandler(
    async (req, res: Response) => {
        const id = Number(req.params.id);
        const result = await getSessionByCode(id);
        res.status(200).json(result);
    }
);

// ── POST /recordings/:sessionCode/chunk ───────────────────────────────────────
// Body is raw binary (express.raw middleware applied in the router).

export const uploadChunkController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const sessionCode = req.params['sessionCode'] as string;
        const chunkIndex = Number(req.query['index'] ?? 0);
        const mimeType = req.headers['content-type'] as string | undefined;

        const buffer = req.body as Buffer;
        const result = await appendChunk(sessionCode, chunkIndex, buffer, mimeType);

        res.status(200).json({
            success: true,
            message: 'Chunk uploaded successfully',
            data: result,
        });
    }
);

// ── POST /recordings/:sessionCode/stop ────────────────────────────────────────

export const stopRecordingController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const sessionCode = req.params['sessionCode'] as string;
        const { durationSeconds } = req.body as { durationSeconds?: number };

        const result = await stopSession(
            sessionCode,
            user,
            durationSeconds ? Number(durationSeconds) : undefined
        );

        res.status(200).json(result);
    }
);

// ── POST /recordings/:sessionCode/capture ─────────────────────────────────────

export const captureImageController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const sessionCode = req.params['sessionCode'] as string;
        const { imageData } = req.body as { imageData?: string };

        if (!imageData || typeof imageData !== 'string') {
            res.status(400).json({ success: false, message: 'imageData (base64) is required' });
            return;
        }

        const result = await saveCaptureImage(sessionCode, imageData, user);
        res.status(201).json(result);
    }
);

// ── GET /recordings/:sessionCode/captures ─────────────────────────────────────

export const listCapturesController = asyncHandler(
    async (req, res: Response) => {
        const sessionCode = req.params['sessionCode'] as string;
        const result = await listCaptures(sessionCode);
        res.status(200).json(result);
    }
);
