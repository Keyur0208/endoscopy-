import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { OtpBasedGuard } from 'src/auth/guard/otp-based-guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// Organization
const OrganizationListPage = lazy(() => import('src/pages/dashboard/organization/list'));
const OrganizationCreatePage = lazy(() => import('src/pages/dashboard/organization/new'));
const OrganizationEditPage = lazy(() => import('src/pages/dashboard/organization/edit'));
// Branch
const OrganizationBranchListPage = lazy(
  () => import('src/pages/dashboard/organization-branch/list')
);
const OrganizationBranchCreatePage = lazy(
  () => import('src/pages/dashboard/organization-branch/new')
);
const OrganizationBranchEditPage = lazy(
  () => import('src/pages/dashboard/organization-branch/edit')
);
// user
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Personal Hub
const MyProfilePage = lazy(() => import('src/pages/dashboard/profile/my-profile'));
const AccountSettingPage = lazy(() => import('src/pages/dashboard/profile/account-setting'));
const PasswordSecurity = lazy(() => import('src/pages/dashboard/profile/password-security'));

// configurationModule
const ConfigurationModuleCreatePage = lazy(
  () => import('src/pages/dashboard/configuration-module/new')
);

// Patient Registration
const PatientRegistrationListPage = lazy(
  () => import('src/pages/dashboard/patient-registration/list')
);
const PatientRegistrationEditPage = lazy(
  () => import('src/pages/dashboard/patient-registration/edit')
);
const PatientRegistrationCreatePage = lazy(
  () => import('src/pages/dashboard/patient-registration/new')
);

// Camera Capture
const CameraCaptureListPage = lazy(() => import('src/pages/dashboard/camera-capture/list'));
const CameraCaptureEditPage = lazy(() => import('src/pages/dashboard/camera-capture/edit'));
const CameraCaptureCreatePage = lazy(() => import('src/pages/dashboard/camera-capture/new'));

// EndoScopy Report
const ReportListPage = lazy(() => import('src/pages/dashboard/endoscopy-report/list'));
const ReportEditPage = lazy(() => import('src/pages/dashboard/endoscopy-report/edit'));
const ReportCreatePage = lazy(() => import('src/pages/dashboard/endoscopy-report/new'));

// Parameter Master
const ParameterMasterCreatePage = lazy(() => import('src/pages/dashboard/parameter-master/new'));

// Report Template
const ReportTemplateListPage = lazy(() => import('src/pages/dashboard/report-template/list'));
const ReportTemplateEditPage = lazy(() => import('src/pages/dashboard/report-template/edit'));
const ReportTemplateCreatePage = lazy(() => import('src/pages/dashboard/report-template/new'));

// Report Type
const ReportTypeCreatePage = lazy(() => import('src/pages/dashboard/report-type/new'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'organization',
        children: [
          {
            path: 'list',
            element: (
              <OtpBasedGuard permissionKey="organization_list" element={<OrganizationListPage />} />
            ),
          },
          {
            path: 'new',
            element: (
              <OtpBasedGuard
                permissionKey="organization_create"
                element={<OrganizationCreatePage />}
              />
            ),
          },
          {
            path: ':id/edit',
            element: (
              <OtpBasedGuard permissionKey="organization_edit" element={<OrganizationEditPage />} />
            ),
          },
        ],
      },
      {
        path: 'organizationBranch',
        children: [
          {
            path: 'list',
            element: (
              <OtpBasedGuard permissionKey="branch_list" element={<OrganizationBranchListPage />} />
            ),
          },
          {
            path: 'new',
            element: (
              <OtpBasedGuard
                permissionKey="branch_create"
                element={<OrganizationBranchCreatePage />}
              />
            ),
          },
          {
            path: ':id/edit',
            element: (
              <OtpBasedGuard permissionKey="branch_edit" element={<OrganizationBranchEditPage />} />
            ),
          },
        ],
      },
      {
        path: 'configurationModule',
        children: [
          {
            path: 'new',
            element: (
              <OtpBasedGuard
                permissionKey="configuration_module"
                element={<ConfigurationModuleCreatePage />}
              />
            ),
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: 'list',
            element: <OtpBasedGuard permissionKey="user_list" element={<UserListPage />} />,
          },
          {
            path: 'new',
            element: <OtpBasedGuard permissionKey="user_create" element={<UserCreatePage />} />,
          },
          {
            path: ':id/edit',
            element: <OtpBasedGuard permissionKey="user_edit" element={<UserEditPage />} />,
          },
        ],
      },
      // My Personal Hub
      {
        path: 'personal-hub',
        children: [
          { path: 'profile/new', element: <MyProfilePage /> },
          { path: 'account-setting/new', element: <AccountSettingPage /> },
          { path: 'password-security/new', element: <PasswordSecurity /> },
        ],
      },
      // Patient Registration
      {
        path: 'patientRegistration',
        children: [
          {
            path: 'list',
            element: <PatientRegistrationListPage />,
          },
          {
            path: 'new',
            element: <PatientRegistrationCreatePage />,
          },
          {
            path: ':id/edit',
            element: <PatientRegistrationEditPage />,
          },
        ],
      },
      // camera Capture
      {
        path: 'cameraCapture',
        children: [
          {
            path: 'list',
            element: <CameraCaptureListPage />,
          },
          {
            path: 'new',
            element: <CameraCaptureCreatePage />,
          },
          {
            path: ':id/edit',
            element: <CameraCaptureEditPage />,
          },
        ],
      },
      // camera Capture
      {
        path: 'report',
        children: [
          {
            path: 'list',
            element: <ReportListPage />,
          },
          {
            path: 'new',
            element: <ReportCreatePage />,
          },
          {
            path: ':id/edit',
            element: <ReportEditPage />,
          },
        ],
      },
      // Parameter Master
      {
        path: 'parameterMaster',
        children: [
          {
            path: 'new',
            element: <ParameterMasterCreatePage />,
          },
        ],
      },
      // Report Template
      {
        path: 'reportTemplate',
        children: [
          {
            path: 'list',
            element: <ReportTemplateListPage />,
          },
          {
            path: 'new',
            element: <ReportTemplateCreatePage />,
          },
          {
            path: ':id/edit',
            element: <ReportTemplateEditPage />,
          },
        ],
      },
      // Report Type
      {
        path: 'reportType',
        children: [
          {
            path: 'new',
            element: <ReportTypeCreatePage />,
          },
        ],
      },
    ],
  },
];
