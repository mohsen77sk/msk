export interface InvoicePdfResult {
  pdfBlob: Blob;
  /** Object URLs for the rendered page images - caller must revoke them. */
  pageImageUrls: string[];
  fileName: string;
  pageCount: number;
}
