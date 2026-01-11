import apiClient from './client';
import type {
  BaseResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  AuthResponse, User
} from '@/lib/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<BaseResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<BaseResponse<User>>('/auth/register', data);
    return response.data.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
    const response = await apiClient.post<BaseResponse<string>>('/auth/reset-password', data);
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<BaseResponse<AuthResponse>>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<BaseResponse<AuthResponse['user']>>('/auth/me');
    return response.data.data;
  },
};

export default authService;
