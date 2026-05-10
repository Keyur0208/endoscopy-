import 'src/global.css';

// ----------------------------------------------------------------------

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';

import { TimezoneProvider } from './components/time-zone';
import { AbilityProvider } from './context/ability-provider';
import { useFieldNavigation } from './hooks/useFieldNavigation';
import { OtpProvider } from './components/permissons/otp-context';

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export default function App() {
  useScrollToTop();
  useFieldNavigation();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <AuthProvider>
          <TimezoneProvider>
            <AbilityProvider>
              <OtpProvider>
                <SettingsProvider settings={defaultSettings}>
                  <ThemeProvider>
                    <MotionLazy>
                      <Snackbar />
                      <ProgressBar />
                      <SettingsDrawer />
                      <Router />
                    </MotionLazy>
                  </ThemeProvider>
                </SettingsProvider>
              </OtpProvider>
            </AbilityProvider>
          </TimezoneProvider>
        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
