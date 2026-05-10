import type { BoxProps } from '@mui/material/Box';
import type { ContainerProps } from '@mui/material/Container';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid, Stack, useTheme, Typography } from '@mui/material';

import { layoutClasses } from 'src/layouts/classes';

import { Form } from 'src/components/hook-form';
import RHFFormField from 'src/components/form-feild';
import { useSettingsContext } from 'src/components/settings';

import { useAuthContext } from 'src/auth/hooks';

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

type CameraCapHeaderProps = ContainerProps & {
  disablePadding?: boolean;
  formnumber?: string | undefined;
  currentIndex?: number;
  methods: any;
  total?: number;
  title?: String;
  isdisable: boolean;
  currentData?: any;
};

export function CameraCaptureHeader({
  title,
  sx,
  children,
  currentIndex,
  total,
  isdisable,
  methods,
  disablePadding,
  currentData,
  maxWidth = 'xl',
  ...other
}: CameraCapHeaderProps) {
  const theme = useTheme();

  const settings = useSettingsContext();
  const settinglayout = settings.navLayout === 'horizontal';
  const { user } = useAuthContext();

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: settinglayout ? 117 : 72,
          left: 0,
          right: 0,
          width: '100%',
          alignItems: 'center',
          zIndex: 1100,
          backgroundColor: '#E5F0FF',
          borderBottom: '1px solid rgba(26, 59, 110, 0.1)',
        }}
      >
        <Form methods={methods}>
          <Stack sx={{ px: 4, py: 1 }}>
            <Grid container spacing={1} alignItems="end">
              <Grid xs={12} sm={4} md={3} container>
                <Grid item xs={6} sm={12} md={6}>
                  {typeof currentIndex === 'number' && typeof total === 'number' && (
                    <Typography
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentIndex} of {total}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6} sm={12} md={6}>
                  {currentData ? (
                    <Typography
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize',
                      }}
                    >
                      Entry By -{' '}
                      {currentData?.createdByUser?.fullName ||
                        currentData?.createdByAdminUser?.name}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Entry By - {user?.fullName}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} md={5} textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: { xs: '22px', md: '22px', lg: '24px' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </Typography>
              </Grid>
              <Grid
                xs={12}
                sm={4}
                md={4}
                container
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <RHFFormField
                  label="Capture Date"
                  name="captureDate"
                  readonly
                  type="date"
                  sx={{
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: { xs: '1fr', md: 'auto 2fr' },
                    columnGap: 1,
                  }}
                  InputSx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '2px',
                      height: '33px',
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: '12px',
                    },
                    '& .MuiInputBase-input': {
                      color: '#000',
                      fontSize: '12px',
                    },
                  }}
                  labelSx={{
                    color: 'black',
                    fontSize: '12px',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Form>
      </Box>

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
