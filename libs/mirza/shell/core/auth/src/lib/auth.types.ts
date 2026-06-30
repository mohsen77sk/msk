export const AUTH_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface RegistrationOtpRequest {
  phone: string;
  otp: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface PasswordResetRequest {
  phone: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
