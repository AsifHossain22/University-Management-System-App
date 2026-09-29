import Link from 'next/link';
import { features, roles } from '../data/data';

export default function HomePage() {
  return (
    <>
      {/* HeroSection */}
      <section className="border-b">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center lg:text-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                University Management System
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Manage your university operations with confidence.
              </h1>

              <p className="mt-6 max-w-xl mx-auto text-lg leading-8 text-muted-foreground">
                A modern platform designed to connect students, instructors and
                administrators through one centralized university management
                system.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center lg:justify-start gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>

              <Link
                href="/features"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Explore features
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-muted/40 p-8 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border bg-background p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Students
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Academic management
                  </p>
                </div>

                <div className="rounded-xl border bg-background p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Instructors
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Teaching management
                  </p>
                </div>

                <div className="rounded-xl border bg-background p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Administrators
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    University operations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FeatureSection */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Core capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage university operations
            </h2>

            <p className="mt-4 text-muted-foreground">
              A centralized system for academic management, administration,
              communication and student services.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <article
                key={feature.title}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RoleBasedExperience */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Built for every role
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One platform, three focused experiences
            </h2>

            <p className="mt-4 text-muted-foreground">
              Each role gets access to the tools and information needed to
              perform its responsibilities effectively.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {roles.map(role => (
              <article
                key={role.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{role.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CallToAction */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to manage your university experience?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Access the university management platform and stay connected with
            everything you need for your academic journey.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>

            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore the system
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
