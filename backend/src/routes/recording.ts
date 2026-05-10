import { Router } from 'express';
import express from 'express';
import { authenticate } from '../middlewares/auth';
import {
  listRecordingSessionsController,
  startRecordingController,
  getRecordingSessionController,
  uploadChunkController,
  stopRecordingController,
  captureImageController,
  listCapturesController,
} from '../app/controllers/recording';

const recordingRouter = Router();

recordingRouter.use(authenticate);

recordingRouter.get('/', listRecordingSessionsController);
recordingRouter.get('/:id', getRecordingSessionController);
recordingRouter.post('/start', startRecordingController);
recordingRouter.post(
  '/:sessionCode/chunk',
  express.raw({ type: ['video/*', 'application/octet-stream'], limit: '50mb' }),
  uploadChunkController
);

recordingRouter.post('/:sessionCode/stop', stopRecordingController);
recordingRouter.post('/:sessionCode/capture', captureImageController);
recordingRouter.get('/:sessionCode/captures', listCapturesController);

export default recordingRouter;
