export const AUTH_TOKEN = 'accessToken';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  requiresTwoFactor: boolean;
}
