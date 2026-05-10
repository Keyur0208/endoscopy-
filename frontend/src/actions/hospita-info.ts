import type { IUserProfile } from 'src/types/user';
import type { IHospitalInfoFile } from 'src/types/hospital-info';
// ----------------------------------------------------------------------

// Global configuration storage
let hospitalReportConfiguration: IHospitalInfoFile = {
  hospital: {
    licenseid: 'NIL-GJ-RAJ-0001',
    name: 'The Nilkanth Medico Limited',
    logo: '/assets/hms_logo/nilkanth-logo.png',
    address:
      '2st Floor, A, Millenium Point, Lal Darwaja Station Rd, opp. Gabani Kidney Hospital, Lal Darwaja, Surat,Gujarat 395003',
    phone: '+91 78780 72895',
    mobile: '+91 78780 72895',
    email: 'nilkanthmedico@gmail.com',
    website: 'https://nilkanthmedico.com',
    rohiniid: '',
    gst: '',
    Jurisdiction: 'Surat',
    city: 'Surat ',
    state: 'Gujarat',
  },
  style: {
    logoWidth: 150,
    logoHeight: 80,
    // logoWidth: 280,
    // logoHeight: 70,
    fontSizeHospital: 14,
    fontWeightHospital: 'bold',
    fontSizeReport: 12,
    fontWeightReport: 'bold',
    fontSizeContact: 8,
    fontSizeMeta: 6,
    fontSizeMetaBold: 8,
    fontWeightMetaBold: 'bold',
    primaryColor: '#000000',
    borderStyle: 'box',
  },
};

/**
 * Generate hospital configuration from user's current branch data
 */
export function generateHospitalConfig(user: IUserProfile | null): IHospitalInfoFile {
  if (!user?.currentbranch) {
    return hospitalReportConfiguration;
  }

  const branch = user.currentbranch;

  return {
    hospital: {
      licenseid: branch.code || 'N/A',
      name: branch.legalName || branch.name || 'Hospital',
      logo: branch.logoImage || '',
      address: branch.address || '',
      phone: branch.phoneNumber || '',
      mobile: branch.mobile || '',
      email: branch.email || '',
      website: branch.website || '',
      rohiniid: branch.rohiniId || '',
      gst: branch.gstNo || '',
      Jurisdiction: branch.jurisdiction || '',
      city: branch.city || '',
      state: branch.state || '',
    },
    style: {
      // logoWidth: 180,
      // logoHeight: 60,
      logoWidth: 280,
      logoHeight: 70,
      fontSizeHospital: 14,
      fontWeightHospital: 'bold',
      fontSizeReport: 12,
      fontWeightReport: 'bold',
      fontSizeContact: 9,
      fontSizeMeta: 8,
      fontSizeMetaBold: 8,
      fontWeightMetaBold: 'bold',
      primaryColor: '#000000',
      borderStyle: 'box',
    },
  };
}

/**
 * Set the global hospital report configuration
 */
export function setHospitalReportConfiguration(user: IUserProfile | null) {
  hospitalReportConfiguration = generateHospitalConfig(user);
}

/**
 * Get the current hospital report configuration
 */
export function getHospitalReportConfiguration(): IHospitalInfoFile {
  return hospitalReportConfiguration;
}

export { hospitalReportConfiguration };
