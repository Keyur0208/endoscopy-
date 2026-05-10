import type { ViewerOptions } from 'src/components/pdf-viewer/pdf-viewer';

import React from 'react';

import { Box, Dialog } from '@mui/material';

import { getLocalPDFViewerUrl } from 'src/components/pdf-viewer/pdf-viewer';

type PdfViewerDialogProps = {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
  options?: ViewerOptions;
  title?: string;
  fullScreen?: boolean;
  iframeStyle?: React.CSSProperties;
};

export default function PdfViewerDialog({
  open,
  onClose,
  pdfUrl,
  options,
  title = 'PDF Viewer',
  fullScreen = true,
  iframeStyle,
}: PdfViewerDialogProps) {
  const src = getLocalPDFViewerUrl(pdfUrl, options);

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          <iframe
            title={title}
            src={src}
            style={{ width: '100%', height: '100%', border: 'none', ...(iframeStyle || {}) }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
