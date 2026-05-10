import React, { useState } from 'react';

import {
  Box,
  Grid,
  Dialog,
  useTheme,
  keyframes,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { useAbility } from 'src/context/ability-provider';
// import {
//   //  sendPermissionOtp,
//   useSendPermissionOtp,
//   useVerifyPermissionOtp,
//   //  verifyPermissionOtp
// } from 'src/actions/user-permissions';

import CommonButton from 'src/components/common-button';
import { CheckPermission } from 'src/components/permissons/check-permission';

import OtpModal from './OtpModal';
import TooltipWrapper from './TooltipWrapper';
import { useOtpContext } from './otp-context';

type PermissionGuardProps = {
  children: React.ReactElement;
  fieldName: string;
  patientName?: string;
  treatingDoctorName?: string;
  billNo?: string;
  billAmount?: string | number;
  isDisabledMode?: 'edit' | 'create' | 'both';
  permissionKeys: {
    create?: string[];
    edit?: string[];
    both?: string[];
  };
  currentData?: any;
  mode?: 'disable' | 'hide';
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  onOtpVerify?: () => void;
  isDisableField?: boolean;
  resetOtpFlag?: boolean;
};

export default function PermissionGuard({
  children,
  fieldName,
  isDisabledMode = 'edit',
  permissionKeys,
  currentData,
  mode = 'disable',
  tooltipPlacement = 'bottom',
  onOtpVerify,
  isDisableField = false,
  resetOtpFlag = false,
  patientName = '-',
  treatingDoctorName = '-',
  billNo = '-',
  billAmount = '-',
}: PermissionGuardProps) {
  const theme = useTheme();
  // const { trigger: sendOtp } = useSendPermissionOtp();
  // const { trigger: verifyOtp } = useVerifyPermissionOtp();

  const ability = useAbility();
  // const { user } = useAuthContext();
  // const permissionOtpContacts =  [];

  const { verifiedPermissions, markVerified } = useOtpContext();

  // 🟢 Step 1: Determine mode (create / edit / both)

  // 1. Mode detection

  const isEdit = Boolean(currentData);
  const isCreate = !currentData;

  let isCheckingCreate = false;
  let isCheckingEdit = false;

  if (isDisabledMode === 'both') {
    isCheckingCreate = isCreate;
    isCheckingEdit = isEdit;
  } else if (isDisabledMode === 'edit') {
    isCheckingEdit = isEdit;
  } else if (isDisabledMode === 'create') {
    isCheckingCreate = isCreate;
  }

  // 🟢 Step 2: Collect relevant permissions

  const relevantKeys = [
    ...(permissionKeys.both ?? []),
    ...(isCheckingEdit ? (permissionKeys.edit ?? []) : []),
    ...(isCheckingCreate ? (permissionKeys.create ?? []) : []),
  ];

  const results = relevantKeys.map((key) => ({
    key,
    ...CheckPermission(ability, key),
  }));

  // 🟢 Step 3: Pick best permission (prefer without_otp if available)

  const result: any = results.find((r) => r.hasPermission && !r.requiresOtp) ??
    results.find((r) => r.hasPermission) ?? {
      hasPermission: false,
      requiresOtp: false,
    };

  // 🟢 Step 4: OTP flow state
  const [message, setMessage] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const permissionKey = result.key;

  // useEffect(() => {
  //   setOtpVerified(false);
  //   setConfirmModalOpen(false);
  //   setOtpModalOpen(false);

  //   if (permissionKey && (resetOtpFlag || currentData?.id)) {
  //     resetVerified(permissionKey);
  //   }
  // }, [currentData?.id, resetOtpFlag]);

  // 🟢 Step 5: Disable condition

  const isOtpContextVerified = permissionKey ? verifiedPermissions[permissionKey] : false;

  const shouldDisable =
    ((isCheckingEdit || isCheckingCreate) &&
      (!result.hasPermission || (result.requiresOtp && !otpVerified && !isOtpContextVerified))) ||
    isDisableField;

  // Debug: trace permission disable decision
  // eslint-disable-next-line no-console
  // console.debug(
  //   '[PermissionGuard] field:',
  //   fieldName,
  //   'permissionKey:',
  //   permissionKey,
  //   'result:',
  //   result,
  //   'isDisableField:',
  //   isDisableField,
  //   'otpVerified:',
  //   otpVerified,
  //   'isOtpContextVerified:',
  //   isOtpContextVerified,
  //   'shouldDisable:',
  //   shouldDisable
  // );

  // 🔐 OTP Handlers
  const handleRequestOtp = async (channel: 'whatsapp' | 'sms' | 'email' = 'sms') => {
    setConfirmModalOpen(false);
    setIsLoading(true);
    setError('');

    try {
      // const res = await sendOtp({
      //   permissionName: result.key,
      //   hospitalName: 'hospital',
      //   patientName,
      //   treatingDoctorName,
      //   billNo,
      //   billAmount,
      // });
      setMessage('OTP sent successfully. Please check your messages.');
      setOtpModalOpen(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error('OTP send error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string, channel: 'whatsapp' | 'sms' | 'email') => {
    setIsLoading(true);
    setError('');

    try {
      // await verifyOtp({
      //   mobile: user?.mobile || '',
      //   otp: otpValue,
      //   permissionName: result.key,
      //   // permissionKey: ('key' in result ? result.key : '') || relevantKeys[0] || '',
      //   // channel,
      // });

      setOtpVerified(true);
      setOtpModalOpen(false);
      if (permissionKey) markVerified(permissionKey);
      onOtpVerify?.();
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Early return if no relevant permission keys

  const noPermissionKeys = relevantKeys?.length === 0;

  if (noPermissionKeys) {
    return React.cloneElement(children, {
      isdisable: false,
      disabled: false,
      isDisable: false,
      isdisabled: false,
    });
  }

  // 🟢 Step 6: Cases

  // Case: No permission at all
  if ((isCheckingEdit || isCheckingCreate) && !result.hasPermission) {
    if (mode === 'hide') {
      return null;
    }
    return (
      <TooltipWrapper
        title={`You don't have permission to edit ${fieldName}`}
        placement={tooltipPlacement}
        allowRequest
        onRequestPermission={() => {
          console.log(`User requested permission for: ${fieldName}`);
        }}
      >
        {children}
      </TooltipWrapper>
    );
  }

  // Case: Edit mode + requires OTP + not verified yet
  const needsOtpVerification =
    (isCheckingEdit || isCheckingCreate) &&
    result.requiresOtp &&
    !otpVerified &&
    !isOtpContextVerified;

  const pulseAnimation = keyframes`
  0% { background-color: rgba(255, 77, 77, 1); }   /* red */
  50% { background-color: rgba(76, 175, 80, 1); } /* green */
  100% { background-color: rgba(255, 77, 77, 1); } /* red */
`;

  // // If the wrapped child explicitly requests disable (via props), respect it.
  const childProps: any = (children as any)?.props || {};
  const childRequestedDisable = Boolean(
    childProps.isdisable ?? childProps.isDisable ?? childProps.disabled ?? false
  );

  const finalDisable = shouldDisable || childRequestedDisable;

  return (
    <Box sx={{ position: 'relative' }}>
      {React.cloneElement(children, {
        isdisable: finalDisable,
        disabled: finalDisable,
        isDisable: finalDisable,
        isdisabled: finalDisable,
        ...(needsOtpVerification && { inputProps: { readOnly: true } }),
      })}

      {/* Overlay to block interaction - only when OTP verification is needed */}
      {needsOtpVerification && (
        <Box
          sx={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
          onClick={() => {
            if (!isDisableField) setConfirmModalOpen(true);
          }}
        />
      )}

      <Dialog
        open={confirmModalOpen}
        maxWidth="md"
        fullWidth
        // onClose={() => setConfirmModalOpen(false)}
      >
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
          <Box py={2} width="100%">
            <Typography variant="body1" mb={3} textAlign="center">
              Editing <b>{fieldName}</b> Requires OTP verification.
            </Typography>

            <Grid container spacing={2}>
              {/* SMS
              <Grid item xs={12} md={4}>
                {permissionOtpContacts.length > 0 && (
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
                      {permissionOtpContacts.map((mobile, idx) => (
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

               WhatsApp 
              <Grid item xs={12} md={4}>
                {permissionOtpContacts.length > 0 && (
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
                      {permissionOtpContacts.map((mobile, idx) => (
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

              Email
              <Grid item xs={12} md={4}>
                {permissionOtpContacts.length > 0 && (
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
                      {permissionOtpContacts.map((email, idx) => (
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
              </Grid> */}
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
    </Box>
  );
}
