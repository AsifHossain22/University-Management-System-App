import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-destructive/10 p-4">
          <ShieldAlert className="size-8 text-destructive" />
        </div>

        <div>
          <h1 className="text-lg font-semibold">
            You do not have access to this page
          </h1>

          <p className="text-muted-foreground">
            Go back to{' '}
            <Link href="/" className="underline hover:text-foreground">
              home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
