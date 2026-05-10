import { Card, Grid, Stack, Avatar, Divider, Typography, CardContent } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks';

export default function MyProfileSideLayout() {
  const { user } = useAuthContext();

  return (
    <DashboardContent title="My Profile">
      <Grid container spacing={3}>
        {/* Left Panel: User Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Stack alignItems="center" spacing={2} textAlign="center">
                <Avatar src="" alt={user?.fullName || 'User'} sx={{ width: 100, height: 100 }} />
                <Typography variant="h6" fontWeight={600}>
                  {user?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.mobile}
                </Typography>

                <Divider sx={{ my: 2, width: '100%' }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Branch
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user?.branch?.legalName || '-'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Organization
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user?.branch?.organization?.legalName || '-'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel: Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">{user?.fullName || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Mobile
                  </Typography>
                  <Typography variant="body1">{user?.mobile}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Verified
                  </Typography>
                  <Typography variant="body1">
                    {user?.isEmailVerified ? '✔ Email' : '✘ Email'} /{' '}
                    {user?.isMobileVerified ? '✔ Mobile' : '✘ Mobile'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Organization Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{user?.branch?.phoneNumber || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{user?.branch?.address || '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Organization Images
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    {user?.branch?.logoImage && (
                                        <Avatar
                                            src={user?.branch.logoImage || ""}
                                            alt="Logo"
                                            sx={{ width: 80, height: 80 }}
                                        />
                                    )}
                                    {user?.branch?.bannerImage && (
                                        <Box
                                            component="img"
                                            src={user?.branch.bannerImage || ""}
                                            alt="Banner"
                                            sx={{
                                                width: "100%",
                                                maxHeight: 120,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                            }}
                                        />
                                    )}
                                </Stack> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
