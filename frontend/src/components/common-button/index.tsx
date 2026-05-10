import React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';

type CommonButtonProps = {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'inherit' | 'error' | 'success' | 'info' | 'warning';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  skip?: boolean;
  [key: string]: any;
};

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  loading = false,
  onClick,
  disabled = false,
  type,
  children,
  skip,
  ...rest
}) => (
  <LoadingButton
    data-nav={skip ? 'skip' : undefined}
    variant={variant}
    color={color}
    loading={loading}
    onClick={onClick}
    type={type}
    disabled={disabled}
    sx={{ borderRadius: '2px' }}
    {...rest}
  >
    {children}
  </LoadingButton>
);

export default CommonButton;
