import type { BoxProps } from '@mui/material/Box';

import { useId, forwardRef } from 'react';
// import { PermissionKeys } from 'endoscopy-shared';

import NoSsr from '@mui/material/NoSsr';
// import { useTheme } from '@mui/material/styles';
import { Box, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks/use-router';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  width?: number | string;
  height?: number | string;
  href?: string;
  disableLink?: boolean;
  variant?: 'primary' | 'white';
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      width = 40,
      height = 40,
      disableLink = false,
      className,
      href,
      variant = 'primary',
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();
    const router = useRouter();
    const handleGoToDefault = async () => {
      router.push(paths.dashboard.root);
    };

    const gradientId = useId();

    const PRIMARY_LIGHT =
      variant === 'white' ? theme.palette.common.white : theme.palette.primary.light;

    const PRIMARY_MAIN =
      variant === 'white' ? theme.palette.common.white : theme.palette.primary.main;

    const PRIMARY_DARK =
      variant === 'white' ? theme.palette.common.white : theme.palette.primary.dark;

    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 290 386"
        fill="none"
      >
        <defs>
          <linearGradient id={`${gradientId}-1`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id={`${gradientId}-2`} x1="100%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
        <path
          d="M49.7756 129.966H18.3036L17.2031 236.929C15.8639 286.219 21.4285 309.132 25.6694 314.385C42.2759 346.306 70.757 352.721 82.9217 351.939H184.034V301.308L82.9217 181.604V314.385H49.7756V129.966Z"
          fill={`url(#${gradientId}-1)`}
        />
        <path
          d="M184.034 248.329L82.9217 129.966V79H184.034C237.335 85.7061 251.554 129.855 252 151.091V301.308H217.85V116.219H184.034V248.329Z"
          fill={`url(#${gradientId}-2)`}
        />
        <path
          d="M49.7756 129.966H18.3036L17.2031 236.929C15.8639 286.219 21.4285 309.132 25.6694 314.385C42.2759 346.306 70.757 352.721 82.9217 351.939H184.034V301.308L82.9217 181.604V314.385H49.7756V129.966Z"
          stroke={PRIMARY_MAIN}
          strokeWidth="3"
        />
        <path
          d="M184.034 248.329L82.9217 129.966V79H184.034C237.335 85.7061 251.554 129.855 252 151.091V301.308H217.85V116.219H184.034V248.329Z"
          stroke={PRIMARY_MAIN}
          strokeWidth="3"
        />
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{ flexShrink: 0, display: 'inline-flex', verticalAlign: 'middle', ...sx }}
          />
        }
      >
        <Box
          onClick={handleGoToDefault}
          ref={ref}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            cursor: 'pointer',
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
