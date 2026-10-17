export interface AppConfig {
  production: boolean;
  apiEndpoint: string;
  sentryDsn?: string;
  // Canonical public HTTPS origin of the frontend (used for shareable links such as QR codes)
  frontendOrigin?: string;
}
