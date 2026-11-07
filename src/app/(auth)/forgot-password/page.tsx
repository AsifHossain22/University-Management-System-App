'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/hooks/auth.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import { forgotPasswordSchema } from '@/validation/auth.validation';

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    forgotPassword(data, {
      onSuccess: () => {
        toast.success('Request submitted', {
          description:
            'If an active account exists for this email, a password reset OTP has been sent.',
        });

        const email = encodeURIComponent(data.email.trim().toLowerCase());

        window.location.href = `/reset-password?email=${email}`;
      },
      onError: error => {
        toast.error(getApiErrorMessage(error));
      },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail size={26} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your registered email address. If an active account exists,
            we&apos;ll send you a password reset OTP.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Sending request...
              </>
            ) : (
              'Continue'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
