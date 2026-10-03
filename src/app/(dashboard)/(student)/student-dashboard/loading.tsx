import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>
    </main>
  );
}
