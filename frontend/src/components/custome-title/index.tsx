import type { SxProps } from '@mui/material';

import { Typography } from '@mui/material';

type TitleProps = {
  title: string;
  sx?: SxProps;
};

export default function CustomTitle({ title, sx = {} }: TitleProps) {
  return (
    <Typography
      sx={{
        mb: 2,
        fontSize: '1rem',
        fontWeight: 'bold',
        ...sx,
      }}
    >
      {title}
    </Typography>
  );
}
