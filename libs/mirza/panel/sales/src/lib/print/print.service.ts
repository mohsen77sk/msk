import { Injectable } from '@angular/core';
import { PrintDocumentOptions } from './print-document-options.type';

@Injectable({ providedIn: 'root' })
export class PrintService {
  print(options: PrintDocumentOptions): boolean {
    const printWindow = window.open('', '_blank', options.windowFeatures ?? 'width=360,height=640');

    if (!printWindow) {
      return false;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${this._escapeHtml(options.title ?? 'Print')}</title>
          <meta charset="utf-8">
          <style>${options.styles ?? ''}</style>
        </head>
        <body>${options.html}</body>
      </html>
    `);
    printWindow.document.close();

    this._printWhenReady(printWindow, options.imageLoadTimeoutMs ?? 1500);

    return true;
  }

  private _printWhenReady(printWindow: Window, imageLoadTimeoutMs: number): void {
    const images = Array.from(printWindow.document.images);
    let hasPrinted = false;

    const print = () => {
      if (hasPrinted) {
        return;
      }

      hasPrinted = true;
      printWindow.focus();
      printWindow.print();
    };

    if (!images.length) {
      print();
      return;
    }

    let loadedImages = 0;
    const markLoaded = () => {
      loadedImages += 1;

      if (loadedImages === images.length) {
        print();
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        markLoaded();
        return;
      }

      image.onload = markLoaded;
      image.onerror = markLoaded;
    });

    window.setTimeout(print, imageLoadTimeoutMs);
  }

  private _escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
