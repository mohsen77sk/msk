export interface ReceiptPrintData {
  storeName: string;
  storeLogoUrl?: string;
  saleNumber: string;
  saleDate?: Date;
  customerName?: string;
  items: ReceiptPrintItem[];
  discount: number;
  total: number;
  payments: ReceiptPrintPayment[];
  footerText: string;
}

export interface ReceiptPrintItem {
  productName: string;
  quantity: number;
  unit?: string;
  total: number;
}

export interface ReceiptPrintPayment {
  name: string;
  value: number;
}
