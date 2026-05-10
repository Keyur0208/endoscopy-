import type React from 'react';

import { useRef } from 'react';

import { Box } from '@mui/material';

import PageTitle from 'src/components/page-title';
import { Scrollbar } from 'src/components/scrollbar';
import DoctorFormButtons from 'src/components/button-group';

interface FixedHeaderFooterLayoutProps {
  currentPath?: string;
  isdisable?: boolean;
  title: string;
  formnumber?: string;
  children: React.ReactNode;
  currentData?: any;
  isSubmitting: boolean;
  onParticularSearch?: () => void;
  onSubmit: () => void;
  onExit?: () => void;
  handlePrevious?: () => void;
  handleNext?: () => void;
  handleDisable?: () => void;
}

const FixedHeaderFooterLayout: React.FC<FixedHeaderFooterLayoutProps> = ({
  currentPath,
  isdisable,
  title,
  formnumber,
  children,
  currentData,
  isSubmitting,
  onParticularSearch,
  onSubmit,
  handlePrevious,
  handleNext,
  handleDisable,
  onExit,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'background.paper',
        }}
      >
        <PageTitle title={title} />
      </Box>
      <Scrollbar fillContent>
        <Box
          ref={contentRef}
          sx={{
            padding: 2,
          }}
        >
          {children}
        </Box>
      </Scrollbar>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <DoctorFormButtons
          currentPath={currentPath}
          isdisable={isdisable}
          currentData={currentData}
          isSubmitting={isSubmitting}
          handlePrevious={handlePrevious}
          handleDisable={handleDisable}
          handleNext={handleNext}
          onParticularSearch={onParticularSearch}
          onSubmit={onSubmit}
          onExit={onExit}
        />
      </Box>
    </Box>
  );
};

export default FixedHeaderFooterLayout;
