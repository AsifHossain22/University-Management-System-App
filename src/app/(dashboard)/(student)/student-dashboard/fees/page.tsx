'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  ExternalLink,
  FileText,
  History,
  LoaderCircle,
  ReceiptText,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMyFees } from '@/hooks/fee.hook';
import { useCreatePayment, useMyPayments } from '@/hooks/payment.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const formatBDT = (amount: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string | null) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusStyles: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PARTIALLY_PAID: 'bg-blue-100 text-blue-700',
  UNPAID: 'bg-amber-100 text-amber-700',
  OVERDUE: 'bg-red-100 text-red-700',
  PENDING: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

type FeesTab = 'outstanding' | 'history' | 'invoices';

export default function StudentFeesPage() {
  const [activeTab, setActiveTab] = useState<FeesTab>('outstanding');
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);

  const {
    data: feesResponse,
    isPending: feesPending,
    isError: feesError,
    error: feeError,
    refetch: refetchFees,
    isRefetching: feesRefetching,
  } = useMyFees({
    page: 1,
    limit: 100,
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const {
    data: paymentsResponse,
    isPending: paymentsPending,
    isError: paymentsError,
    error: paymentError,
    refetch: refetchPayments,
    isRefetching: paymentsRefetching,
  } = useMyPayments();

  const createPayment = useCreatePayment();

  // APIEnvelopes
  const fees = feesResponse?.data?.data ?? [];
  const payments = paymentsResponse?.data ?? [];

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.totalPaid, 0);
  const totalOutstanding = fees.reduce(
    (sum, fee) => sum + fee.outstandingAmount,
    0,
  );

  const successfulPayments = payments.filter(
    payment => payment.status === 'PAID',
  );

  const handlePayment = (feeId: string, amount: number) => {
    if (amount <= 0) {
      toast.error('There is no outstanding balance to pay.');
      return;
    }

    setPayingFeeId(feeId);

    createPayment.mutate(
      { feeId, amount },
      {
        onSuccess: response => {
          const paymentUrl = response.data?.paymentUrl;

          if (!paymentUrl) {
            toast.error('The payment link was not returned by the server.');
            setPayingFeeId(null);
            return;
          }

          // PreserveExistingBKashCheckout
          window.location.assign(paymentUrl);
        },
        onError: error => {
          toast.error(getApiErrorMessage(error));
          setPayingFeeId(null);
        },
      },
    );
  };

  const tabClass = (tab: FeesTab) =>
    `inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  if (feesPending) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading your fees...
        </span>
      </main>
    );
  }

  if (feesError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CircleAlert className="size-10 text-destructive" />
            <h2 className="text-lg font-semibold">Could not load your fees</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {getApiErrorMessage(feeError)}
            </p>
            <Button
              onClick={() => void refetchFees()}
              variant="outline"
              disabled={feesRefetching}
            >
              {feesRefetching ? 'Retrying...' : 'Try again'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
        <p className="mt-2 text-muted-foreground">
          Review your university fees, track transactions and access payment
          invoices.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <ReceiptText className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatBDT(totalFees)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total amount of fees shown
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <CheckCircle2 className="size-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              {formatBDT(totalPaid)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Confirmed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>
            <Wallet className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-700">
              {formatBDT(totalOutstanding)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Remaining amount to pay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-1 rounded-lg bg-muted p-1 sm:grid-cols-3">
          <button
            type="button"
            className={tabClass('outstanding')}
            onClick={() => setActiveTab('outstanding')}
            aria-pressed={activeTab === 'outstanding'}
          >
            <Wallet className="size-4" />
            Outstanding Fees
          </button>

          <button
            type="button"
            className={tabClass('history')}
            onClick={() => setActiveTab('history')}
            aria-pressed={activeTab === 'history'}
          >
            <History className="size-4" />
            Payment History
          </button>

          <button
            type="button"
            className={tabClass('invoices')}
            onClick={() => setActiveTab('invoices')}
            aria-pressed={activeTab === 'invoices'}
          >
            <FileText className="size-4" />
            Invoices & Receipts
          </button>
        </div>

        {/* Outstanding Fees */}
        {activeTab === 'outstanding' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Outstanding Fees</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your balances and pay eligible fees through bKash.
              </p>
            </div>

            {fees.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-14 text-center">
                  <ReceiptText className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="font-semibold">No fees found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are currently no fees associated with your student
                    account.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {fees.map(fee => {
                  const canPay =
                    fee.isActive &&
                    fee.status !== 'PAID' &&
                    fee.status !== 'CANCELLED' &&
                    fee.outstandingAmount > 0;

                  const isPaying =
                    payingFeeId === fee.id && createPayment.isPending;

                  const progress = Math.min(
                    Math.round((fee.totalPaid / Math.max(fee.amount, 1)) * 100),
                    100,
                  );

                  return (
                    <Card key={fee.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <CardTitle>{fee.title}</CardTitle>
                            <CardDescription>
                              {fee.description || 'University fee'}
                            </CardDescription>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[fee.status] ??
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {fee.status.replaceAll('_', ' ')}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-1 flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Fee Amount
                            </p>
                            <p className="mt-1 font-semibold">
                              {formatBDT(fee.amount)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Amount Paid
                            </p>
                            <p className="mt-1 font-semibold text-green-700">
                              {formatBDT(fee.totalPaid)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Outstanding
                            </p>
                            <p className="mt-1 font-semibold text-amber-700">
                              {formatBDT(fee.outstandingAmount)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Due Date
                            </p>
                            <p className="mt-1 flex items-center gap-2 font-medium">
                              <CalendarDays className="size-4 text-muted-foreground" />
                              {formatDate(fee.dueDate)}
                            </p>
                          </div>
                        </div>

                        {fee.amount > 0 && (
                          <div
                            className="h-2 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-label={`${fee.title} payment progress`}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}

                        <div className="mt-auto border-t pt-4">
                          <Button
                            className="w-full"
                            disabled={!canPay || createPayment.isPending}
                            onClick={() =>
                              handlePayment(fee.id, fee.outstandingAmount)
                            }
                          >
                            {isPaying ? (
                              <>
                                <LoaderCircle className="mr-2 size-4 animate-spin" />
                                Connecting to bKash...
                              </>
                            ) : fee.outstandingAmount <= 0 ? (
                              <>
                                <CheckCircle2 className="mr-2 size-4" />
                                Fully Paid
                              </>
                            ) : fee.status === 'CANCELLED' || !fee.isActive ? (
                              'Payment Unavailable'
                            ) : (
                              <>
                                <CreditCard className="mr-2 size-4" />
                                Pay {formatBDT(fee.outstandingAmount)} with
                                bKash
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* PaymentHistory */}
        {activeTab === 'history' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Payment History</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Track all your payment attempts and their latest recorded
                status.
              </p>
            </div>

            {paymentsPending ? (
              <Card>
                <CardContent className="flex items-center justify-center gap-3 py-12">
                  <LoaderCircle className="size-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading payment history...
                  </span>
                </CardContent>
              </Card>
            ) : paymentsError ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                  <CircleAlert className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    {getApiErrorMessage(paymentError)}
                  </p>
                  <Button
                    variant="outline"
                    disabled={paymentsRefetching}
                    onClick={() => void refetchPayments()}
                  >
                    {paymentsRefetching ? 'Retrying...' : 'Retry'}
                  </Button>
                </CardContent>
              </Card>
            ) : payments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-14 text-center">
                  <History className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="font-semibold">No payment history yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your payment attempts will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="overflow-x-auto p-0">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="border-b bg-muted/50 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium">Fee</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id} className="border-b last:border-0">
                          <td className="px-4 py-3 font-medium">
                            {payment.fee?.title ?? 'University fee'}
                          </td>
                          <td className="px-4 py-3">
                            {formatBDT(payment.amount)}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(payment.paidAt ?? payment.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            {payment.bkashTrxId ?? '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                statusStyles[payment.status] ??
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* InvoicesAndReceipts */}
        {activeTab === 'invoices' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Invoices & Receipts</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                View invoices for payments confirmed as successful.
              </p>
            </div>

            {paymentsPending ? (
              <Card>
                <CardContent className="flex items-center justify-center gap-3 py-12">
                  <LoaderCircle className="size-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading invoices...
                  </span>
                </CardContent>
              </Card>
            ) : paymentsError ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                  <CircleAlert className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    {getApiErrorMessage(paymentError)}
                  </p>
                  <Button
                    variant="outline"
                    disabled={paymentsRefetching}
                    onClick={() => void refetchPayments()}
                  >
                    {paymentsRefetching ? 'Retrying...' : 'Retry'}
                  </Button>
                </CardContent>
              </Card>
            ) : successfulPayments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-14 text-center">
                  <FileText className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="font-semibold">No invoices available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Invoices will appear here after successful payments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {successfulPayments.map(payment => (
                  <Card key={payment.id}>
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <ReceiptText className="size-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">
                            {payment.fee?.title ?? 'University fee'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {payment.invoiceNumber
                              ? `Invoice: ${payment.invoiceNumber}`
                              : 'Invoice number unavailable'}
                          </p>
                          <p className="text-sm">
                            {formatBDT(payment.amount)} ·{' '}
                            {formatDate(payment.paidAt)}
                          </p>
                        </div>
                      </div>

                      {payment.invoiceUrl ? (
                        <Button className="shrink-0">
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="flex items-center">
                              <ExternalLink className="mr-2 size-4" />
                              <span>View Invoice</span>
                            </span>
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          Invoice unavailable
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
