import React from 'react';

import { TextField } from '@mui/material';

type ReadOnlyFieldProps = {
  label?: string;
  value?: string | number | boolean | null | undefined | React.ReactNode;
};

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => (
  <TextField
    label={label}
    value={value?.toString()}
    fullWidth
    InputProps={{
      readOnly: true,
    }}
    variant="filled"
    // sx={{
    //   '& .MuiFilledInput-root': {
    //     borderRadius: '2px',
    //     '&::before, &::after': {
    //       display: 'none',
    //     },
    //   },
    //   '& .MuiInputLabel-root': {
    //     transform: 'translate(12px, 6px) scale(0.75)',
    //   },
    // }}
  />
);

export default ReadOnlyField;
