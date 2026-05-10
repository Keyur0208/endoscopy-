import type React from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

// import { PDFViewIcon } from 'src/assets/icons';

import CommonButton from 'src/components/common-button';
import PermissionGuard from 'src/components/permissons/PermissionGuard';

interface ReportFormFooterProps {
  onExit?: () => void;
  onSubmit: () => void;
  printPermissionKeys?: {
    create?: string[];
    edit?: string[];
    both?: string[];
  };
  pCheck?: boolean;
  setPCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportFormFooter: React.FC<ReportFormFooterProps> = ({
  onExit,
  pCheck,
  setPCheck,
  onSubmit,
  printPermissionKeys,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      justifyContent="space-between"
      alignItems="center"
      gap={isMobile ? 2 : 1}
      sx={{
        height: '55px',
        p: isMobile ? 1 : 1.5,
        pr: isMobile ? 3 : 10,
        pl: isMobile ? 3 : 6,
        position: 'sticky',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#E5F0FF',
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            direction: 'row',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#1A3B6E',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <FormControlLabel
            name="L"
            control={<Checkbox />}
            label="P"
            sx={{ margin: 0 }}
            checked={pCheck}
            onChange={() => setPCheck(!pCheck)}
          />
          <Box>
            <PermissionGuard
              fieldName="Print"
              permissionKeys={{
                both: printPermissionKeys?.both,
              }}
              isDisabledMode="both"
            >
              <CommonButton
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: '#1A3B6E',
                  fontSize: isMobile ? '0.8rem' : '13px',
                  width: 'auto',
                  '&:hover': {
                    backgroundColor: '#1A3B6E',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: '0.2rem',
                  },
                }}
                onClick={onSubmit}
              >
                View
              </CommonButton>
            </PermissionGuard>
          </Box>
          <Box>
            <CommonButton
              variant="contained"
              sx={{
                backgroundColor: '#3C3D3F',
                fontSize: isMobile ? '0.8rem' : '13px',
                width: 'auto',
                '&:hover': {
                  backgroundColor: '#3C3D3F',
                },
              }}
              onClick={onExit}
            >
              EXIT
            </CommonButton>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ReportFormFooter;
