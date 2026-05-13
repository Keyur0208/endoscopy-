import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <Iconify icon={name} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  // user: icon('ic-user'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),

  userprofile: icon('mdi:account-circle-outline'),
  parameter: icon('mdi:format-list-bulleted-type'),
  reportTemplate: icon('mdi:clipboard-text-outline'),
  reportType: icon('mdi:file-chart-outline'),
  user: icon('hugeicons:user-group'),
  PatientRegistration: icon('medical-icon:administration'),
  ConfigurationModule: icon('hugeicons:configuration-01'),
  cameraCapture: icon('mdi:video-wireless-outline'),
  reportIcon: icon('mdi:file-chart-outline'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Organization',
        path: paths.dashboard.organization.root,
        icon: ICONS.user,
        children: [
          {
            title: 'list',
            path: paths.dashboard.organization.list,
          },
          {
            title: 'create',
            path: paths.dashboard.organization.new,
          },
        ],
      },
      {
        title: 'Branch',
        path: paths.dashboard.organizationBranch.root,
        icon: ICONS.user,
        children: [
          {
            title: 'list',
            path: paths.dashboard.organizationBranch.list,
          },
          {
            title: 'create',
            path: paths.dashboard.organizationBranch.new,
          },
        ],
      },
    ],
  },
  /**
   * Setup & Configuration
   */
  {
    subheader: 'Setup & Configuration',
    items: [
      {
        title: 'Configuration Module',
        path: paths.dashboard.configurationModule.new,
        icon: ICONS.ConfigurationModule,
      },
      {
        title: 'User',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          {
            title: 'list',
            path: paths.dashboard.user.list,
          },
          {
            title: 'create',
            path: paths.dashboard.user.new,
          },
        ],
      },
    ],
  },
  // User Profiles
  {
    subheader: 'Personal Hub',
    // moduleKey: modules.personal_hub.key,
    items: [
      {
        title: 'Profile',
        path: paths.dashboard.mypersonalHub.root,
        icon: ICONS.userprofile,
        // moduleKey: subModules.PROFILE,
        children: [
          {
            title: 'My Profile',
            path: paths.dashboard.mypersonalHub.myprofile,
          },
          {
            title: 'Account Settings',
            path: paths.dashboard.mypersonalHub.accountsetting,
          },
          {
            title: 'Password & Security',
            path: paths.dashboard.mypersonalHub.passwordsecurity,
          },
        ],
      },
    ],
  },
  /**
   * Master
   */
  {
    subheader: 'Master',
    items: [
      {
        title: 'Parameter Master',
        path: paths.dashboard.parameterMaster.new,
        icon: ICONS.parameter,
      },
      {
        title: 'Report Type Master',
        path: paths.dashboard.reportType.new,
        icon: ICONS.reportType,
      },
      {
        title: 'Report Template',
        path: paths.dashboard.reportTemplate?.root,
        icon: ICONS.reportTemplate,
        children: [
          {
            title: 'list',
            path: paths.dashboard.reportTemplate?.list,
          },
          {
            title: 'create',
            path: paths.dashboard.reportTemplate?.new,
          },
        ],
      },
    ],
  },
  {
    subheader: 'Opd',
    items: [
      // Patient Registration
      {
        title: 'Patient Registration',
        icon: ICONS.PatientRegistration,

        path: paths.dashboard.patientRegistration.root,
        children: [
          {
            title: 'list',
            path: paths.dashboard.patientRegistration.list,
          },
          {
            title: 'create',
            path: paths.dashboard.patientRegistration.new,
          },
        ],
      },
      // Camera Capture
      {
        title: 'Camera Capture',
        icon: ICONS.cameraCapture,
        path: paths.dashboard.cameraCapture.root,
        children: [
          {
            title: 'list',
            path: paths.dashboard.cameraCapture.list,
          },
          {
            title: 'create',
            path: paths.dashboard.cameraCapture.new,
          },
        ],
      },
      // Report
      {
        title: 'Report',
        icon: ICONS.reportIcon,
        path: paths.dashboard.report.root,
        children: [
          {
            title: 'list',
            path: paths.dashboard.report.list,
          },
          {
            title: 'create',
            path: paths.dashboard.report.new,
          },
        ],
      },
    ],
  },
];
