export type IOPDPatientCategoryItem = {
  id: number;
  categoryShortName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  description: string;
};

export type ICreateOPDPatientCategory = {
  categoryShortName: string;
  description: string;
  isActive: boolean;
};

export type IUpdateOPDPatientCategory = {
  id: number;
  categoryShortName?: string;
  description?: string;
  isActive?: boolean;
};
