import { useEffect } from 'react';

/**
 * Hook: listen for CLOSE_PDF_VIEWER postMessage from embedded viewer and call onClose.
 * Optionally restrict by allowedOrigin. Cleans up listener automatically.
 */
export function usePdfViewerClose(onClose: () => void, allowedOrigin?: string) {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      try {
        if (allowedOrigin && e.origin !== allowedOrigin) return;
      } catch (err) {
        // ignore origin check errors
      }
      const data = e.data as any;
      if (data?.type === 'CLOSE_PDF_VIEWER') {
        onClose();
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onClose, allowedOrigin]);
}
