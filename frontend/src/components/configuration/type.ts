export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'select'
  | 'date'
  | 'textarea'
  | 'image';

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IConfigurationMeta {
  isMulti?: boolean;
  options?: ISelectOption[];
  fieldName?: string;
  description?: string;
}

export interface IConfigurationModule {
  id: number;
  module: string;
  subModule: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: FieldType;
  value: any;
  defaultValue: any;
  meta: IConfigurationMeta | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
  createdByAdmin: number | null;
  updatedByAdmin: number | null;
  resourceInfo: string | null;
}
