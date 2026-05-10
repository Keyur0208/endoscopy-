import { Box, useTheme, Typography } from '@mui/material';

import { useSettingsContext } from '../settings';

type Props = {
  title: string;
  currentIndex?: number;
  total?: number;
};

export default function PageTitle({ title, currentIndex, total }: Props) {
  const theme = useTheme();
  const setting = useSettingsContext();
  const settinglayout = setting.navLayout === 'horizontal';
  const hasCounter = typeof currentIndex === 'number' && typeof total === 'number';

  return (
    <Box
      sx={{
        position: 'sticky',
        top: settinglayout ? 117 : 72,
        left: 0,
        right: 0,
        height: { xs: 'auto', sm: '50px' },
        width: '100%',
        zIndex: 1100,
        backgroundColor: '#E5F0FF',
        borderBottom: '1px solid rgba(26, 59, 110, 0.1)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: { xs: 'center', sm: hasCounter ? 'space-between' : 'center' },
        flexWrap: 'wrap-reverse',
        px: 2,
        gap: 1,
      }}
    >
      <Typography
        sx={{
          order: { xs: 0, sm: 1 },
          color: theme.palette.primary.main,
          fontWeight: 600,
          fontSize: { xs: '22px', md: '22px', lg: '24px' },
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>

      {hasCounter && (
        <Typography
          sx={{
            order: { xs: 1, sm: 0 },
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: { xs: '12px', sm: '13px', md: '14px', lg: '14px' },
            whiteSpace: 'nowrap',
          }}
        >
          {currentIndex} of {total}
        </Typography>
      )}

      {/* Render filler box ONLY if counter exists */}
      {hasCounter && <Box sx={{ order: 2 }} />}
    </Box>
  );
}
