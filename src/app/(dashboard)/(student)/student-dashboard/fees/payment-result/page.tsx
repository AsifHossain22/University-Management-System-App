'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPaymentById, type StudentPayment } from '@/api/payment.api';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState<StudentPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // VerifyPaymentWithBackend
  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setPayment(null);

      if (!paymentId) {
        setErrorMessage(
          'We could not identify this payment. Please check your fee history for the latest status.',
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPaymentById(paymentId);

        if (!isMounted) return;

        setPayment(response.data);
      } catch {
        if (!isMounted) return;

        setErrorMessage(
          'We could not verify your payment right now. Please check your fee history for the latest status.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentId]);

  const status = payment?.status;
  const isPaid = status === 'PAID';
  const invoiceNumber = payment?.invoiceNumber;
  const invoiceUrl = payment?.invoiceUrl;

  const getStatusTitle = () => {
    if (isLoading) return 'Verifying Payment...';
    if (errorMessage) return 'Payment Result Unavailable';

    switch (status) {
      case 'PAID':
        return 'Payment Successful';
      case 'CANCELLED':
        return 'Payment Cancelled';
      case 'FAILED':
        return 'Payment Failed';
      case 'PENDING':
        return 'Payment Pending';
      default:
        return 'Payment Result Unavailable';
    }
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return 'Please wait while we verify your payment with the server.';
    }

    if (errorMessage) {
      return errorMessage;
    }

    switch (status) {
      case 'PAID':
        return 'Your payment has been confirmed successfully.';
      case 'CANCELLED':
        return 'This payment was cancelled. You can return to your fees to try again if needed.';
      case 'FAILED':
        return 'Your payment could not be completed. Please check your fee history before trying again.';
      case 'PENDING':
        return 'Your payment is still being processed. Please check your fee history for updates.';
      default:
        return 'We could not determine the payment status. Please check your fee history.';
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      {/* PaymentResult */}
      <section className="rounded-xl border p-6 text-center">
        <h1 className="text-2xl font-bold">{getStatusTitle()}</h1>

        <p className="mt-3 text-muted-foreground" role="status">
          {getStatusMessage()}
        </p>

        {payment && !isLoading && !errorMessage && (
          <div className="mt-5 space-y-2 text-sm">
            <p>
              <span className="font-medium">Fee:</span> {payment.fee.title}
            </p>

            <p>
              <span className="font-medium">Amount:</span> {payment.currency}{' '}
              {Number(payment.amount).toFixed(2)}
            </p>

            <p>
              <span className="font-medium">Payment Status:</span>{' '}
              {payment.status}
            </p>

            <p className="break-all">
              <span className="font-medium">Payment Reference:</span>{' '}
              {payment.merchantInvoiceNumber}
            </p>

            {payment.bkashTrxId && (
              <p className="break-all">
                <span className="font-medium">bKash Transaction ID:</span>{' '}
                {payment.bkashTrxId}
              </p>
            )}

            {isPaid && invoiceNumber && (
              <p className="break-all">
                <span className="font-medium">Invoice Number:</span>{' '}
                {invoiceNumber}
              </p>
            )}
          </div>
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

          <div className="h-[75vh] min-h-125 w-full overflow-hidden rounded-xl border bg-muted/20">
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
