import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import { useRouter, usePathname } from 'src/routes/hooks';

import { Paper } from '@mui/material';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateAvatar } from 'src/components/animate';
// import BranchSelector from 'src/components/selection/branch-selection';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const theme = useTheme();

  // const router = useRouter();

  // const pathname = usePathname();

  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  // const handleClickItem = useCallback(
  //   (path: string) => {
  //     handleCloseDrawer();
  //     router.push(path);
  //   },
  //   [handleCloseDrawer, router]
  // );

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: {
          alt: user?.fullName || 'avatar',
        },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.fullName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL=""
        displayName={user?.fullName || ''}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8, px: 2 }}>
            {/* Avatar */}
            {renderAvatar}

            {/* User Name */}
            <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
              {user?.fullName}
            </Typography>

            {/* Email */}
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>

            {/* Organization + Branch info */}
            {(user?.branch?.organization?.name || user?.branch?.legalName) && (
              <Paper
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1,
                  mt: 2,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {user?.branch?.organization?.name && (
                  <Typography variant="subtitle2" color="text.primary">
                    Organization - {user.branch.organization.name}
                  </Typography>
                )}
                {user?.branch?.legalName && (
                  <Typography variant="body2" color="text.secondary">
                    Branch - {user?.branch?.legalName}
                  </Typography>
                )}
              </Paper>
            )}

            {/* Branch Selector */}
            <Box sx={{ mt: 2, width: '100%' }}>{/* <BranchSelector user={user} /> */}</Box>
          </Stack>
        </Scrollbar>

        {/* Sign Out Button */}
        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
