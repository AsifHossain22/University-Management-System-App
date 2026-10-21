'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

type SubmissionStatus = 'success' | 'error' | null;

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactApiResponse = {
  success: boolean;
  message: string;
  data: null;
};

const contactMethods = [
  {
    icon: Mail,
    title: 'Email support',
    description:
      'Have a question about the platform? Reach out to our support team.',
    value: 'support@universityms.com',
    href: 'mailto:support@universityms.com',
    action: 'Send an email',
  },
  {
    icon: Phone,
    title: 'Phone assistance',
    description: 'Prefer a direct conversation? Contact the team by phone.',
    value: '+971 123456789',
    href: 'tel:+971123456789',
    action: 'Call our team',
  },
  {
    icon: MapPin,
    title: 'Our office',
    description:
      'Learn more about our platform and how it supports academic operations.',
    value: 'University Management Office',
    href: null,
    action: null,
  },
];

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactFormData = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    setIsSubmitting(true);
    setSubmissionMessage('');
    setSubmissionStatus(null);

    try {
      const response = await apiClient<ContactApiResponse>('/contact', {
        method: 'POST',
        body: payload,
      });

      if (!response.success) {
        throw new Error(response.message || 'Unable to send your message.');
      }

      setSubmissionStatus('success');
      setSubmissionMessage(
        'Your message has been sent successfully. Thank you for contacting us! Our team will get back to you if a response is needed.',
      );

      form.reset();
    } catch (error: unknown) {
      setSubmissionStatus('error');

      const message = error instanceof Error ? error.message : '';

      if (message.toLowerCase().includes('too many')) {
        setSubmissionMessage(
          'You have submitted too many messages. Please wait a little while before trying again.',
        );
      } else if (
        message.toLowerCase().includes('fetch') ||
        message.toLowerCase().includes('network')
      ) {
        setSubmissionMessage(
          'We could not connect to the server. Please check your internet connection and try again.',
        );
      } else {
        setSubmissionMessage(
          'We could not send your message right now. Please try again later or contact us directly by email.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
              <MessageCircle className="size-4" />
              Contact our team
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              We&apos;re here to help you{' '}
              <span className="text-primary">move forward.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Have a question about the University Management System? Whether
              you&apos;re exploring the platform or need help understanding its
              features, we&apos;re here to point you in the right direction.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Send us a message
                <ArrowRight className="size-4" />
              </a>

              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore features
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Platform-related support
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4 text-primary" />
                Clear, direct communication
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
            <div className="relative rounded-2xl border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-6" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                Let&apos;s get you the right answer.
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Tell us what you need help with and choose the most convenient
                way to get in touch.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex gap-3 rounded-xl border bg-muted/30 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">General enquiries</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Questions about the platform and its capabilities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border bg-muted/30 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                    <Clock3 className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">A clear next step</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Explore the available resources or contact us directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ContactMethods */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Get in touch
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose how to reach us
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Find the contact option that works best for you.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contactMethods.map(method => {
              const Icon = method.icon;

              return (
                <article
                  key={method.title}
                  className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{method.title}</h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                    {method.description}
                  </p>

                  <p className="mt-5 break-words text-sm font-semibold">
                    {method.value}
                  </p>

                  {method.href && method.action ? (
                    <a
                      href={method.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:opacity-80"
                    >
                      {method.action}
                      <ArrowRight className="size-4" />
                    </a>
                  ) : (
                    <p className="mt-5 text-sm text-muted-foreground">
                      Platform information and guidance
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ContactForm */}
      <section
        id="contact-form"
        className="scroll-mt-20 border-y bg-muted/30 py-8 sm:py-10"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <div className="lg:pt-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Send a message
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How can we help?
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              Share your question or feedback. Providing a clear subject and
              enough detail makes it easier to understand what you need.
            </p>

            <div className="mt-8 rounded-xl border bg-card p-5">
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Your information matters</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Only include information relevant to your enquiry. Do not
                    share passwords, payment credentials or other sensitive
                    account details.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                Need to understand the platform first?
              </p>
              <Link
                href="/about"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
              >
                Learn about the platform
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={isSubmitting}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    maxLength={254}
                    disabled={isSubmitting}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is your question about?"
                  required
                  minLength={3}
                  maxLength={150}
                  disabled={isSubmitting}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  required
                  minLength={10}
                  maxLength={5000}
                  disabled={isSubmitting}
                  className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-3 text-sm leading-6 outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  Please provide between 10 and 5,000 characters.
                </p>
              </div>

              {submissionMessage && (
                <div
                  role={submissionStatus === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className={`flex gap-3 rounded-lg border p-4 text-sm leading-6 ${
                    submissionStatus === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-foreground'
                      : 'border-destructive/30 bg-destructive/10 text-foreground'
                  }`}
                >
                  {submissionStatus === 'success' ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  )}
                  <p>{submissionMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <LoaderCircle className="size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="size-4" />
                  </>
                )}
              </button>

              <p className="text-xs leading-5 text-muted-foreground">
                Fields marked with * are required. Your message will be sent
                securely to our support inbox.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ClosingCTA */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border bg-card px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
            />

            <div className="relative">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Explore the platform with confidence
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
                Discover how academic programs, courses and role-based workflows
                come together in the University Management System.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/features"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explore features
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/programs"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Browse programs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
