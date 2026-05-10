import type { ReactElement } from 'react';

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import {
  Box,
  Grid,
  List,
  Paper,
  Dialog,
  useTheme,
  ListItem,
  keyframes,
  Typography,
  DialogTitle,
  ListItemText,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

// import {
//   useSendConfigurationPermissionOtp,
//   useVerifyConfigurationPermissionOtp,
// } from 'src/actions/user-permissions';

import { Iconify } from 'src/components/iconify';
import CommonButton from 'src/components/common-button';
import OtpModal from 'src/components/permissons/OtpModal';
import { usePermission } from 'src/components/permissons/usePermission';
import { defaultSettings, useSettingsContext } from 'src/components/settings';

// import { useAuthContext } from '../hooks';

export type OtpBasedGuardProps = {
  element: ReactElement;
  permissionKey: string;
  requiredPermissions?: string | string[];
};

// Read OTP contacts from environment variables
const mobiles = import.meta.env.VITE_OTP_CONTACT_MOBILES?.split(',') || [];
const emails = import.meta.env.VITE_OTP_CONTACT_EMAILS?.split(',') || [];
const developmentMode = import.meta.env.VITE_MODE === 'development';

const maxLen = Math.max(mobiles.length, emails.length);
const OTP_CONTACTS = Array.from({ length: maxLen }).map((_, i) => ({
  mobile: mobiles[i] || '',
  email: emails[i] || '',
}));

export function OtpBasedGuard({ element, permissionKey, requiredPermissions }: OtpBasedGuardProps) {
  const [message, setMessage] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  // const { trigger: sendOtp } = useSendConfigurationPermissionOtp();
  // const { trigger: verifyOtp } = useVerifyConfigurationPermissionOtp();
  // const { user } = useAuthContext();
  const settings = useSettingsContext();
  const { hasPermission } = usePermission();

  // Check localStorage for OTP flag on mount
  const [otpSystemEnabled, setOtpSystemEnabled] = useState(() => {
    const val = settings.configurationsOtpBased ?? defaultSettings.configurationsOtpBased;
    return val === true;
  });

  // On mount, if not verified, open dialog
  useEffect(() => {
    if (!otpSystemEnabled) {
      setConfirmModalOpen(true);
    }
  }, [otpSystemEnabled, permissionKey]);

  const pulseAnimation = keyframes`
    0% { background-color: rgba(255, 77, 77, 1); }   /* red */
    50% { background-color: rgba(76, 175, 80, 1); } /* green */
    100% { background-color: rgba(255, 77, 77, 1); } /* red */
  `;

  const handleRequestOtp = async (channel: 'whatsapp' | 'sms' | 'email' = 'sms') => {
    setConfirmModalOpen(false);
    setIsLoading(true);
    setError('');
    setMessage('Sending OTP... Please wait.');
    // try {
    //   const res = await sendOtp({
    //     hospitalName: user?.branch?.name || '',
    //     permissionName: permissionKey,
    //     permissionOtpContacts: OTP_CONTACTS,
    //   });
    //   setMessage(res?.data?.smsMessage);
    //   setOtpModalOpen(true);
    // } catch (err) {
    //   setError('Failed to send OTP. Please try again.');
    //   console.error('OTP send error:', err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // On OTP verify, set localStorage and state
  const handleVerifyOtp = async (otpValue: string, channel: 'whatsapp' | 'sms' | 'email') => {
    setIsLoading(true);
    setError('');
    // try {
    //   await verifyOtp({
    //     mobile: user?.mobile || '',
    //     otp: otpValue,
    //     permissionName: permissionKey,
    //     permissionOtpContacts: OTP_CONTACTS,
    //   });
    //   settings.onUpdateField('configurationsOtpBased', true);
    //   setOtpModalOpen(false);
    setOtpSystemEnabled(true);
    // } catch (err) {
    //   setError('Invalid OTP. Please try again.');
    //   console.error('OTP verification error:', err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const allowed = requiredPermissions
    ? Array.isArray(requiredPermissions)
      ? requiredPermissions.some((p) => hasPermission(p))
      : hasPermission(requiredPermissions)
    : true;

  // If permission check fails, redirect to fallback path
  if (!allowed) {
    return <Navigate to={paths.permissionNotFound} replace />;
  }

  if (!developmentMode && !otpSystemEnabled && allowed) {
    return (
      <>
        <Dialog open={confirmModalOpen} maxWidth="md" fullWidth>
          {/* Sticky Header */}
          <DialogTitle
            sx={{
              position: 'sticky',
              zIndex: 10000,
              top: 0,
              backgroundColor: '#E5F0FF',
              borderBottom: '1px solid rgba(26, 59, 110, 0.1)',
              py: 1.5,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              Permission Required
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ py: 3, px: 2 }}>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                Adding && Editing Requires OTP verification.
              </Typography>

              <Grid container spacing={2}>
                {/* SMS */}
                <Grid item xs={12} md={4}>
                  {OTP_CONTACTS.length > 0 && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 1,
                      }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
                        <Iconify icon="mdi:message-text" width={32} sx={{ color: '#1976d2' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          SMS
                        </Typography>
                      </Box>
                      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
                        {OTP_CONTACTS.map((mobile, idx) => (
                          <ListItem key={`sms-${idx}`} disablePadding>
                            <ListItemText
                              primary={mobile.mobile}
                              primaryTypographyProps={{ align: 'center', fontSize: 14 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>

                {/* WhatsApp */}
                <Grid item xs={12} md={4}>
                  {OTP_CONTACTS.length > 0 && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 1,
                      }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
                        <Iconify icon="mdi:whatsapp" width={32} sx={{ color: '#25D366' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          WhatsApp
                        </Typography>
                      </Box>
                      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
                        {OTP_CONTACTS.map((mobile, idx) => (
                          <ListItem key={`wa-${idx}`} disablePadding>
                            <ListItemText
                              primary={mobile.mobile}
                              primaryTypographyProps={{ align: 'center', fontSize: 14 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={4}>
                  {OTP_CONTACTS.length > 0 && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 1,
                      }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
                        <Iconify icon="mdi:gmail" width={32} sx={{ color: '#EA4335' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Email
                        </Typography>
                      </Box>
                      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
                        {OTP_CONTACTS.map((email, idx) => (
                          <ListItem key={`email-${idx}`} disablePadding>
                            <ListItemText
                              primary={email.email}
                              primaryTypographyProps={{ align: 'center', fontSize: 14 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            py={1.5}
            px={3}
            bgcolor="#E5F0FF"
          >
            <CommonButton
              sx={{
                fontSize: '13px',
                height: '36px',
                backgroundColor: '#3C3D3F',
                '&:hover': { backgroundColor: '#2B2C2D' },
              }}
              onClick={() => setConfirmModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </CommonButton>
            <CommonButton
              onClick={() => handleRequestOtp('sms')}
              variant="contained"
              color="primary"
              sx={{
                fontSize: '15px',
                height: '36px',
                backgroundColor: 'rgba(63, 84, 115, 1)',
                animation: `${pulseAnimation} 2s ease-in-out infinite`,
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(63, 84, 115, 0.9)',
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </CommonButton>
          </Box>
        </Dialog>

        {/* Step 2: OTP Modal */}
        <OtpModal
          open={otpModalOpen}
          onClose={() => {
            if (!isLoading) {
              setOtpModalOpen(false);
              setError('');
            }
          }}
          onVerify={handleVerifyOtp}
          onResend={() => handleRequestOtp('sms')}
          isLoading={isLoading}
          error={error}
          message={message}
          channelStatus={{ sms: 'success', email: 'success', whatsapp: 'success' }}
        />
      </>
    );
  }
  return element;
}
