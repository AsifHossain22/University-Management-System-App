'use client';

import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useVerifyEmail } from '@/hooks/auth.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import { setAuthTokens } from '@/lib/auth-storage';
import { useAuth } from '@/providers/auth.provider';
import { verifyEmailSchema } from '@/validation/auth.validation';

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const email = searchParams.get('email') ?? '';

  const { mutate: verifyEmail, isPending: verificationPending } =
    useVerifyEmail();

  const defaultValues: VerifyEmailFormValues = {
    email,
    otp: '',
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      verifyEmail(value, {
        onSuccess: response => {
          const { accessToken, refreshToken, user } = response.data;

          setAuthTokens(accessToken, refreshToken);
          setUser(user);

          toast.success('Email verified successfully.', {
            description: `Welcome to the University Management System, ${user.firstName}!`,
          });

          if (user.role === 'STUDENT') {
            router.push('/student-dashboard');
            return;
          }

          if (user.role === 'INSTRUCTOR') {
            router.push('/instructor-dashboard');
            return;
          }

          if (user.role === 'ADMIN') {
            router.push('/admin-dashboard');
            return;
          }
        },

        onError: error => {
          toast.error(getApiErrorMessage(error));
        },
      });
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to your email.
          </p>

          {email && <p className="mt-2 text-sm font-medium">{email}</p>}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <FieldGroup>
            <form.Field name="email">
              {field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      readOnly
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="otp">
              {field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Verification code
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="one-time-code"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Button
              type="submit"
              className="w-full"
              disabled={verificationPending}
            >
              {verificationPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify email'
              )}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </main>
  );
}
