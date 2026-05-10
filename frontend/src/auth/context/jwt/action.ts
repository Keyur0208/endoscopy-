import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
  resourceInfo?: {
    pcName: string;
    username: string;
    ipAddress: string;
    macAddress: string;
  };
};

export type SignUpParams = {
  email: string;
  password: string;
  resourceInfo?: {
    pcName: string;
    username: string;
    ipAddress: string;
    macAddress: string;
  };
};

export type verifyOtpParams = {
  mobile: string;
  otp: string;
};

type SignResponse = { token: string } | { otpRequired: true; mobile: string; message: string };

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
  resourceInfo,
}: SignInParams): Promise<SignResponse> => {
  try {
    const params: Record<string, any> = { email, password };

    if (
      resourceInfo &&
      Object.values(resourceInfo).some((v) => typeof v === 'string' && v.trim() !== '')
    ) {
      params.resourceInfo = resourceInfo;
    }

    const res = await axios.post(endpoints.auth.signIn, params);
    const { data } = res;

    if ('token' in data) {
      await setSession(data.token);
    }

    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign in Admin
 *************************************** */

export const signInAdmin = async ({
  email,
  password,
  resourceInfo,
}: SignInParams): Promise<SignResponse> => {
  try {
    const params: Record<string, any> = { email, password };

    if (
      resourceInfo &&
      Object.values(resourceInfo).some((v) => typeof v === 'string' && v.trim() !== '')
    ) {
      params.resourceInfo = resourceInfo;
    }

    const res = await axios.post(endpoints.auth.signInAdmin, params);
    const { data } = res;

    if ('token' in data) {
      await setSession(data.token);
    }

    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * OTP Verfication Admin & User
 *************************************** */

export const verifyOtp = async ({ mobile, otp }: verifyOtpParams) => {
  try {
    const params: Record<string, any> = { mobile, otp };

    const res = await axios.post(endpoints.auth.verifyOtp, params);
    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    await setSession(token);
    return res;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Forgot Password - Send OTP
 *************************************** */

export const forgotPasswordSendOtp = async ({ email }: { email: string }) => {
  try {
    const params: Record<string, any> = { email };
    const res = await axios.post(endpoints.auth.forgotPassword, params);
    return res;
  } catch (error) {
    console.error('Error during forgot password send OTP:', error);
    throw error;
  }
};

/** **************************************
 * Forgot Password Verify OTP
 *************************************** */

export const forgotPasswordVerifyOtp = async ({
  mobile,
  otp,
  newPassword,
}: {
  mobile: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const params: Record<string, any> = { mobile, otp, newPassword };
    const res = await axios.post(endpoints.auth.forgotPasswordVerifyOtp, params);
    return res;
  } catch (error) {
    console.error('Error during forgot password verify OTP:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
// export const signUp = async ({
//   email,
//   password,
//   // firstName,
//   // lastName,
// }: SignUpParams): Promise<void> => {
//   const params = {
//     email,
//     password,
//     // firstName,
//     // lastName,
//   };

//   try {
//     const res = await axios.post(endpoints.auth.signUp, params);

//     const { accessToken } = res.data;

//     if (!accessToken) {
//       throw new Error('Access token not found in response');
//     }

//     sessionStorage.setItem(STORAGE_KEY, accessToken);
//   } catch (error) {
//     console.error('Error during sign up:', error);
//     throw error;
//   }
// };

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
