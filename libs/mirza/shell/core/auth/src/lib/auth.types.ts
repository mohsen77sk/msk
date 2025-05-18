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
