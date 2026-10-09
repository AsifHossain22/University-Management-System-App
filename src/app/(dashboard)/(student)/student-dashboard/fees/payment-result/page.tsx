'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  const status = searchParams.get('status') ?? 'UNKNOWN';
  const invoiceNumber = searchParams.get('invoiceNumber');
  const invoiceUrl = searchParams.get('invoiceUrl');
  const message = searchParams.get('message');

  const isPaid = status === 'PAID';

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      {/* PaymentResult */}
      <section className="rounded-xl border p-6 text-center">
        <h1 className="text-2xl font-bold">
          {isPaid
            ? 'Payment Successful'
            : status === 'CANCELLED'
              ? 'Payment Cancelled'
              : status === 'ERROR'
                ? 'Payment Result Unavailable'
                : 'Payment Not Completed'}
        </h1>

        <p className="mt-3 text-muted-foreground">
          {message ??
            (isPaid
              ? 'Your payment has been completed successfully.'
              : 'Please check your fee history for the latest payment status.')}
        </p>

        {invoiceNumber && (
          <p className="mt-4 break-all text-sm">
            <span className="font-medium">Invoice Number:</span> {invoiceNumber}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/student-dashboard/fees"
            className="rounded-md border px-4 py-2 transition-colors hover:bg-muted"
          >
            Back to My Fees
          </Link>

          {isPaid && invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open Invoice in New Tab
            </a>
          )}
        </div>
      </section>

      {/* EmbeddedInvoicePDF */}
      {isPaid && invoiceUrl && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Payment Invoice</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your invoice is displayed below. You can view or download it using
              the PDF viewer controls.
            </p>
          </div>

          <div className="h-[75vh] min-h-[500px] w-full overflow-hidden rounded-xl border bg-muted/20">
            <iframe
              src={`${invoiceUrl}#toolbar=1&view=FitH`}
              title={`Payment Invoice ${invoiceNumber ?? ''}`}
              className="h-full w-full"
              loading="lazy"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            If the invoice does not appear, use “Open Invoice in New Tab” above.
          </p>
        </section>
      )}
    </main>
  );
}
