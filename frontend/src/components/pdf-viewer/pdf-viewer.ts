export type ViewerOptions = {
  printAllowed?: boolean;
  downloadAllowed?: boolean;
  closeModal?: boolean;
  originalFilename?: string;
};

/**
 * Build a local PDF.js viewer URL with query params encoded.
 * Reusable across components that embed the viewer in an iframe.
 * This is a pure util and does NOT use React hooks. Pass explicit booleans
 * for permissions (e.g. from a permission helper).
 */
export function getLocalPDFViewerUrl(pdfUrl: string, opts?: ViewerOptions) {
  const encoded = encodeURIComponent(pdfUrl ?? '');
  const params = new URLSearchParams({ file: encoded });

  if (opts?.printAllowed !== undefined) {
    params.set('printAllowed', String(Boolean(opts.printAllowed)));
  }
  if (opts?.downloadAllowed !== undefined) {
    params.set('downloadAllowed', String(Boolean(opts.downloadAllowed)));
  }
  if (opts?.closeModal !== undefined) {
    params.set('closeModal', String(Boolean(opts.closeModal)));
  }
  if (opts?.originalFilename !== undefined && opts.originalFilename.length > 0) {
    params.set('originalFilename', encodeURIComponent(opts.originalFilename));
  }
  return `/web/viewer.html?${params.toString()}`;
}
