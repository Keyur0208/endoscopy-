export const MODULE_KEYS = {
  SET_UP_CONFIGURATION: "set_up_configuration",
  CAMERA_CAPTURE: "camera_capture",
} as const;

export const SUBMODULE_KEYS = {
  HOMS_CONNECTIONS: "homs_connections",
  CAMERA_CAPTURE: "camera_capture",
} as const;

export const HOMS_CONNECTION_KEYS = {
  HOMS_CONNECTIONS_ENABLED: "homs_connections_enabled",
  HOMS_KEY: "homs_key",
  HOMS_IP: "homs_ip",
  HOMS_PORT: "homs_port",
} as const;

export const CAMERA_CAPTURE_KEYS = {
  CAMERA_CAPTURE_ENABLED: "camera_capture_enabled",
  CAMERA_CAPTURE_FOLDER_PATH: "camera_capture_folder_path",
  CAMERA_CAPTURE_BACKUP_FOLDER_PATH: "camera_capture_backup_folder_path",
} as const;

export const FIELD_TYPES = {
  BOOLEAN: "boolean",
  STRING: "string",
  NUMBER: "number",
  SELECT: "select",
  DATE: "date",
  TEXTAREA: "textarea",
  COLOR: "color",
  IMAGE: "image",
  JSON: "json",
} as const;

export const VERSION_KEYS = {
  VERSION_1: "v1",
  VERSION_2: "v2",
  VERSION_3: "v3",
  VERSION_4: "v4",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
export type VERSION_KEYS = (typeof VERSION_KEYS)[keyof typeof VERSION_KEYS];

export const DEFAULT_CONFIGURATIONS = [
  // ==================== 1. Master Setup ====================

  // HOMS Connections Module is enabled or not
  {
    module: MODULE_KEYS.SET_UP_CONFIGURATION,
    subModule: SUBMODULE_KEYS.HOMS_CONNECTIONS,
    fieldKey: HOMS_CONNECTION_KEYS.HOMS_CONNECTIONS_ENABLED,
    fieldLabel: "HOMS Connections Enabled",
    fieldType: FIELD_TYPES.BOOLEAN,
    value: "true",
    defaultValue: "true",
    meta: {
      fieldName: "homsConnections",
      description: "Whether HOMS connections are enabled or not",
    },
    isActive: true,
    priority: 1,
  },
  // HOMS Connections Module HOM Key
  {
    module: MODULE_KEYS.SET_UP_CONFIGURATION,
    subModule: SUBMODULE_KEYS.HOMS_CONNECTIONS,
    fieldKey: HOMS_CONNECTION_KEYS.HOMS_KEY,
    fieldLabel: "HOMS Key",
    fieldType: FIELD_TYPES.STRING,
    value: "",
    defaultValue: "",
    meta: {
      fieldName: "homsKey",
      description: "HOMS Key for connections",
    },
    isActive: true,
    priority: 1,
  },
  // HOMS Connections Module HOM IP
  {
    module: MODULE_KEYS.SET_UP_CONFIGURATION,
    subModule: SUBMODULE_KEYS.HOMS_CONNECTIONS,
    fieldKey: HOMS_CONNECTION_KEYS.HOMS_IP,
    fieldLabel: "HOMS IP",
    fieldType: FIELD_TYPES.STRING,
    value: "",
    defaultValue: "",
    meta: {
      fieldName: "homsIp",
      description: "HOMS IP for connections",
    },
    isActive: true,
    priority: 1,
  },
  // HOMS Connections Module HOM Port
  {
    module: MODULE_KEYS.SET_UP_CONFIGURATION,
    subModule: SUBMODULE_KEYS.HOMS_CONNECTIONS,
    fieldKey: HOMS_CONNECTION_KEYS.HOMS_PORT,
    fieldLabel: "HOMS Port",
    fieldType: FIELD_TYPES.STRING,
    value: "",
    defaultValue: "",
    meta: {
      fieldName: "homsPort",
      description: "HOMS Port for connections",
    },
    isActive: true,
    priority: 1,
  },
  // Camera Capture Module is enabled or not
  {
    module: MODULE_KEYS.CAMERA_CAPTURE,
    subModule: SUBMODULE_KEYS.CAMERA_CAPTURE,
    fieldKey: CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_ENABLED,
    fieldLabel: "Camera Capture Enabled",
    fieldType: FIELD_TYPES.BOOLEAN,
    value: "false",
    defaultValue: "false",
    meta: {
      fieldName: "cameraCaptureEnabled",
      description: "Whether Camera Capture is enabled or not",
    },
    isActive: true,
    priority: 1,
  },
  // Camera Capture Module folder path
  {
    module: MODULE_KEYS.CAMERA_CAPTURE,
    subModule: SUBMODULE_KEYS.CAMERA_CAPTURE,
    fieldKey: CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_FOLDER_PATH,
    fieldLabel: "Camera Capture Folder Path",
    fieldType: FIELD_TYPES.STRING,
    value: "",
    defaultValue: "",
    meta: {
      fieldName: "cameraCaptureFolderPath",
      description: "Folder path where camera captures will be stored",
    },
    isActive: true,
    priority: 1,
  },
  // Camera Capture Module backup folder path
  {
    module: MODULE_KEYS.CAMERA_CAPTURE,
    subModule: SUBMODULE_KEYS.CAMERA_CAPTURE,
    fieldKey: CAMERA_CAPTURE_KEYS.CAMERA_CAPTURE_BACKUP_FOLDER_PATH,
    fieldLabel: "Camera Capture Backup Folder Path",
    fieldType: FIELD_TYPES.STRING,
    value: "",
    defaultValue: "",
    meta: {
      fieldName: "cameraCaptureBackupFolderPath",
      description: "Folder path where camera capture backups will be stored",
    },
    isActive: true,
    priority: 1,
  },
];