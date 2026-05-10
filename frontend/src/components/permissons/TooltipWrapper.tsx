import React from 'react';

import { Box, Stack, Tooltip, useTheme, Typography, useMediaQuery } from '@mui/material';

import { Iconify } from 'src/components/iconify';

type TooltipWrapperProps = {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
  allowRequest?: boolean;
  onRequestPermission?: () => void;
};

export default function TooltipWrapper({
  title,
  placement = 'bottom',
  children,
  allowRequest = false,
  onRequestPermission,
}: TooltipWrapperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Tooltip
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      disableInteractive={isMobile}
      placement={placement}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: '#fff',
            color: 'text.primary',
            border: '1px solid #e0e0e0',
            boxShadow: 3,
            borderRadius: 2,
            p: 1.5,
            // maxWidth: 250,
          },
        },
        arrow: {
          sx: { color: '#fff' },
        },
      }}
      title={
        <Stack spacing={1} alignItems="flex-start">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon="mdi:shield-key-outline"
              width={24}
              sx={{
                color: 'black',
                opacity: 0.4,
              }}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Permission Required
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {/* {allowRequest && (
            <>
              <Divider flexItem />
              <Button
                size="small"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ textTransform: 'none', borderRadius: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestPermission?.();
                }}
              >
                Request Access
              </Button>
            </>
          )} */}
        </Stack>
      }
    >
      <Box sx={{ width: '100%', cursor: 'not-allowed' }}>
        {React.cloneElement(children, {
          disabled: true,
          isdisable: true,
          isDisable: true,
          isdisabled: true,
          inputProps: { readOnly: true },
        })}
      </Box>
    </Tooltip>
  );
}
