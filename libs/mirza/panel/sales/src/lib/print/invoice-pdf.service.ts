import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent, inject } from '@angular/core';
import { InvoiceLineItem, InvoicePrintData } from './invoice-print.types';
import { SaleInvoicePrintComponent } from './invoice-print.component';
import { InvoicePdfResult } from './invoice-pdf.types';

// A4 at 96dpi, matching the fixed width/height convention used throughout
// this feature (also documented in invoice-print.styles.ts).
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
// Buffer against sub-pixel rounding in the row-height measurements below,
// so a page's actual rendered content never risks spilling past A4 height.
const PAGE_SAFETY_MARGIN_PX = 8;
const CAPTURE_SCALE = 2;

interface PagePlan {
  items: InvoiceLineItem[];
  showPartyBoxes: boolean;
  showTotals: boolean;
}

/**
 * Renders SaleInvoicePrintComponent off-screen (in the live app DOM, not a
 * popup) and rasterizes it into a multi-page A4 PDF via html2canvas-pro +
 * jsPDF. Both libraries are dynamically imported so they never load until
 * a user actually asks for a PDF.
 */
@Injectable({ providedIn: 'root' })
export class SaleInvoicePdfService {
  private _appRef = inject(ApplicationRef);
  private _environmentInjector = inject(EnvironmentInjector);

