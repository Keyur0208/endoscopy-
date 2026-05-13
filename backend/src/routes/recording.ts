import { Router } from 'express';
import express from 'express';
import { authenticate } from '../middlewares/auth';
import multer from 'multer';
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
const upload = multer({
  storage: multer.memoryStorage(),
});

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
recordingRouter.post('/:sessionCode/capture', upload.single('image'), captureImageController);
recordingRouter.get('/:sessionCode/captures', listCapturesController);

export default recordingRouter;
