import { useMutation } from '@tanstack/react-query';
import {
  applyAsInstructor,
  verifyInstructorEmail,
} from '@/api/instructor-application.api';

export function useApplyAsInstructor() {
  return useMutation({
    mutationFn: applyAsInstructor,
  });
}

export function useVerifyInstructorEmail() {
  return useMutation({
    mutationFn: verifyInstructorEmail,
  });
}
