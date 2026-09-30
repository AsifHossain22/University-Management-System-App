export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contact us
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            We&apos;re here to help
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Have a question about the university management platform? Get in
            touch with us and we&apos;ll help you find the information you need.
          </p>
        </div>
      </section>

      {/* ContactInformation */}
      <section className="border-b py-16 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h2 className="text-lg font-semibold">Email</h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Send us your questions and we&apos;ll get back to you with the
                information you need.
              </p>

              <p className="mt-4 text-sm font-medium text-primary">
                support@universityms.com
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h2 className="text-lg font-semibold">Phone</h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                For direct assistance, contact the university management support
                team.
              </p>

              <p className="mt-4 text-sm font-medium text-primary">
                +971 123456789
              </p>
            </article>

            <article className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <h2 className="text-lg font-semibold">Office</h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Our support team is available to help with platform-related
                questions and assistance.
              </p>

              <p className="mt-4 text-sm font-medium text-primary">
                University Management Office
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ContactForm */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Send a message
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How can we help?
            </h2>

            <p className="mt-4 text-muted-foreground">
              Send us a message and provide the details we need to understand
              your question.
            </p>
          </div>

          <div className="mt-10 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is your question about?"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="flex min-h-32 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Need help with the platform?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Explore the platform features to understand how academic and
            administrative workflows are organized.
          </p>
        </div>
      </section>
    </>
  );
}
