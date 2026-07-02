export const AUTH_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  hasStore: boolean;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  code: string;
}

export interface ResetPasswordRequest {
  phone: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}
