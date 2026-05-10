/**
 * Utility functions for PDF operations
 */

/**
 * Converts a Blob to base64 string
 * @param blob - The blob to convert
 * @returns Promise<string> - Pure base64 string (without data URL prefix)
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
  return btoa(binaryString);
}

/**
 * Converts a Blob to data URL (with prefix)
 * @param blob - The blob to convert
 * @returns Promise<string> - Data URL string
 */
export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Creates a downloadable link for a blob
 * @param blob - The blob to download
 * @param fileName - The name for the downloaded file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
