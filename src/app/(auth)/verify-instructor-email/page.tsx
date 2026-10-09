import { Suspense } from 'react';
import InstructorEmailVerificationForm from './InstructorEmailVerificationForm';

export default function VerifyInstructorEmailPage() {
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
      <InstructorEmailVerificationForm />
    </Suspense>
  );
}
