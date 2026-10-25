import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="space-y-8">
        {/* WelcomeSection */}
        <section className="space-y-4 rounded-2xl border bg-card p-6 sm:p-8">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-5 w-full max-w-xl" />

          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="size-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </section>

        {/* ProfileSection */}
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-5 rounded-xl border p-6 sm:flex-row sm:p-8 lg:col-span-2">
              <Skeleton className="size-24 shrink-0 rounded-full" />
              <div className="flex w-full flex-col items-center gap-3 sm:items-start">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-48 max-w-full" />
                <Skeleton className="h-4 w-64 max-w-full" />
                <Skeleton className="h-9 w-40" />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border p-6">
              <Skeleton className="size-11 rounded-xl" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </section>

        {/* ContactInformation */}
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border p-5"
              >
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full max-w-48" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QuickAccess */}
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-4 rounded-xl border p-5">
                <Skeleton className="size-11 rounded-xl" />
                <Skeleton className="h-5 w-36 max-w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </section>

        {/* EditProfile */}
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>

          <div className="space-y-6 rounded-xl border p-6">
            <Skeleton className="h-5 w-40" />
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </section>
      </div>
    </main>
  );
}
