import React from 'react';

import {
  Box,
  alpha,
  Dialog,
  useTheme,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Corporate loader: simple spinner with centered brand/icon

type LoadingDialogProps = {
  open: boolean;
  message?: string;
  // Professional hospital-themed variants
  variant?: 'hospital' | 'analytics' | 'dna' | 'spinner' | 'auto';
  // when variant is 'auto', this controls the cycle interval in ms
  autoIntervalMs?: number;
  // Show close button in top-right corner
  showCloseButton?: boolean;
  onClose?: () => void;
};

// Corporate messages
const getCorporateMessage = (variant: string, customMessage?: string) => {
  if (customMessage && customMessage !== 'Please wait...') return customMessage;

  const messages: Record<string, string> = {
    hospital: 'Processing request...',
    analytics: 'Processing request...',
    dna: 'Processing request...',
    spinner: 'Please wait...',
    auto: 'Please wait...',
  };

  return messages[variant] || 'Processing request...';
};

export default function LoadingDialog({
  open,
  message,
  variant = 'spinner',
  autoIntervalMs = 1500,
  showCloseButton = false,
  onClose,
}: LoadingDialogProps) {
  const theme = useTheme();

  // Simple corporate render: spinner with optional small brand icon inside
  const renderIcon = () => {
    const iconSize = 56;
    return (
      <Box
        sx={{
          position: 'relative',
          width: iconSize,
          height: iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="primary" size={iconSize} thickness={4} />
        {/* small brand mark centered */}
        <Box
          sx={{
            position: 'absolute',
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="healthicons:hospital-building" width={18} height={18} />
        </Box>
      </Box>
    );
  };

  const displayMessage = getCorporateMessage(variant as string, message);

  return (
    <Dialog
      open={open}
      maxWidth={false}
      onClose={showCloseButton ? onClose : undefined}
      disableEscapeKeyDown={!showCloseButton}
      aria-labelledby="loading-dialog"
      PaperProps={{
        sx: {
          background: 'none',
          boxShadow: 'none',
          overflow: 'visible',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.4),
          backdropFilter: 'blur(6px)',
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={6}
        gap={2}
        minWidth={320}
        position="relative"
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
            ${alpha(theme.palette.background.default, 0.98)} 100%)`,
          borderRadius: 3,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: `
            0 24px 48px -12px ${alpha(theme.palette.common.black, 0.25)},
            0 18px 36px -18px ${alpha(theme.palette.primary.main, 0.35)},
            inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)},
            inset 0 -1px 0 ${alpha(theme.palette.divider, 0.2)}
          `,
          transition: theme.transitions.create(['transform', 'opacity'], {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
          }),
        }}
      >
        {/* Close Button */}
        {showCloseButton && onClose && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.04),
                color: theme.palette.error.main,
                transform: 'scale(1.1)',
              },
              transition: theme.transitions.create(['background-color', 'color', 'transform'], {
                duration: 150,
              }),
            }}
          >
            <Iconify icon="eva:close-fill" width={20} />
          </IconButton>
        )}

        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mb: 1,
          }}
        >
          {renderIcon()}
        </Box>

        {/* Message */}
        <Typography
          id="loading-dialog"
          variant="h6"
          color="text.primary"
          textAlign="center"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            background: `linear-gradient(135deg, 
              ${theme.palette.primary.main} 0%, 
              ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 0.3,
            lineHeight: 1.4,
            maxWidth: 280,
          }}
        >
          {displayMessage}
        </Typography>

        {/* Decorative dots for non-spinner variants */}
        {variant !== 'spinner' && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.secondary.main} 100%)`,
                  opacity: 0.9 - i * 0.25,
                }}
              />
            ))}
          </Box>
        )}

        {/* Subtle context message */}
        {variant === 'auto' && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              fontSize: '0.875rem',
              opacity: 0.7,
              fontWeight: 400,
              mt: 0.5,
            }}
          >
            Processing your request...
          </Typography>
        )}
      </Box>
    </Dialog>
  );
}
