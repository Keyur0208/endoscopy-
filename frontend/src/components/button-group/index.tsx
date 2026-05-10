import type React from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Tooltip, MenuItem } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import CommonButton from 'src/components/common-button';
import PermissionGuard from 'src/components/permissons/PermissionGuard';

import { usePopover, CustomPopover } from '../custom-popover';

interface DoctorFormButtonsProps {
  currentPath?: string | undefined;
  currentData?: any;
  isdisable?: boolean;
  isSubmitting: boolean;
  onParticularSearch?: () => void;
  onSubmit: () => void;
  onExit?: () => void;
  handlePrevious?: () => void;
  handleNext?: () => void;
  handleDisable?: () => void | undefined;
  handlePrint?: () => void;
  savePermissionKeys?: {
    create?: string[];
    edit?: string[];
    both?: string[];
  };
  saveDisabledMode?: any;
  printPermissionKeys?: {
    create?: string[];
    edit?: string[];
    both?: string[];
  };
}

const DoctorFormButtons: React.FC<DoctorFormButtonsProps> = ({
  currentPath,
  isdisable,
  currentData,
  handlePrint,
  isSubmitting,
  onParticularSearch,
  onSubmit,
  handlePrevious,
  handleNext,
  handleDisable,
  onExit,
  savePermissionKeys,
  saveDisabledMode,
  printPermissionKeys,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const pathname = usePathname();

  const router = useRouter();
  const navigationPopover = usePopover();
  const actionPopover = usePopover();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={isMobile ? 2 : 1}
      sx={{
        p: isMobile ? 1 : 1.5,
        pr: isMobile ? 3 : 10,
        pl: isMobile ? 3 : 6,
        position: 'sticky',
        bottom: 0,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        zIndex: 1000,
        backgroundColor: '#E5F0FF',
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      {/* --------------------------- Left Side 📱 PHONE 📱 --------------------------- */}
      <>
        {/* Mobile Navigation Popover Button */}
        {(handlePrevious || handleNext || handlePrint) && (
          <Button
            variant="contained"
            sx={{
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(26, 59, 110, 0.3)',
              color: theme.palette.primary.main,
              fontSize: '13px',
              width: 'auto',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(26, 59, 110, 0.35)',
                color: theme.palette.primary.main,
              },
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
            onClick={navigationPopover.onOpen}
          >
            Navigation
          </Button>
        )}

        {/* Mobile Navigation Popover Menu */}
        <CustomPopover
          open={navigationPopover.open}
          anchorEl={navigationPopover.anchorEl}
          onClose={navigationPopover.onClose}
          slotProps={{ arrow: { placement: 'bottom-center' } }}
        >
          {handlePrevious && (
            <MenuItem
              onClick={handlePrevious}
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
            >
              Previous
            </MenuItem>
          )}

          {handleNext && (
            <MenuItem
              onClick={handleNext}
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
            >
              Next
            </MenuItem>
          )}

          {handlePrint && (
            <PermissionGuard
              fieldName="Print"
              currentData={currentData}
              permissionKeys={{
                both: printPermissionKeys?.both,
              }}
              isDisabledMode="both"
            >
              <MenuItem
                onClick={handlePrint}
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
              >
                Print
              </MenuItem>
            </PermissionGuard>
          )}
        </CustomPopover>
      </>

      {/* --------------------------- Left Side 💻 LAPTOP/DESKTOP 💻  --------------------------- */}
      <Stack
        direction="row"
        gap={1}
        justifyContent="center"
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
      >
        {handlePrevious && (
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
        )}

        {handleNext && (
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
        )}

        {/* {/* //  Sp Master Only Dotcor Master  - Comming Sooon  */}

        {/* {isDoctorMaster && (
          <CommonButton
            variant="contained"
            sx={{
              color: theme.palette.primary.main,
              backgroundColor: 'rgba(26, 59, 110, 0.3)',
              minWidth: '36px',
              fontSize: isMobile ? '0.8rem' : '13px',
              width: isMobile ? '100%' : 'auto',
              '&:hover': {
                backgroundColor: 'rgba(26, 59, 110, 0.3)',
              },
            }}
          >
            Sp Transfer
          </CommonButton>
        )} */}

        <Box display="flex" gap={1}>
          {handlePrint && (
            <PermissionGuard
              fieldName="Print"
              currentData={currentData}
              permissionKeys={{
                both: printPermissionKeys?.both,
              }}
              isDisabledMode="both"
            >
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
                onClick={handlePrint}
              >
                Print
              </CommonButton>
            </PermissionGuard>
          )}
        </Box>
      </Stack>

      {/* --------------------------- Righ Side 📱 PHONE 📱 --------------------------- */}

      <Stack>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'rgba(63, 84, 115, 1)',
            fontSize: isMobile ? '0.8rem' : '13px',
            width: 'auto',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(53, 74, 105, 1)',
            },
            display: {
              xs: 'block',
              sm: 'none',
            },
          }}
          onClick={actionPopover.onOpen}
        >
          Action
        </Button>
      </Stack>
      {/* Mobile Action Popover */}
      <CustomPopover
        open={actionPopover.open}
        anchorEl={actionPopover.anchorEl}
        onClose={actionPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        {currentData && (
          <PermissionGuard
            fieldName="Add"
            currentData={currentData}
            permissionKeys={{
              both: savePermissionKeys?.create,
            }}
            isDisabledMode="both"
          >
            <MenuItem
              onClick={() => currentPath && router.push(currentPath)}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 1.5,
                px: 2,
                py: 1,
                my: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(63, 84, 115, 0.1)',
                },
              }}
            >
              Add
            </MenuItem>
          </PermissionGuard>
        )}

        {onParticularSearch && (
          <MenuItem
            onClick={() => onParticularSearch?.()}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 1.5,
              px: 2,
              py: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(63, 84, 115, 0.1)',
              },
            }}
          >
            Particular Search
          </MenuItem>
        )}

        <PermissionGuard
          fieldName="Save"
          currentData={currentData}
          permissionKeys={{
            create: savePermissionKeys?.create,
            edit: savePermissionKeys?.edit,
          }}
          isDisabledMode={saveDisabledMode}
        >
          <MenuItem
            onClick={() => {
              if (!currentData) {
                onSubmit();
              } else if (isdisable) {
                handleDisable?.();
              } else {
                onSubmit();
              }
            }}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 1.5,
              px: 2,
              py: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(63, 84, 115, 0.1)',
              },
            }}
          >
            {!currentData ? 'Save' : isdisable ? 'Update' : 'Save changes'}
          </MenuItem>
        </PermissionGuard>

        <MenuItem
          onClick={onExit}
          sx={{
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 1.5,
            px: 2,
            py: 1,
            my: 0.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
            },
          }}
        >
          Exit
        </MenuItem>
      </CustomPopover>

      {/* --------------------------- Right Side 💻 LAPTOP/DESKTOP 💻 --------------------------- */}

      <Stack
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
        direction="row"
        gap={1}
        alignItems={isMobile ? 'center' : 'flex-start'}
      >
        <Box display="flex" gap={1}>
          {currentData && (
            <PermissionGuard
              fieldName="Add"
              currentData={currentData}
              permissionKeys={{
                both: savePermissionKeys?.create,
              }}
              isDisabledMode="both"
            >
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
                onClick={() => currentPath && router.push(currentPath)}
              >
                Add
              </CommonButton>
            </PermissionGuard>
          )}
        </Box>

        {onParticularSearch && (
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
            onClick={() => onParticularSearch?.()}
          >
            PARTICULAR SEARCH
          </CommonButton>
        )}

        <Box display="flex" justifyContent="space-between" gap={1}>
          <PermissionGuard
            fieldName="Save"
            permissionKeys={{
              create: savePermissionKeys?.create,
              edit: savePermissionKeys?.edit,
            }}
            isDisabledMode={saveDisabledMode}
            currentData={currentData}
          >
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
          </PermissionGuard>

          {onExit && (
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
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default DoctorFormButtons;
