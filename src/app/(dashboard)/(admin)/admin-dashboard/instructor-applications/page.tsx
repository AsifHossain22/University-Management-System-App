'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useInstructorApplications,
  useReviewInstructorApplication,
} from '@/hooks/instructor-application.admin.hook';
import type {
  InstructorApplication,
  InstructorApplicationStatus,
} from '@/api/instructor-application.admin.api';

const PAGE_SIZE = 10;

const statusOptions: Array<{
  label: string;
  value: '' | InstructorApplicationStatus;
}> = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

type ReviewTarget = {
  application: InstructorApplication;
  decision: 'APPROVED' | 'REJECTED';
};

function StatusBadge({ status }: { status: InstructorApplicationStatus }) {
  const styles: Record<InstructorApplicationStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ApplicationDetails({
  application,
}: {
  application: InstructorApplication;
}) {
  return (
    <details className="mt-3 rounded-lg border p-4">
      <summary className="cursor-pointer font-medium">
        View application details
      </summary>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Qualification</p>
          <p className="font-medium">{application.qualification}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Experience</p>
          <p className="font-medium">{application.experienceYears} years</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email verification</p>
          <p className="font-medium">
            {application.emailVerifiedAt ? 'Verified' : 'Not verified'}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Submitted</p>
          <p className="font-medium">
            {new Date(application.createdAt).toLocaleString()}
          </p>
        </div>

        {application.bio && (
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="whitespace-pre-wrap">{application.bio}</p>
          </div>
        )}

        {application.profilePhotoUrl && (
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-muted-foreground">Profile photo</p>
            <a
              href={application.profilePhotoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              View profile photo
            </a>
          </div>
        )}

        {application.cvUrl && (
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-muted-foreground">CV</p>
            <a
              href={application.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              View CV
            </a>
          </div>
        )}

        {Array.isArray(application.supportingDocuments) &&
          application.supportingDocuments.map((item, index) => {
            if (
              typeof item !== 'object' ||
              item === null ||
              !('url' in item) ||
              typeof item.url !== 'string'
            ) {
              return null;
            }

            const name =
              'originalName' in item && typeof item.originalName === 'string'
                ? item.originalName
                : `Supporting document ${index + 1}`;

            return (
              <div key={`${item.url}-${index}`} className="sm:col-span-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {name}
                </a>
              </div>
            );
          })}

        {application.rejectionReason && (
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Rejection reason</p>
            <p>{application.rejectionReason}</p>
          </div>
        )}
      </div>
    </details>
  );
}

export default function InstructorApplicationsPage() {
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState<'' | InstructorApplicationStatus>(
    'PENDING',
  );

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const query = {
    page,
    limit: PAGE_SIZE,
    ...(status && { status }),
    ...(searchTerm && { searchTerm }),
  };

  const applicationsQuery = useInstructorApplications(query);
  const reviewMutation = useReviewInstructorApplication();

  // BackendResponse: { success, message, data: { meta, data: applications } }
  const response = applicationsQuery.data?.data;

  const applications: InstructorApplication[] = response?.data ?? [];
  const meta = response?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const openReviewDialog = (
    application: InstructorApplication,
    decision: 'APPROVED' | 'REJECTED',
  ) => {
    if (!application.emailVerifiedAt) {
      toast.error('The applicant must verify their email first.');
      return;
    }

    setRejectionReason('');
    setReviewTarget({ application, decision });
  };

  const closeReviewDialog = () => {
    if (reviewMutation.isPending) return;

    setReviewTarget(null);
    setRejectionReason('');
  };

  const handleReview = async () => {
    if (!reviewTarget) return;

    const { application, decision } = reviewTarget;
    const reason = rejectionReason.trim();

    if (!application.emailVerifiedAt) {
      toast.error('The applicant must verify their email first.');
      return;
    }

    if (decision === 'REJECTED' && !reason) {
      toast.error('Please provide a rejection reason.');
      return;
    }

    try {
      const result = await reviewMutation.mutateAsync({
        applicationId: application.id,
        status: decision,
        ...(decision === 'REJECTED' && {
          rejectionReason: reason,
        }),
      });

      toast.success(
        result.message ??
          (decision === 'APPROVED'
            ? 'Instructor application approved successfully.'
            : 'Instructor application rejected successfully.'),
      );

      setReviewTarget(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to review this application.',
      );
    }
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Instructor Applications
        </h1>

        <p className="text-muted-foreground">
          Review applications and manage instructor approvals.
        </p>
      </header>

      <section className="rounded-lg border p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="Search name, email, or specialization..."
            className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <select
            value={status}
            onChange={event => {
              setStatus(event.target.value as typeof status);
              setPage(1);
            }}
            className="rounded-md border bg-background px-3 py-2 text-sm"
            aria-label="Filter by application status"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Search
          </button>
        </form>
      </section>

      {applicationsQuery.isPending ? (
        <p className="text-muted-foreground">Loading applications...</p>
      ) : applicationsQuery.isError ? (
        <section className="rounded-lg border border-destructive/40 p-5">
          <p className="font-medium">Unable to load applications.</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Check your admin session and backend connection, then try again.
          </p>

          <button
            type="button"
            onClick={() => void applicationsQuery.refetch()}
            className="mt-3 rounded-md border px-3 py-2 text-sm"
          >
            Retry
          </button>
        </section>
      ) : applications.length === 0 ? (
        <section className="rounded-lg border p-8 text-center">
          <h2 className="font-semibold">No applications found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Try another status filter or search term.
          </p>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            {applications.map((application: InstructorApplication) => (
              <article
                key={application.id}
                className="rounded-lg border p-4 md:p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex items-start gap-3">
                    {application.profilePhotoUrl ? (
                      <img
                        src={application.profilePhotoUrl}
                        alt={`${application.firstName} ${application.lastName}`}
                        className="size-14 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                        {application.firstName.charAt(0)}
                        {application.lastName.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h2 className="font-semibold">
                        {application.firstName} {application.lastName}
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        {application.email}
                      </p>

                      <p className="mt-1 text-sm">
                        {application.specialization}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={application.status} />

                        <span
                          className={`text-xs ${
                            application.emailVerifiedAt
                              ? 'text-green-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {application.emailVerifiedAt
                            ? 'Email verified'
                            : 'Email not verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {application.status === 'PENDING' && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          openReviewDialog(application, 'APPROVED')
                        }
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          openReviewDialog(application, 'REJECTED')
                        }
                        className="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <ApplicationDetails application={application} />
              </article>
            ))}
          </section>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Showing {applications.length} of{' '}
              {meta?.total ?? applications.length} applications
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(current => current - 1)}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(current => current + 1)}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            className="w-full max-w-md space-y-4 rounded-xl bg-background p-6 shadow-xl"
          >
            <h2 id="review-dialog-title" className="text-lg font-semibold">
              {reviewTarget.decision === 'APPROVED'
                ? 'Approve instructor application?'
                : 'Reject instructor application?'}
            </h2>

            <p className="text-sm text-muted-foreground">
              {reviewTarget.application.firstName}{' '}
              {reviewTarget.application.lastName} —{' '}
              {reviewTarget.application.email}
            </p>

            {reviewTarget.decision === 'REJECTED' && (
              <div className="space-y-2">
                <label
                  htmlFor="rejection-reason"
                  className="text-sm font-medium"
                >
                  Rejection reason
                </label>

                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={event => setRejectionReason(event.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  rows={4}
                  required
                  className="w-full rounded-md border bg-background p-3 text-sm"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={closeReviewDialog}
                className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  reviewMutation.isPending ||
                  (reviewTarget.decision === 'REJECTED' &&
                    !rejectionReason.trim())
                }
                onClick={() => void handleReview()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {reviewMutation.isPending ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
