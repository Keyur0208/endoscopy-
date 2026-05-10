import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { iconifyClasses } from './classes';
import icons from './icons.json' assert { type: 'json' };

import type { IconifyProps } from './types';

export const Iconify = forwardRef<SVGElement, IconifyProps>(
  ({ icon, className, width = 20, sx, ...other }, ref) => {
    const baseStyles = {
      width,
      height: width,
      flexShrink: 0,
      display: 'inline-flex',
    };
    const isDevelopment = import.meta.env.DEV;
    let iconToUse;
    let classNameToUse = className;

    if (isDevelopment) {
      // Developement: Use online icons with className
      iconToUse = icon;
      classNameToUse = iconifyClasses.root.concat(className ? ` ${className}` : '');
    } else {
      // Production: Use Ofline Icon By Icon.json
      const iconData = typeof icon === 'string' ? (icons as Record<string, any>)[icon] : undefined;
      if (!iconData) {
        console.warn(`❌ Icon not found in bundle: ${icon}`);
      }
      iconToUse = iconData;
    }

    const renderFallback = (
      <Box component="span" className={classNameToUse} sx={{ ...baseStyles, ...sx }} />
    );

    return (
      <NoSsr fallback={renderFallback}>
        <Box
          ref={ref}
          component={Icon}
          icon={iconToUse}
          className={classNameToUse}
          sx={{ ...baseStyles, ...sx }}
          {...other}
        />
      </NoSsr>
    );
  }
);
