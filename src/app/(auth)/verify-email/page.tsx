import { Suspense } from 'react';
import VerifyEmailForm from './VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <p className="text-sm text-muted-foreground">
            Loading verification...
          </p>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
