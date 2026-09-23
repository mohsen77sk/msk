const INVOICE_BLUE = '#1d4ed8';
const INVOICE_BLUE_LIGHT = '#dbeafe';
const INVOICE_BLUE_ZEBRA = '#eff6ff';

/**
 * A4 invoice stylesheet. A function (not a plain constant) because it needs
 * the app's own origin to load the IRANSansX webfont into the print popup -
 * a separate document.write()'d document that doesn't inherit the app's
 * stylesheets. @import inside a <style> block resolves the imported
 * stylesheet's own relative font URLs against ITS location, not the
 * popup's, so this works regardless of the popup's blank starting origin.
 */
export function getSaleInvoicePrintStyles(): string {
  const fontHref = `${window.location.origin}/assets/fonts/IRANSansX/fontiran.css`;

  return `
    @import url('${fontHref}');

    @page {
      size: A4 portrait;
      margin: 14mm 12mm;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      color: #111827;
      background: #fff;
      font-family: IRANSansX, sans-serif;
      font-size: 12px;
      line-height: 1.6;
    }

    * {
      box-sizing: border-box;
    }

    .sale-invoice-print {
      width: 100%;
      direction: rtl;
      color: #111827;
      background: #fff;
      padding: 6mm;
    }

    .sale-invoice-print__header {
      display: flex;
      direction: rtl;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8mm;
      padding-bottom: 4mm;
      margin-bottom: 6mm;
      border-bottom: 2px solid ${INVOICE_BLUE};
    }

    .sale-invoice-print__header-side {
      flex: 1 1 0;
      min-width: 0;
    }

    .sale-invoice-print__header-center {
      flex: 1.4 1 0;
      text-align: center;
    }

    .sale-invoice-print__header-meta {
      text-align: left;
    }

    .sale-invoice-print__logo {
      max-width: 34mm;
      max-height: 18mm;
      object-fit: contain;
    }

    .sale-invoice-print__title {
      font-size: 11px;
      font-weight: 600;
      color: ${INVOICE_BLUE};
    }

    .sale-invoice-print__store-name {
      margin-top: 1mm;
      font-size: 18px;
      font-weight: 700;
    }

    .sale-invoice-print__meta-row {
      font-size: 12px;
      margin-bottom: 1mm;
    }

    .sale-invoice-print__party-box {
      display: flex;
      direction: rtl;
      border: 1px solid ${INVOICE_BLUE_LIGHT};
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 4mm;
    }

    .sale-invoice-print__party-tab {
      flex: none;
      width: 8mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${INVOICE_BLUE};
      color: #fff;
      font-weight: 700;
      font-size: 12px;
    }

    .sale-invoice-print__party-tab span {
      display: inline-block;
      white-space: nowrap;
      transform: rotate(-90deg);
    }

    .sale-invoice-print__party-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.2mm;
      padding: 3mm 4mm;
    }

    .sale-invoice-print__party-row {
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      border-bottom: 1px dotted #e2e8f0;
      padding-bottom: 1mm;
    }

    .sale-invoice-print__party-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .sale-invoice-print__party-label {
      flex: none;
      color: #4b5563;
      font-weight: 600;
    }

    .sale-invoice-print__party-value {
      text-align: left;
      overflow-wrap: anywhere;
    }

    .sale-invoice-print__items {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2mm;
      margin-bottom: 5mm;
    }

    .sale-invoice-print__items thead tr {
      background: ${INVOICE_BLUE};
      color: #fff;
    }

    .sale-invoice-print__items th {
      padding: 2.5mm 2mm;
      font-weight: 600;
      font-size: 12px;
      text-align: right;
    }

    .sale-invoice-print__items td {
      padding: 2mm;
      font-size: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .sale-invoice-print__items tbody tr:nth-child(even) {
      background: ${INVOICE_BLUE_ZEBRA};
    }

    .sale-invoice-print__items tbody tr:last-child td {
      border-bottom: 1px solid ${INVOICE_BLUE_LIGHT};
    }

    .sale-invoice-print__col-row,
    .sale-invoice-print__col-num {
      text-align: center;
      white-space: nowrap;
    }

    .sale-invoice-print__totals {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5mm;
    }

    .sale-invoice-print__totals-row {
      display: flex;
      justify-content: space-between;
      gap: 4mm;
      font-size: 12px;
    }

    .sale-invoice-print__totals-final {
      margin-top: 1.5mm;
      padding: 2.5mm 3mm;
      background: ${INVOICE_BLUE_LIGHT};
      border-radius: 3px;
      font-size: 14px;
      font-weight: 700;
      color: ${INVOICE_BLUE};
    }

    .sale-invoice-print__page-number {
      margin-top: 4mm;
      text-align: center;
      font-size: 10px;
      color: #6b7280;
    }

    @media print {
      html,
      body {
        width: 100%;
      }

      body * {
        visibility: hidden;
      }

      .sale-invoice-print,
      .sale-invoice-print * {
        visibility: visible;
      }

      .sale-invoice-print {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
      }
    }
  `;
}
