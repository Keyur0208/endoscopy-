import { defaultFont } from 'src/theme/core/typography';

import type { SettingsState } from './types';

// ----------------------------------------------------------------------

export const STORAGE_KEY = 'app-settings';

export const defaultSettings: SettingsState = {
  colorScheme: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'horizontal',
  primaryColor: 'default',
  navColor: 'apparent',
  compactLayout: false,
  configurationsOtpBased: false,
  fontFamily: defaultFont,
} as const;

export const patientDefaultSettings: SettingsState = {
  colorScheme: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: false,
  configurationsOtpBased: false,
  fontFamily: defaultFont,
} as const;
