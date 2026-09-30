export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

export type StudentProfile = {
  studentId: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT';
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type VerifyEmailResponse = AuthResponse & {
  studentProfile: StudentProfile;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
