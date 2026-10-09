'use client';

import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { useVerifyInstructorEmail } from '@/hooks/instructor-application.hook';
import { getApiErrorMessage } from '@/lib/api-error';

const instructorEmailVerificationSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

type InstructorEmailVerificationValues = z.infer<
  typeof instructorEmailVerificationSchema
>;

export default function InstructorEmailVerificationForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const { mutate: verifyEmail, isPending: verificationPending } =
    useVerifyInstructorEmail();

  const form = useForm({
    defaultValues: {
      email,
      otp: '',
    },
    validators: {
      onSubmit: instructorEmailVerificationSchema,
    },
    onSubmit: async ({ value }) => {
      verifyEmail(
        {
          email: value.email.trim().toLowerCase(),
          otp: value.otp,
        },
        {
          onSuccess: response => {
            toast.success('Email verified successfully.', {
              description:
                'Your instructor application is now awaiting administrator approval.',
            });

            // IntentionallyDoNotStoreTokensOrLogTheApplicantIn
            form.reset();

            // ShowConfirmationScreenAfterSuccessfulVerification
            // ApplicationItselfRemainsPendingUntilAdminReviewsIt
            sessionStorage.setItem(
              'instructor-application-verified-email',
              response.data.email,
            );

            window.location.replace(
              `/instructor-application-submitted?email=${encodeURIComponent(
                response.data.email,
              )}`,
            );
          },
          onError: error => {
            toast.error(getApiErrorMessage(error));
          },
        },
      );
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
            Enter the 6-digit code sent to the email address used in your
            instructor application.
          </p>

          {email && <p className="mt-3 text-sm font-medium">{email}</p>}
        </div>

        <form
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
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
                      onChange={event => field.handleChange(event.target.value)}
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
                      onChange={event =>
                        field.handleChange(
                          event.target.value.replace(/\D/g, '').slice(0, 6),
                        )
                      }
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
              disabled={verificationPending || !email}
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

        {!email && (
          <p className="mt-4 text-center text-sm text-destructive">
            The email address is missing. Please start your instructor
            application again.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need to return to registration?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Back to registration
          </Link>
        </p>
      </div>
    </main>
  );
}
