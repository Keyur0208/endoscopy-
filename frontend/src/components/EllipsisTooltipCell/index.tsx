import type { Theme, SxProps, TypographyProps } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { Tooltip, Typography, useMediaQuery } from '@mui/material';

type EllipsisTooltipCellProps = {
  value?: string;
  variant?: TypographyProps['variant'];
  Sx?: SxProps<Theme>;
};

export default function EllipsisTooltipCell({ value, variant, Sx = {} }: EllipsisTooltipCellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showTooltip = !!value && value !== '-';

  const content = (
    <Typography
      noWrap
      variant={variant}
      sx={{
        maxWidth: 200,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
        ...Sx,
      }}
    >
      {value || ''}
    </Typography>
  );

  if (!showTooltip) return content;

  return (
    <Tooltip
      title={value}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      disableInteractive={isMobile}
    >
      {content}
    </Tooltip>
  );
}
