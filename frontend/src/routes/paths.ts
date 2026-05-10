// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  permissionNotFound: '/permission-not-found',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      adminSignIn: `${ROOTS.AUTH}/jwt/admin-sign-in`,
      verifyOtp: `${ROOTS.AUTH}/jwt/verify-otp`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
      updatePassword: `${ROOTS.AUTH}/jwt/update-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    permission: `${ROOTS.DASHBOARD}/permission`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    organization: {
      root: `${ROOTS.DASHBOARD}/organization`,
      new: `${ROOTS.DASHBOARD}/organization/new`,
      list: `${ROOTS.DASHBOARD}/organization/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/organization/${id}/edit`,
    },
    organizationBranch: {
      root: `${ROOTS.DASHBOARD}/organizationBranch`,
      new: `${ROOTS.DASHBOARD}/organizationBranch/new`,
      list: `${ROOTS.DASHBOARD}/organizationBranch/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/organizationBranch/${id}/edit`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    configurationModule: {
      root: `${ROOTS.DASHBOARD}/configurationModule`,
      new: `${ROOTS.DASHBOARD}/configurationModule/new`,
    },
    // My Personal Hub
    mypersonalHub: {
      root: `${ROOTS.DASHBOARD}/personal-hub`,
      myprofile: `${ROOTS.DASHBOARD}/personal-hub/profile/new`,
      accountsetting: `${ROOTS.DASHBOARD}/personal-hub/account-setting/new`,
      passwordsecurity: `${ROOTS.DASHBOARD}/personal-hub/password-security/new`,
    },
    patientRegistration: {
      root: `${ROOTS.DASHBOARD}/patientRegistration`,
      new: `${ROOTS.DASHBOARD}/patientRegistration/new`,
      list: `${ROOTS.DASHBOARD}/patientRegistration/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/patientRegistration/${id}/edit`,
    },
    cameraCapture: {
      root: `${ROOTS.DASHBOARD}/cameraCapture`,
      new: `${ROOTS.DASHBOARD}/cameraCapture/new`,
      list: `${ROOTS.DASHBOARD}/cameraCapture/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/cameraCapture/${id}/edit`,
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      new: `${ROOTS.DASHBOARD}/report/new`,
      list: `${ROOTS.DASHBOARD}/report/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/report/${id}/edit`,
    },
  },
};
