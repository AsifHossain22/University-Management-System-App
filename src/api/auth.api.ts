import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  AuthResponse,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from '@/types/auth.type';

// UserRegistration
export function userRegistration(payload: RegisterPayload) {
  return apiClient<ApiResponse<{ email: string; message: string }>>(
    '/auth/register',
    {
      method: 'POST',
      body: payload,
    },
  );
}

// VerifyEmail
export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<VerifyEmailResponse>>('/auth/verify-email', {
    method: 'POST',
    body: payload,
  });
}

// UserLogin
export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

// RefreshToken
export function refreshToken(payload: RefreshTokenPayload) {
  return apiClient<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token', {
    method: 'POST',
    body: payload,
  });
}

// GoogleOAuth
export function googleOAuth(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<AuthResponse>>('/auth/google', {
    method: 'POST',
    body: payload,
  });
}

// GetMe
export function getMe() {
  return apiClient<ApiResponse<User>>('/auth/me');
}

// UpdateMe
export function updateMe(payload: { firstName?: string; lastName?: string }) {
  return apiClient<ApiResponse<User>>('/auth/me', {
    method: 'PATCH',
    body: payload,
  });
}

// UpdateMePhoto
export function updateMePhoto(file: File) {
  const formData = new FormData();

  formData.append('profilePhoto', file);

  return apiClient<ApiResponse<User>>('/auth/me/photo', {
    method: 'PATCH',
    body: formData,
  });
}

// ForgotPassword
export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<{ email: string; message: string }>>(
    '/auth/forgot-password',
    {
      method: 'POST',
      body: payload,
    },
  );
}

// ResetPassword
export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<{ email: string; message: string }>>(
    '/auth/reset-password',
    {
      method: 'POST',
      body: payload,
    },
  );
}
