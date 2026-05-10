// 1. Hospital core info
export interface IHospitalInfo {
  licenseid: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  rohiniid: string;
  gst: string;
  Jurisdiction: string;
  city: string;
  state: string;
}

// 2. Style configuration for hospital branding/etc
export interface IHospitalStyle {
  logoWidth: number;
  logoHeight: number;
  fontSizeHospital: number;
  fontWeightHospital: string;
  fontSizeReport: number;
  fontWeightReport: string;
  fontSizeContact: number;
  fontSizeMeta: number;
  fontSizeMetaBold: number;
  fontWeightMetaBold: string;
  primaryColor: string;
  borderStyle: string;
}

// 3. Complete JSON structure
export interface IHospitalInfoFile {
  hospital: IHospitalInfo;
  style: IHospitalStyle;
}
