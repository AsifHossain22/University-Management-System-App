'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <p className="text-sm font-medium text-destructive">500</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>

        <p className="mt-2 max-w-md text-muted-foreground">
          We couldn't load this page. Please try again.
        </p>
      </div>

      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </main>
  );
}
