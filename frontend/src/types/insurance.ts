export type IPatientInsuranceCompanyItem = {
  id: number;
  paymentType: string;
  isActive: boolean;
  companyName: string;
  companyShortName: string;
  tpaName: string;
  address: string;
  city: string;
  phoneNumber: string;
  cashlessFormLink: string;
  takeRateOfCompany?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ICreatePatientInsuranceCompany = {
  paymentType: string;
  isActive: boolean;
  companyName: string;
  companyShortName: string;
  tpaName: string;
  address: string;
  city: string;
  phoneNumber: string;
  cashlessFormLink: string;
  takeRateOfCompany?: number | null;
};

export type IUpdatePatientInsuranceCompany = {
  id: number;
  paymentType?: string;
  isActive?: boolean;
  companyName?: string;
  companyShortName?: string;
  tpaName?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  cashlessFormLink?: string;
  takeRateOfCompany?: number | null;
};

export type IInsuranceChargesSetup = {
  module: string;
  groupId: number | null;
  fromCompanyId: number | null;
  toCompanyId: number | null;
  applyMode: string;
};
