import {
  forgotPassword,
  getMe,
  googleOAuth,
  refreshToken,
  resetPassword,
  userLogin,
  userRegistration,
  verifyEmail,
} from '@/api/auth.api';
import { useMutation, useQuery } from '@tanstack/react-query';

// UserRegistration
export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

// VerifyEmail
export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}

// UserLogin
export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

// RefreshToken
export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

// GoogleOAuth
export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

// ForgotPassword
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

// ResetPassword
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

// GetMe
export function useGetMe() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    retry: false,
  });
}
