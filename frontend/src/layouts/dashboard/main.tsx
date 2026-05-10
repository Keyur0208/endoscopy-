import type { BoxProps } from '@mui/material/Box';
import type { ContainerProps } from '@mui/material/Container';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { layoutClasses } from 'src/layouts/classes';

import PageTitle from 'src/components/page-title';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

type MainProps = BoxProps & {
  isNavHorizontal: boolean;
};

export function Main({ children, isNavHorizontal, sx, ...other }: MainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...(isNavHorizontal && {
          '--layout-dashboard-content-pt': '40px',
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
  formnumber?: string | undefined;
  currentIndex?: number;
  total?: number;
  title?: String;
};

export function DashboardContent({
  title,
  sx,
  children,
  currentIndex,
  total,
  disablePadding,
  maxWidth = 'xl',
  ...other
}: DashboardContentProps) {
  const settings = useSettingsContext();

  return (
    <>
      {title && <PageTitle title={title} currentIndex={currentIndex} total={total} />}
      <Container
        className={layoutClasses.content}
        maxWidth={settings.compactLayout ? maxWidth : false}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 0.5,
          pb: 0.5,
          // [theme.breakpoints.up(layoutQuery)]: {
          //   // px: 'var(--layout-dashboard-content-px)',
          // },
          ...(disablePadding && {
            p: {
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
              xl: 0,
            },
          }),
          ...sx,
        }}
        {...other}
      >
        {children}
      </Container>
    </>
  );
}
