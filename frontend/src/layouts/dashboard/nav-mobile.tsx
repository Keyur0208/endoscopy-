import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { hideScrollY } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  NavSectionMini,
  NavSectionVertical,
  type NavSectionProps,
} from 'src/components/nav-section';

// ----------------------------------------------------------------------

type NavMobileProps = NavSectionProps & {
  open: boolean;
  onClose: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavMobile({ data, open, onClose, slots, sx, ...other }: NavMobileProps) {
  const pathname = usePathname();

  const settings = useSettingsContext();

  const isNavVertical = settings.navLayout === 'vertical';

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderNavVertical = (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-vertical-width)',
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          {settings.navColor === 'integrate' ? (
            <Logo variant="primary" />
          ) : (
            <Logo variant="white" />
          )}
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />
      </Scrollbar>
    </Drawer>
  );

  const renderNavMini = (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mini-width)',
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          {settings.navColor === 'integrate' ? (
            <Logo variant="primary" />
          ) : (
            <Logo variant="white" />
          )}
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionMini
          data={data}
          sx={{ pb: 2, px: 0.5, ...hideScrollY, flex: '1 1 auto', overflowY: 'auto' }}
          {...other}
        />
      </Scrollbar>
    </Drawer>
  );

  return <>{isNavVertical ? renderNavVertical : renderNavMini}</>;
}
