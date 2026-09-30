import Link from 'next/link';
import {
  academicExperience,
  academicSteps,
  programAreas,
} from '@/app/data/data';

export default function ProgramsPage() {
  return (
    <>
      {/* ProgramAreas */}
      <section className="border-b py-16 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Program areas
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Academic pathways across different disciplines
            </h2>

            <p className="mt-4 text-muted-foreground">
              The platform can support different academic areas while keeping
              their programs and courses organized within a common structure.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {programAreas.map(area => (
              <article
                key={area.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{area.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicPrograms */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Academic programs
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore structured academic programs
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Discover how departments, programs, courses, semesters and sections
            come together to organize the university&apos;s academic experience.
          </p>
        </div>
      </section>

      {/* AcademicStructure */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Academic structure
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From departments to course sections
            </h2>

            <p className="mt-4 text-muted-foreground">
              A structured academic hierarchy helps keep university data
              connected and easier to manage.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {academicSteps.map(step => (
              <article
                key={step.number}
                className="rounded-xl border bg-card p-6 shadow-sm w-full md:w-[30%]"
              >
                <span className="text-sm font-semibold text-primary">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicExperience */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Academic experience
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than a list of programs
            </h2>

            <p className="mt-4 text-muted-foreground">
              Academic programs connect to the wider university workflow, giving
              students and instructors structured tools throughout the academic
              journey.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academicExperience.map(item => (
              <article
                key={item.title}
                className="rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Explore the platform
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See how the complete system works
          </h2>

          <p className="mt-4 text-muted-foreground">
            Explore the platform and discover how academic and administrative
            workflows work together in one university management system.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore features
            </Link>

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
