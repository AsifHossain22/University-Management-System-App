'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock3 } from 'lucide-react';

function InstructorApplicationSubmittedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
          <CheckCircle2 className="size-9" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Email verified successfully!
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your instructor application has been submitted successfully.
          {email ? (
            <>
              {' '}
              We verified the email address{' '}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : null}
        </p>

        <div className="mt-6 rounded-lg border p-4 text-left">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-1 size-5 shrink-0 text-amber-600" />

            <div>
              <h2 className="font-semibold">Awaiting administrator approval</h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                An administrator must review your application before your
                instructor account is created. You cannot log in as an
                instructor until your application is approved.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          You can return to the login page, but you will need to wait for
          approval before using an instructor account.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to login
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">
          Please wait for an update from the university administrator.
        </p>
      </div>
    </main>
  );
}

export default function InstructorApplicationSubmittedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <p className="text-sm text-muted-foreground">
            Loading application status...
          </p>
        </main>
      }
    >
      <InstructorApplicationSubmittedContent />
    </Suspense>
  );
}
