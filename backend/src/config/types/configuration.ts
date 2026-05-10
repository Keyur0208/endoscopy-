export type ConfigFieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'json'
    | 'select'
    | 'date'
    | 'textarea'
    | 'color'
    | 'image';

export interface ICreateConfiguration {
    module: string;
    subModule: string;
    fieldKey: string;
    fieldLabel: string;
    fieldType: ConfigFieldType;
    value?: any;
    defaultValue?: any;
    meta?: any;
    isActive?: boolean;
    priority?: number;
    branchId?: number | null;
    organizationId?: number | null;
    resourceInfo?: string | null;
    createdBy?: number | null;
    updatedBy?: number | null;
    createdByAdmin?: number | null;
    updatedByAdmin?: number | null;
}

export interface IUpdateConfiguration {
    module?: string;
    subModule?: string;
    fieldKey?: string;
    fieldLabel?: string;
    fieldType?: ConfigFieldType;
    value?: any;
    defaultValue?: any;
    meta?: any;
    isActive?: boolean;
    priority?: number;
    branchId?: number | null;
    organizationId?: number | null;
    resourceInfo?: string | null;
    updatedBy?: number | null;
    updatedByAdmin?: number | null;
}

export interface IBulkUpdateConfigItem {
    id?: number;
    module: string;
    subModule: string;
    fieldKey: string;
    fieldLabel?: string;
    fieldType?: ConfigFieldType;
    value?: any;
    defaultValue?: any;
    meta?: any;
    isActive?: boolean;
    priority?: number;
    branchId?: number | null;
    organizationId?: number | null;
}