  async generate(data: InvoicePrintData): Promise<InvoicePdfResult> {
    const [{ html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')]);

    const safeData = await this._withSafeLogo(data);
    const host = this._createOffscreenHost();
    const componentRef = createComponent(SaleInvoicePrintComponent, {
      environmentInjector: this._environmentInjector,
      hostElement: host,
    });
    this._appRef.attachView(componentRef.hostView);

    try {
      // First pass: render everything, full-height, purely to measure it.
      this._setPage(componentRef, safeData, { items: safeData.items, showPartyBoxes: true, showTotals: true }, null);
      await this._waitForRenderReady(host);

      const invoiceEl = this._requireInvoiceElement(host);
      const pagePlans = this._computePagePlans(invoiceEl, safeData);

      const pdf = new jsPDF({ unit: 'px', format: [A4_WIDTH_PX, A4_HEIGHT_PX], orientation: 'portrait' });
      const pageImageUrls: string[] = [];

      for (let index = 0; index < pagePlans.length; index++) {
        const plan = pagePlans[index];
        const pageInfo = pagePlans.length > 1 ? { index: index + 1, count: pagePlans.length } : null;

        this._setPage(componentRef, safeData, plan, pageInfo);
        await this._nextFrame();

        const pageEl = this._requireInvoiceElement(host);
        const pageHeightPx = pageEl.getBoundingClientRect().height;

        const canvas = await html2canvas(pageEl, {
          scale: CAPTURE_SCALE,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        });

        if (index > 0) {
          pdf.addPage([A4_WIDTH_PX, A4_HEIGHT_PX], 'portrait');
        }
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, A4_WIDTH_PX, pageHeightPx);

        pageImageUrls.push(await this._canvasToObjectUrl(canvas));
      }

      return {
        pdfBlob: pdf.output('blob'),
        pageImageUrls,
        fileName: `factor-${safeData.saleNumber}.pdf`,
        pageCount: pagePlans.length,
      };
    } finally {
      this._appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      host.remove();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createOffscreenHost(): HTMLElement {
    const host = document.createElement('div');
    // Positioned outside the viewport (not display:none / visibility:hidden)
    // so it's actually laid out and paintable for html2canvas to capture.
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.insetInlineStart = '-10000px';
    host.style.width = `${A4_WIDTH_PX}px`;
    host.style.pointerEvents = 'none';
    document.body.appendChild(host);
    return host;
  }

  private _requireInvoiceElement(host: HTMLElement): HTMLElement {
    const el = host.querySelector('.sale-invoice-print') as HTMLElement | null;

    if (!el) {
      throw new Error('Sale invoice element not found for PDF rendering');
    }

    return el;
  }

  private _setPage(
    componentRef: ComponentRef<SaleInvoicePrintComponent>,
    data: InvoicePrintData,
    plan: PagePlan,
    pageInfo: { index: number; count: number } | null,
  ): void {
    componentRef.setInput('data', data);
    componentRef.setInput('pageItems', plan.items);
    componentRef.setInput('showPartyBoxes', plan.showPartyBoxes);
    componentRef.setInput('showTotals', plan.showTotals);
    componentRef.setInput('pageInfo', pageInfo);
    componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Fetches the logo and inlines it as a data URL before rendering, since
   * store logos are served from Cloudflare R2 - a different origin than the
   * app - and would otherwise taint the canvas. Falls back to no logo
   * (rather than failing the export) if the fetch fails for any reason.
   */
  private async _withSafeLogo(data: InvoicePrintData): Promise<InvoicePrintData> {
    if (!data.storeLogoUrl) {
      return data;
    }

    const dataUrl = await this._fetchAsDataUrl(data.storeLogoUrl).catch(() => null);

    const clone = Object.create(Object.getPrototypeOf(data)) as InvoicePrintData;
    Object.assign(clone, data);
    clone.storeLogoUrl = dataUrl ?? undefined;

    return clone;
  }

  private async _fetchAsDataUrl(url: string): Promise<string> {
    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Failed to fetch logo (${response.status})`);
    }

    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private async _waitForRenderReady(host: HTMLElement): Promise<void> {
    await document.fonts.ready;
    await this._waitForImages(host);
    await this._nextFrame();
  }

  private _waitForImages(host: HTMLElement): Promise<void> {
    const images = Array.from(host.querySelectorAll('img'));

    if (!images.length) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let remaining = images.length;
      let settled = false;

      const done = () => {
        remaining -= 1;
        if (remaining <= 0 && !settled) {
          settled = true;
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          done();
          return;
        }
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });

      // A stuck image (rare, given the logo is already a data URL by this
      // point) can't hang PDF generation forever.
      window.setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve();
        }
      }, 3000);
    });
  }

  private _nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  private _canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to encode invoice page image'));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  }

  /**
   * Splits the invoice's items into physical A4 pages by measuring the
   * already-rendered (full, unpaginated) DOM: the fixed header+party-boxes
   * height (page 1 only), the repeating table-header height, each row's own
   * height (so a row is never split across pages), and the totals block's
   * height (reserved on the last page only).
   */
  private _computePagePlans(invoiceEl: HTMLElement, data: InvoicePrintData): PagePlan[] {
    const items = data.items;

    if (items.length === 0) {
      return [{ items: [], showPartyBoxes: true, showTotals: true }];
    }

    const rootTop = invoiceEl.getBoundingClientRect().top;
    const partyBoxes = invoiceEl.querySelectorAll('.sale-invoice-print__party-box');
    const lastPartyBox = partyBoxes[partyBoxes.length - 1] as HTMLElement | undefined;
    const theadEl = invoiceEl.querySelector('.sale-invoice-print__items thead') as HTMLElement;
    const itemsTableEl = invoiceEl.querySelector('.sale-invoice-print__items') as HTMLElement;
    const rowEls = Array.from(invoiceEl.querySelectorAll('.sale-invoice-print__items tbody tr')) as HTMLElement[];
    const totalsEl = invoiceEl.querySelector('.sale-invoice-print__totals') as HTMLElement | null;

    const headAndPartyBoxesHeight = lastPartyBox ? lastPartyBox.getBoundingClientRect().bottom - rootTop : 0;
    const tableHeaderHeight = theadEl.getBoundingClientRect().height;
    const totalsHeight = totalsEl
      ? totalsEl.getBoundingClientRect().bottom - itemsTableEl.getBoundingClientRect().bottom
      : 0;
    const rowHeights = rowEls.map((row) => row.getBoundingClientRect().height);

    const computedStyle = getComputedStyle(invoiceEl);
    const containerPaddingPx = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    const pageContentBudget = A4_HEIGHT_PX - containerPaddingPx - PAGE_SAFETY_MARGIN_PX;

    const pages: PagePlan[] = [];
    let startIndex = 0;

    while (startIndex < items.length) {
      const isFirstPage = pages.length === 0;
      const fixedHeight = (isFirstPage ? headAndPartyBoxesHeight : 0) + tableHeaderHeight;
      const availableForRows = pageContentBudget - fixedHeight;

      let usedHeight = 0;
      let endIndex = startIndex;

      while (endIndex < items.length) {
        const rowHeight = rowHeights[endIndex];
        const isLastRowOverall = endIndex === items.length - 1;
        const reserveForTotals = isLastRowOverall ? totalsHeight : 0;
        const projected = usedHeight + rowHeight + reserveForTotals;

        if (projected > availableForRows && endIndex > startIndex) {
          break;
        }

        usedHeight += rowHeight;
        endIndex++;
      }

      // Always take at least one row, even if it alone overflows the
      // budget (an unusually tall row) - avoids an infinite loop.
      if (endIndex === startIndex) {
        endIndex = startIndex + 1;
      }

      const isLastPage = endIndex >= items.length;

      pages.push({
        items: items.slice(startIndex, endIndex),
        showPartyBoxes: isFirstPage,
        showTotals: isLastPage,
      });

      startIndex = endIndex;
    }

    return pages;
  }
}
