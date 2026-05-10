import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Stack,
  Dialog,
  Button,
  useTheme,
  InputLabel,
  Typography,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import CommonButton from 'src/components/common-button';

type OtpChannel = 'whatsapp' | 'sms' | 'email';

type OtpModalProps = {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string, channel: OtpChannel) => void;
  onResend?: () => void;
  isLoading?: boolean;
  error?: string;
  message?: string;
  channelStatus?: {
    sms: 'idle' | 'sending' | 'success' | 'error';
    email: 'idle' | 'sending' | 'success' | 'error';
    whatsapp: 'idle' | 'sending' | 'success' | 'error';
  };
};

function MessageRenderer({ message }: { message: string }) {
  if (!message) return null;

  // Step 1: Break lines
  const lines = message.split(/\n/);

  return (
    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
      {lines.map((line, i) => {
        // Step 2: Bold text between *
        const parts = line.split(/(\*.*?\*)/g);

        return (
          <React.Fragment key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <strong key={j}>
                    {part.slice(1, -1)} {/* remove * */}
                  </strong>
                );
              }
              return <span key={j}>{part}</span>;
            })}
            {i < lines.length - 1 && <br />} {/* Line break */}
          </React.Fragment>
        );
      })}
    </Typography>
  );
}

export default function OtpModal({
  open,
  onClose,
  onVerify,
  onResend,
  message,
  isLoading = false,
  error = '',
  channelStatus = { sms: 'sending', email: 'success', whatsapp: 'error' },
}: OtpModalProps) {
  const theme = useTheme();
  // const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  // const [channel, setChannel] = useState<OtpChannel>('sms');

  // const handleVerify = () => {
  //   onVerify(otp.join(''), channel);
  //   setOtp(['', '', '', '', '', '']);
  // };

  const otpVerficationSchema = zod.object({
    otp: zod
      .string()
      .min(1, { message: 'OTP is required !' })
      .length(6, { message: 'OTP must be 6 digits' }),
  });

  type otpVerficationSchemaType = zod.infer<typeof otpVerficationSchema>;

  const otpVerficationSchemaMethod = useForm<otpVerficationSchemaType>({
    resolver: zodResolver(otpVerficationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = otpVerficationSchemaMethod;

  const otp = watch('otp');

  const handleVerify = handleSubmit(async (data) => {
    try {
      onVerify(data.otp, 'sms');
      reset();
    } catch (err: any) {
      console.log('Login failed');
    }
  });

  const handleResend = () => {
    reset();
    onResend?.();
  };

  // ----------------------------------------------------------------------

  const renderStatus = (status: string) => {
    switch (status) {
      case 'sending':
        return <CircularProgress size={18} />;
      case 'success':
        return <Iconify icon="mdi:check-circle" color="green" width={20} />;
      case 'error':
        return <Iconify icon="mdi:close-circle" color="red" width={20} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      // onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Form key="OTPVerficication" methods={otpVerficationSchemaMethod} onSubmit={handleVerify}>
        {/* Header */}
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
            variant="h5"
            align="center"
            sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
          >
            OTP Verification
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexWrap="wrap"
            my={1}
          >
            <Box
              textAlign="center"
              sx={{
                py: 1,
                px: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                my: 1,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Iconify icon="mdi:whatsapp" width={35} color="#25D366" />
                <Typography variant="caption">WhatsApp</Typography>
              </Box>
              <Box mt={0.5}>{renderStatus(channelStatus.whatsapp)}</Box>
            </Box>
            <Box
              textAlign="center"
              sx={{
                py: 1,
                px: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                my: 1,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Iconify icon="mdi:message-text" width={35} color="#1976d2" />
                <Typography variant="caption">SMS</Typography>
              </Box>
              <Box mt={0.5}>{renderStatus(channelStatus.sms)}</Box>
            </Box>
            <Box
              textAlign="center"
              sx={{
                py: 1,
                px: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                my: 1,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Iconify icon="mdi:gmail" width={36} color="#EA4335" />
                <Typography variant="caption">Email</Typography>
              </Box>
              <Box mt={0.5}>{renderStatus(channelStatus.email)}</Box>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              my: 1,
            }}
          >
            <MessageRenderer message={message || ''} />
          </Box>

          <Stack>
            <InputLabel shrink sx={{ fontSize: '20px !important', color: 'black !important' }}>
              OTP
            </InputLabel>
            <Field.Code name="otp" />
          </Stack>

          {/* Resend */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', display: 'block' }}
          >
            Didn’t get it?{' '}
            <Button size="small" onClick={handleResend} disabled={isLoading}>
              Resend OTP
            </Button>
          </Typography>
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
            onClick={onClose}
          >
            Cancel
          </CommonButton>
          <CommonButton
            variant="contained"
            color="success"
            onClick={handleVerify}
            type="submit"
            sx={{
              fontSize: '13px',
              height: '36px',
              backgroundColor: 'rgba(63, 84, 115, 1)',
              '&:hover': { backgroundColor: 'rgba(63, 84, 115, 0.9)' },
            }}
            loading={isSubmitting}
            disabled={otp.length < 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </CommonButton>
        </Box>
      </Form>
    </Dialog>
  );
}
