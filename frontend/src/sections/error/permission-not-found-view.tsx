import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';

import { Iconify } from 'src/components/iconify/iconify';
import { MotionContainer } from 'src/components/animate';

export default function PermissionNotFoundView() {
  const navigate = useNavigate();

  return (
    <SimpleLayout content={{ compact: true }}>
      <Box sx={{ py: { xs: 8, md: 8 }, bgcolor: 'background.default' }}>
        <Container component={MotionContainer}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box sx={{ maxWidth: 620, textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Iconify icon="eva:lock-fill" width={64} sx={{ color: 'primary.main' }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Permission Denied
                </Typography>
              </Box>

              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                You don’t have permission to access this page. If you think this is a mistake,
                contact your administrator or request access. Meanwhile you can go back or return to
                the dashboard.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/')}
                  startIcon={<Iconify icon="mingcute:home-2-line" />}
                >
                  Dashboard
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<Iconify icon="ic:round-arrow-back" />}
                >
                  Return
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </SimpleLayout>
  );
}
