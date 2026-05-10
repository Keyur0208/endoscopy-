import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type SectionProps = BoxProps & {
  title?: string;
  method?: string;
  imgUrl?: string;
  subtitle?: string;
  layoutQuery: Breakpoint;
  methods?: {
    path: string;
    icon: string;
    label: string;
  }[];
};

export function Section({
  sx,
  method,
  layoutQuery,
  methods,
  title = 'Manage the job',
  imgUrl = '/assets/illustrations/dr.png',
  subtitle = 'More effectively with optimized workflows.',
  ...other
}: SectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // ...bgGradient({
        //   color: `0deg, rgba(107, 103, 183, 0.8), rgba(173, 182, 230, 0.8), ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}`, // More blue shades added
        //   imgUrl: `${CONFIG.site.basePath}/assets/background/background-3-blur.webp`,
        // }),
        // px: 3,
        // pb: 3,
        width: 1,
        // mt: '64px',
        // height: 'calc(100vh + 64px)',
        // maxWidth: 600,
        display: 'none',
        position: 'relative',
        pt: 'var(--layout-header-desktop-height)',
        [theme.breakpoints.up(layoutQuery)]: {
          // gap: 8,
          display: 'flex',
          // alignItems: 'center',
          // flexDirection: 'column',
          // justifyContent: 'center',
          width: 1,
          overflow: 'hidden',
        },
        ...sx,
      }}
      {...other}
    >
      {/* <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/illustrations/hosptial-image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1,
          zIndex: 0,
        }}
      /> */}

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{
          width: 1,
          objectFit: 'cover',
          // position: 'absolute',
          // height: '100%',
          // minHeight: '772px',
          // right: 50,
          // zIndex: 1,
        }}
      />
    </Box>
  );
}
