import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import { useAuthContext } from 'src/auth/hooks';
// import { FormatDateString } from 'src/components/format-date-time';

export default function HomeViewFooter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //   const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#fff',
      }}
    >
      {/* ------------------ BLUE COMPANY INFO BOX ------------------ */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'rgba(26,59,110,0.08)',
          px: 2,
          py: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: isMobile ? '0.75rem' : '0.9rem',
          }}
        >
          Nilkanth Medico PVT. LTD - Hospital Management Software
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: 500,
            fontSize: {
              xs: '8px', // Mobile
              sm: '10px', // Small tablets
              md: '11px', // Laptop/Desktop
            },
            textAlign: 'center',
            lineHeight: 1.4,

            // MOBILE: 2 line clamp with ellipsis
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 'unset', md: 'unset' },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Delivering end-to-end digital hospital solutions including OPD, IPD, Billing, Laboratory,
          Radiology, EMR/EHR, Inventory, Accounts. Ensuring seamless workflow, paperless records,
          secure data storage, automated reporting & real-time hospital insights. Support 24*7 |
          On-Site & Remote Training | Custom Module Development. 📞 +91 77788 78340 , 78780 72598 |
          📧 nilkanthmedicosoftware@gmail.com | 🌐 www.nilkanthmedico.com
        </Typography>
      </Box>

      {/* ------------------ WHITE SYSTEM INFO BAR ------------------ */}
      {/* <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          px: 2,
          py: 0.5,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          color: '#051B3C',
          borderTop: '1px solid #ddd',
          gap: 1,
          fontWeight: 500,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Ver.0.1
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          EXE:{' '}
          {user?.currentbranch?.organization?.expiryDate
            ? FormatDateString(user?.currentbranch?.organization?.expiryDate)
            : ''}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          User: { user?.fullName || '' } {user?.currentbranch?.legalName || "Nilkanth Medico Pvt. Ltd"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          E: Postgre Sql
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          O: Postgre Sql
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Lic: {user?.currentbranch?.organization?.licenseKey || '-'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: '#051B3C',
            fontWeight: '500',
            fontSize: isMobile ? '0.6rem' : '0.75rem',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
            {FormatDateString(new Date().toISOString())}
        </Typography>
      </Box> */}
    </Stack>
  );
}
