export interface BaseResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface User {
  email: string;
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  profilePictureUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  path: string;
  error: string;
  message: string;
}
