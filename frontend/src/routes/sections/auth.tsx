import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  AdminSignInPage: lazy(() => import('src/pages/auth/jwt/admin-sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth/jwt/verify')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/jwt/update-password')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/jwt/reset-password')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'admin-sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.AdminSignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'verify-otp',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.VerifyPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'update-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.UpdatePasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.ResetPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
