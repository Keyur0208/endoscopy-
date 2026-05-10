import { NextFunction, Request, Response } from 'express';
import { adminLogin, login, sendForgotPasswordOtp, verifyAdminOtp, verifyForgotPasswordOtp } from '../services/auth';
import { AppError } from '../../utils/app-error';
import { LoginInput } from '../../config/types/auth';
import { MESSAGES } from '../../utils/messages';
import { env } from '../../config/env';

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, resourceInfo } = req.body as LoginInput;

    if (!email || !password) {
      throw new AppError(400, MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const result = await login({ email, password, resourceInfo });

    res.status(200).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESSFUL,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const adminloginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, resourceInfo } = req.body as LoginInput;

    if (!email || !password) {
      throw new AppError(400, MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const abilities: string[] = resourceInfo
      ? Object.entries(resourceInfo).map(([, value]) => String(value))
      : [];

    const enableOtp = env.enableAdminOtp === 'true';

    const result = await adminLogin({ email, password, abilities, enableOtp });

    if (result.otpRequired) {
      res.status(202).json({
        success: true,
        message: result.message,
        mobile: result.mobile,
        otpRequired: true,
      });
      return;
    }

    const { token, user } = result;

    res.status(200).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESSFUL,
      token: token,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdminOtpController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile, otp } = req.body as { mobile: string; otp: string };

    if (!mobile || !otp) {
      throw new AppError(400, 'Mobile and OTP are required');
    }

    const result = await verifyAdminOtp({ mobile, otp });

    if (!result.success) {
      res.status(401).json({ success: false, message: result.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const sendForgotPasswordOtpController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const result = await sendForgotPasswordOtp({ email });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtpController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile, otp, newPassword } = req.body as { mobile: string; otp: string; newPassword: string };

    if (!mobile || !otp || !newPassword) {
      throw new AppError(400, 'Mobile, OTP, and new password are required');
    }

    const result = await verifyForgotPasswordOtp({ mobile, otp, newPassword });

    if (!result.success) {
      res.status(401).json({ success: false, message: result.message });
      return;
    }

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
