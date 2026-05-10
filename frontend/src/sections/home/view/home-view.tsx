import { Box, Container, Typography } from '@mui/material';

import { layoutClasses } from 'src/layouts/classes';

import { Image } from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';

import HomeViewButtons from './home-view-footer';
// import { useScrollProgress } from 'src/components/animate/scroll-progress';

// ----------------------------------------------------------------------

export function HomeView() {
  const settings = useSettingsContext();

  return (
    <>
      <Container
        className={layoutClasses.content}
        maxWidth={settings.compactLayout ? 'xl' : false}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 0.5,
          pb: 0.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: '100vh', md: '80vh' },
            width: '100%',
            px: { xs: 1.5, sm: 2 },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Image
              src="/logo/nm-logo.svg"
              alt="Nilkanth Logo"
              width={500} // fallback size (desktop)
              height={500}
              sizes="(max-width: 600px) 200px, (max-width: 900px) 300px, 500px"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '500px', // desktop
                opacity: 0.6,
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textTransform: 'capitalize',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                mt: 1,
              }}
            >
              206, Millenium Point, Lal Darwaja Station Rd,
              <br />
              Lal Darwaja, Surat, Gujarat - 395003
            </Typography>
          </Box>
        </Box>
      </Container>
      <HomeViewButtons />
    </>
  );
}
