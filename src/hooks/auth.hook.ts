import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  updateMe,
  updateMePhoto,
  userLogin,
  userLogout,
  userRegistration,
  verifyEmail,
} from "@/api/auth.api";

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

// UserLogout
export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
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
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// UpdateMe
export function useUpdateMe() {
  return useMutation({
    mutationFn: updateMe,
  });
}

// UpdateMePhoto
export function useUpdateMePhoto() {
  return useMutation({
    mutationFn: updateMePhoto,
  });
}
