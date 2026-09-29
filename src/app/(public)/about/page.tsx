export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            About the system
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A centralized platform for modern university management
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            The University Management System brings academic, administrative,
            and student services together in one structured platform designed
            for administrators, students and instructors.
          </p>
        </div>
      </section>

      {/* Purpose */}
      <section className="border-b py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our purpose
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One system for connected university operations
            </h2>

            <p className="mt-4 text-muted-foreground">
              A centralized platform designed to bring academic and
              administrative workflows together in one connected environment.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">Connected Operations</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                University operations involve many connected processes, from
                managing courses and sections to handling registrations,
                attendance, examinations, results, fees and payments.
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">Role-Based Management</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The platform provides a centralized environment where university
                processes can be managed through role-specific experiences and
                controlled access.
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold">Consistent Experience</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The goal is to make academic and administrative information
                easier to manage, access and organize while maintaining a
                consistent experience across the platform.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Designed around roles
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the people who use the system
            </h2>

            <p className="mt-4 text-muted-foreground">
              Different users need different tools, permissions and information.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Students</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Access academic information, register for courses, monitor
                attendance, view examinations and results and manage fees and
                payments.
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Instructors</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Manage assigned sections, monitor students, record attendance,
                manage examinations and results and review academic statistics.
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Administrators</h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Manage users, departments, programs, courses, semesters,
                sections, fees, payments, applications and system records.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A foundation for a connected academic experience
          </h2>

          <p className="mt-4 text-muted-foreground">
            The platform is designed to bring university workflows together
            while keeping access organized around each user's role and
            responsibilities.
          </p>
        </div>
      </section>
    </>
  );
}
