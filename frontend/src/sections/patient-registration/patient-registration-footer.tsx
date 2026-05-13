import type React from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Tooltip, MenuItem } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import CommonButton from 'src/components/common-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

interface PatientRegisterFormButtonProps {
  currentPath: string;
  currentData: any;
  isdisable?: boolean;
  isSubmitting: boolean;
  onParticularSearch?: () => void;
  onSubmit: () => void;
  onExit?: () => void;
  handlePrevious?: () => void;
  handleNext?: () => void;
  handleDisable?: () => void | undefined;
  handleCameraCapture: () => void | undefined;
}

const PatientRegisterFormButton: React.FC<PatientRegisterFormButtonProps> = ({
  currentPath,
  isdisable,
  currentData,
  isSubmitting,
  onParticularSearch,
  onSubmit,
  handlePrevious,
  handleNext,
  handleDisable,
  handleCameraCapture,
  onExit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const pathname = usePathname();

  // const isOPDChargesNewGroup = pathname.includes(paths.dashboard.opd.new);

  const router = useRouter();
  const morePopover = usePopover();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={isMobile ? 2 : 1}
      sx={{
        height: '55px',
        p: isMobile ? 1 : 1,
        pr: isMobile ? 3 : 1,
        pl: isMobile ? 3 : 6,
        position: 'sticky',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#E5F0FF',
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      <Stack direction="row" gap={2} justifyContent="space-between">
        {isMobile ? (
          <>
            <Button
              variant="contained"
              sx={{
                fontSize: '13px',
                my: 1,
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.main },
              }}
              onClick={morePopover.onOpen}
            >
              More
            </Button>

            <CustomPopover
              open={morePopover.open}
              anchorEl={morePopover.anchorEl}
              onClose={morePopover.onClose}
              slotProps={{ arrow: { placement: 'bottom-center' } }}
            >
              <MenuItem
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 1.5,
                  px: 2,
                  py: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(26, 59, 110, 0.08)',
                  },
                }}
                onClick={handlePrevious}
              >
                Previous
              </MenuItem>

              <MenuItem
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 1.5,
                  px: 2,
                  py: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(26, 59, 110, 0.08)',
                  },
                }}
                onClick={handleNext}
              >
                Next
              </MenuItem>

              {currentData && (
                <MenuItem
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 1.5,
                    px: 2,
                    py: 1,
                    my: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(26, 59, 110, 0.08)',
                    },
                  }}
                  onClick={() => router.push(currentPath)}
                >
                  Add
                </MenuItem>
              )}

              <MenuItem
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 1.5,
                  px: 2,
                  py: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(26, 59, 110, 0.08)',
                  },
                }}
                onClick={() => {
                  onParticularSearch?.();
                }}
              >
                PARTICULAR SEARCH
              </MenuItem>
            </CustomPopover>
          </>
        ) : (
          <Stack direction="row" gap={1} justifyContent="center">
            <Tooltip title="Previous Record" arrow>
              <Button
                variant="contained"
                sx={{
                  minWidth: '36px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '1.5rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={handlePrevious}
              >
                {'<'}
              </Button>
            </Tooltip>

            <Tooltip title="Next Record" arrow>
              <Button
                variant="contained"
                sx={{
                  minWidth: '36px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '1.5rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={handleNext}
              >
                {'>'}
              </Button>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      <Stack>
        {currentData && (
          <CommonButton
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              fontSize: isMobile ? '0.8rem' : '13px',
              width: isMobile ? '100%' : 'auto',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
            onClick={handleCameraCapture}
          >
            Camera Capture
          </CommonButton>
        )}
      </Stack>

      <Stack direction="row" gap={1} alignItems="flex-start">
        {isMobile ? (
          <>
            <Box>
              <CommonButton
                variant="contained"
                sx={{
                  backgroundColor: 'rgba(63, 84, 115, 1)',
                  fontSize: isMobile ? '0.8rem' : '13px',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 84, 115, 1)',
                  },
                }}
                type="submit"
                color={!currentData ? 'inherit' : 'success'}
                loading={isSubmitting}
                onClick={() => {
                  if (!currentData) {
                    onSubmit();
                  } else if (isdisable) {
                    handleDisable?.();
                  } else {
                    onSubmit();
                  }
                }}
              >
                {!currentData ? 'Save' : isdisable ? 'Update' : 'Save changes'}
              </CommonButton>
            </Box>
            <Box>
              <CommonButton
                variant="contained"
                sx={{
                  backgroundColor: '#3C3D3F',
                  fontSize: isMobile ? '0.8rem' : '13px',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: '#3C3D3F',
                  },
                }}
                onClick={onExit}
              >
                EXIT
              </CommonButton>
            </Box>
          </>
        ) : (
          <>
            {currentData && (
              <CommonButton
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  fontSize: isMobile ? '0.8rem' : '13px',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => router.push(currentPath)}
              >
                Add
              </CommonButton>
            )}

            <CommonButton
              variant="contained"
              sx={{
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(26, 59, 110, 0.3)',
                color: theme.palette.primary.main,
                fontSize: isMobile ? '0.8rem' : '13px',
                width: isMobile ? '100%' : 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(26, 59, 110, 0.3)',
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => {
                onParticularSearch?.();
              }}
            >
              PARTICULAR SEARCH
            </CommonButton>

            <Box>
              <CommonButton
                variant="contained"
                sx={{
                  backgroundColor: 'rgba(63, 84, 115, 1)',
                  fontSize: isMobile ? '0.8rem' : '13px',
                  width: isMobile ? '100%' : 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 84, 115, 1)',
                  },
                }}
                type="submit"
                color={!currentData ? 'inherit' : 'success'}
                loading={isSubmitting}
                onClick={() => {
                  if (!currentData) {
                    onSubmit();
                  } else if (isdisable) {
                    handleDisable?.();
                  } else {
                    onSubmit();
                  }
                }}
              >
                {!currentData ? 'Save' : isdisable ? 'Update' : 'Save changes'}
              </CommonButton>
            </Box>

            <CommonButton
              variant="contained"
              sx={{
                backgroundColor: '#3C3D3F',
                fontSize: isMobile ? '0.8rem' : '13px',
                width: isMobile ? '100%' : 'auto',
                '&:hover': {
                  backgroundColor: '#3C3D3F',
                },
              }}
              onClick={onExit}
            >
              EXIT
            </CommonButton>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default PatientRegisterFormButton;
