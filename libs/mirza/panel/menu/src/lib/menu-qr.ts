import { encode, renderSVG } from 'uqr';

// Medium-high error correction and a 4-module quiet zone keep printed codes scannable.
const QR_OPTIONS = { ecc: 'Q', border: 4 } as const;
const QR_PNG_MIN_SIZE = 1024;

export interface MenuQrCode {
  png: string;
  svg: string;
}

/**
 * Public URL of a store's menu, or null when it has no slug yet
 *
 * @param origin frontend origin (app config `frontendOrigin`)
 * @param slug
 */
export function menuPublicUrl(origin: string | undefined, slug: string | null): string | null {
  return slug && origin ? `${origin}/menu/${slug}` : null;
}

/**
 * Render the QR code of a URL as a PNG data URL (white background, >= 1024px) and an SVG string
 *
 * @param document
 * @param url
 */
export function renderMenuQrCode(document: Document, url: string): MenuQrCode | null {
  const qr = encode(url, QR_OPTIONS);
  const scale = Math.ceil(QR_PNG_MIN_SIZE / qr.size);
  const canvas = document.createElement('canvas');
  canvas.width = qr.size * scale;
  canvas.height = qr.size * scale;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000000';
  qr.data.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) {
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }),
  );

  return { png: canvas.toDataURL('image/png'), svg: renderSVG(url, QR_OPTIONS) };
}

/**
 * Download a menu QR code as `menu-qr-<slug>.<format>`
 *
 * @param document
 * @param qrCode
 * @param slug
 * @param format
 */
export function downloadMenuQrCode(document: Document, qrCode: MenuQrCode, slug: string, format: 'png' | 'svg'): void {
  const href = format === 'png' ? qrCode.png : URL.createObjectURL(new Blob([qrCode.svg], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = href;
  link.download = `menu-qr-${slug}.${format}`;
  link.click();

  if (format === 'svg') {
    setTimeout(() => URL.revokeObjectURL(href));
  }
}
