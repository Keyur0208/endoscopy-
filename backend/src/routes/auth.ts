import { Router } from 'express';
import {
  adminloginController,
  loginController,
  sendForgotPasswordOtpController,
  verifyAdminOtpController,
  verifyForgotPasswordOtpController,
} from '../app/controllers/auth';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/admin/login', adminloginController);
authRouter.post('/admin/verify-otp', verifyAdminOtpController);
authRouter.post('/forgot-password/send-otp', sendForgotPasswordOtpController);
authRouter.post('/forgot-password/verify-otp', verifyForgotPasswordOtpController);

export default authRouter;
