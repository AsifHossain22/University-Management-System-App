import { Building2, GraduationCap, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and monitor the university system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <div className="mb-4 flex items-center gap-3">
            <Building2 className="size-5" />
            <h2 className="font-semibold">Departments</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage university departments.
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <div className="mb-4 flex items-center gap-3">
            <GraduationCap className="size-5" />
            <h2 className="font-semibold">Programs</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage academic programs.
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <div className="mb-4 flex items-center gap-3">
            <Users className="size-5" />
            <h2 className="font-semibold">Users</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor university users.
          </p>
        </div>
      </div>
    </main>
  );
}
