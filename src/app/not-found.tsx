export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <p className="text-sm font-medium text-primary">404</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found!
        </h1>

        <p className="mt-2 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <a
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to home
      </a>
    </main>
  );
}
