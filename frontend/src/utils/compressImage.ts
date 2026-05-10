import { CONFIG } from 'src/config-global';

export const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<File> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');

        // Determine if image has transparency (PNG, WebP, GIF)
        const hasTransparency =
          file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
        const outputType = hasTransparency ? file.type : 'image/jpeg';

        // For non-transparent images (JPEG), fill with white background
        if (!hasTransparency && ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], file.name, {
                  type: outputType,
                  lastModified: Date.now(),
                })
              );
            } else {
              resolve(file); // Fallback to original if compression fails
            }
          },
          outputType,
          quality
        );
      };
    };
    reader.readAsDataURL(file);
  });

export function getPreviewImage(value?: string) {
  if (!value) return '';

  // base64 image
  if (value.startsWith('data:image')) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // relative path → prepend server URL
  return `${CONFIG.site.serverUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
}
