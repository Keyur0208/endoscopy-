import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  site: {
    name: string;
    serverUrl: string;
    serverPort: string;
    viteExe: boolean;
    assetURL: string;
    basePath: string;
    version: string;
  };
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
  sessionStorage: { useSessionStorage: boolean };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  site: {
    name: 'Nilkanth Medico Software',
    serverUrl: import.meta.env.VITE_API ?? '',
    serverPort: import.meta.env.VITE_API_PORT ?? '1111',
    viteExe: import.meta.env.VITE_EXE === 'true',
    assetURL: import.meta.env.VITE_ASSET_URL ?? '',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,
  },
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },

  /**
   * Session Storage
   */
  sessionStorage: {
    useSessionStorage: import.meta.env.VITE_USE_SESSION_STORAGE === 'true',
  },
};
