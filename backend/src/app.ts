import express from 'express';
import { errors as celebrateErrors } from 'celebrate';
import { initializeDatabase } from './config/database';
import branchRouter from './routes/branch';
import cors from "cors";
import configurationRouter from './routes/configuration';
import patientRouter from './routes/patient';
import recordingRouter from './routes/recording';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error';
import authRouter from './routes/auth';
import organizationRouter from './routes/organization';
import userRouter from './routes/user';
import helmet from 'helmet';
import patientReportRouter from './routes/patient-report';
import parameterMasterRouter from './routes/parameter-master';
import reportTemplateRouter from './routes/report';
import reportTypeRouter from './routes/report-type';
import * as storageService from './app/services/storage';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.all("*", function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization ,Accept"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());

// App -> route -> controller -> service -> model.
// Validation and auth middleware run before the controller where needed.
app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});


app.use(
  '/uploads',
  async (req, res, next) => {
    try {
      const recordingsPath =
        await storageService.getRecordingsPath();

      const filePath = path.join(
        recordingsPath,
        req.path
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.sendFile(filePath);

    } catch (error) {
      next(error);
    }
  }
);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/admin/organizations', organizationRouter);
app.use('/admin/branches', branchRouter);
app.use('/configurations', configurationRouter);
app.use('/patient-registrations', patientRouter);
app.use('/recordings', recordingRouter);
app.use('/patient-reports', patientReportRouter);
app.use('/report-types', reportTypeRouter);
app.use('/report-templates', reportTemplateRouter);
app.use('/parameter-masters', parameterMasterRouter);

app.use(celebrateErrors());
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};
void startServer();