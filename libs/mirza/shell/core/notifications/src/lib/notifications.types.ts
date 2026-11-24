/** A message pushed to every open panel of a store (socket.io `store-notification`). */
export interface StoreNotification {
  type: string;
  title: string;
  body: string;
  /** Panel path to open, e.g. /panel/sales/card/view/12 */
  url: string;
  tag?: string;
  storeId: number;
  at: string;
  data?: Record<string, unknown>;
}

export interface PushConfig {
  enabled: boolean;
  publicKey: string | null;
}

export interface PushStatus {
  subscribed: boolean;
  devices: number;
}
