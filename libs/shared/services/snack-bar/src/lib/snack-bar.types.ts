export interface MskSnackBarConfig {
  title?: string;
  message: string;
  dismissible: boolean;
  type: 'basic' | 'info' | 'success' | 'warning' | 'error';
}
