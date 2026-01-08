'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import authService from '@/lib/api/auth-service';
import type { LoginRequest, RegisterRequest, ResetPasswordRequest } from '@/lib/types/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, setLoading, logout: clearAuth } = useAuthStore();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.tokens);
      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.tokens);
      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setLoading(true);
    try {
      await authService.resetPassword(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Reset password failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    clearAuth();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    resetPassword,
    logout,
  };
}
