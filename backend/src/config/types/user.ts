export interface ICreateUser {
  fullName: string;
  email: string;
  mobile?: string;
  password: string;
  isActive?: boolean;
  isOrganizationAdmin?: boolean;
  isOtpRequired?: boolean;
  canSwitchBranch?: boolean;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}

export interface IUpdateUser {
  fullName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  isActive?: boolean;
  isOrganizationAdmin?: boolean;
  isOtpRequired?: boolean;
  canSwitchBranch?: boolean;
  organizationId?: number | null;
  branchId?: number | null;
  resourceInfo?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdByAdmin?: number | null;
  updatedByAdmin?: number | null;
}