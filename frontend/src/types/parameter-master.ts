export interface IParameterMasterRecord {
  id: number;
  name: string;
  inputType: string | null;
  defaultValue: string | null;
  isHeading: boolean;
  isActive: boolean;
  resourceInfo: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  branchId: number | null;
  organizationId: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateParameterMaster {
  name: string;
  inputType?: string | null;
  defaultValue?: string | null;
  isActive: boolean;
  isHeading?: boolean;
}

export interface IUpdateParameterMaster {
  id?: number;
  name?: string;
  inputType?: string | null;
  defaultValue?: string | null;
  isActive: boolean;
  isHeading?: boolean;
}
