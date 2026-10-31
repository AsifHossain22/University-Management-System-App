'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  History,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
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

type FeesTab = 'outstanding' | 'history' | 'invoices';

const formatBDT = (amount: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string | null | undefined) => {
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
  PAID: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400',
  PARTIALLY_PAID:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400',
  UNPAID:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400',
  OVERDUE:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400',
  PENDING:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400',
  FAILED:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400',
  CANCELLED:
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ??
  'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';

function StatusBadge({ status }: { status: string }) {
  const formattedStatus = status.replaceAll('_', ' ');

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
    >
      {formattedStatus}
    </span>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 py-10">
        <LoaderCircle
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ReceiptText;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
        <div className="mb-4 rounded-2xl bg-muted p-4">
          <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function ErrorState({
  message,
  retry,
  isRetrying,
}: {
  message: string;
  retry: () => void;
  isRetrying: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 px-5 py-12 text-center">
        <div className="rounded-2xl bg-destructive/10 p-4">
          <CircleAlert className="size-8 text-destructive" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={retry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 size-4" />
          )}
          {isRetrying ? 'Retrying...' : 'Try again'}
        </Button>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  amount,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  amount: string;
  description: string;
  icon: typeof ReceiptText;
  accent: 'default' | 'success' | 'warning';
}) {
  const accentStyles = {
    default: {
      icon: 'bg-primary/10 text-primary',
      amount: 'text-foreground',
    },
    success: {
      icon: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
      amount: 'text-green-700 dark:text-green-400',
    },
    warning: {
      icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
      amount: 'text-amber-700 dark:text-amber-400',
    },
  };

  const styles = accentStyles[accent];

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>

            <p
              className={`mt-3 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl ${styles.amount}`}
            >
              {amount}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className={`shrink-0 rounded-xl p-3 ${styles.icon}`}>
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  // PreserveExistingAPIResponseStructure
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

  const unpaidFeeCount = fees.filter(
    fee =>
      fee.isActive &&
      fee.status !== 'PAID' &&
      fee.status !== 'CANCELLED' &&
      fee.outstandingAmount > 0,
  ).length;

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

          // PreserveExistingBKashCheckoutRedirect
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
    `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      activeTab === tab
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
    }`;

  if (feesPending) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4">
        <LoaderCircle
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading your fees...
        </span>
      </main>
    );
  }

  if (feesError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          message={getApiErrorMessage(feeError)}
          retry={() => void refetchFees()}
          isRetrying={feesRefetching}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* PageHeading */}
      <header className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-primary/5 blur-2xl sm:size-64"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Wallet className="size-3.5 text-primary" />
              Student Finance
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Fees
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Keep track of your university fees, review payment activity and
              access your payment invoices in one place.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-background/80 p-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <CreditCard className="size-6" aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Outstanding balance
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatBDT(totalOutstanding)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {unpaidFeeCount}{' '}
                {unpaidFeeCount === 1 ? 'fee requires' : 'fees require'}{' '}
                attention
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FinancialSummary */}
      <section aria-label="Fee summary" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Financial overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of the fee records currently available for your account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total fees"
            amount={formatBDT(totalFees)}
            description="Total amount across the fee records shown."
            icon={ReceiptText}
            accent="default"
          />

          <SummaryCard
            title="Amount paid"
            amount={formatBDT(totalPaid)}
            description="Payments recorded against your fees."
            icon={CheckCircle2}
            accent="success"
          />

          <SummaryCard
            title="Outstanding balance"
            amount={formatBDT(totalOutstanding)}
            description="The remaining amount shown as payable."
            icon={Wallet}
            accent="warning"
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-6">
        <div
          className="grid grid-cols-1 gap-1 rounded-xl border bg-muted/60 p-1 sm:grid-cols-3"
          role="tablist"
          aria-label="Fee information"
        >
          <button
            id="fees-tab-outstanding"
            type="button"
            role="tab"
            aria-selected={activeTab === 'outstanding'}
            aria-controls="fees-panel-outstanding"
            className={tabClass('outstanding')}
            onClick={() => setActiveTab('outstanding')}
          >
            <Wallet className="size-4" aria-hidden="true" />
            Outstanding fees
            {unpaidFeeCount > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {unpaidFeeCount}
              </span>
            )}
          </button>

          <button
            id="fees-tab-history"
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            aria-controls="fees-panel-history"
            className={tabClass('history')}
            onClick={() => setActiveTab('history')}
          >
            <History className="size-4" aria-hidden="true" />
            Payment history
          </button>

          <button
            id="fees-tab-invoices"
            type="button"
            role="tab"
            aria-selected={activeTab === 'invoices'}
            aria-controls="fees-panel-invoices"
            className={tabClass('invoices')}
            onClick={() => setActiveTab('invoices')}
          >
            <FileText className="size-4" aria-hidden="true" />
            Invoices & receipts
          </button>
        </div>

        {/* OutstandingFees */}
        {activeTab === 'outstanding' && (
          <section
            id="fees-panel-outstanding"
            role="tabpanel"
            aria-labelledby="fees-tab-outstanding"
            className="space-y-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Outstanding fees</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Review each fee and pay eligible balances securely through the
                  existing bKash checkout.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                Sorted by due date
              </div>
            </div>

            {fees.length === 0 ? (
              <EmptyState
                icon={ReceiptText}
                title="No fees found"
                description="There are currently no fee records associated with your student account."
              />
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

                  const progress =
                    fee.amount > 0
                      ? Math.min(
                          Math.max(
                            Math.round((fee.totalPaid / fee.amount) * 100),
                            0,
                          ),
                          100,
                        )
                      : 0;

                  return (
                    <Card
                      key={fee.id}
                      className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <div className="h-1 bg-primary/70" />

                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <CardTitle className="wrap-break-word text-lg leading-6">
                              {fee.title}
                            </CardTitle>

                            <CardDescription className="mt-2 leading-5">
                              {fee.description || 'University fee'}
                            </CardDescription>
                          </div>

                          <StatusBadge status={fee.status} />
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-1 flex-col gap-5">
                        <div className="rounded-xl bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            Outstanding amount
                          </p>

                          <p className="mt-1 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
                            {formatBDT(fee.outstandingAmount)}
                          </p>

                          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                            <span className="text-muted-foreground">
                              Payment progress
                            </span>
                            <span className="font-semibold">{progress}%</span>
                          </div>

                          <div
                            className="mt-2 h-2 overflow-hidden rounded-full bg-border"
                            role="progressbar"
                            aria-label={`${fee.title} payment progress`}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-primary transition-[width] duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Total fee
                            </p>
                            <p className="mt-1 wrap-break-word font-semibold">
                              {formatBDT(fee.amount)}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Amount paid
                            </p>
                            <p className="mt-1 wrap-break-word font-semibold text-green-700 dark:text-green-400">
                              {formatBDT(fee.totalPaid)}
                            </p>
                          </div>

                          <div className="col-span-2 flex items-center gap-2 border-t pt-3">
                            <CalendarDays
                              className="size-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Due date
                              </p>
                              <p className="mt-0.5 text-sm font-medium">
                                {formatDate(fee.dueDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto border-t pt-4">
                          <Button
                            type="button"
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
                                Fully paid
                              </>
                            ) : fee.status === 'CANCELLED' || !fee.isActive ? (
                              'Payment unavailable'
                            ) : (
                              <>
                                <CreditCard className="mr-2 size-4" />
                                Pay {formatBDT(fee.outstandingAmount)} with
                                bKash
                              </>
                            )}
                          </Button>

                          {canPay && (
                            <p className="mt-2 text-center text-xs text-muted-foreground">
                              You will be redirected to the payment provider to
                              complete the transaction.
                            </p>
                          )}
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
          <section
            id="fees-panel-history"
            role="tabpanel"
            aria-labelledby="fees-tab-history"
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold">Payment history</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Review your recorded payment attempts and their latest available
                status.
              </p>
            </div>

            {paymentsPending ? (
              <LoadingState message="Loading payment history..." />
            ) : paymentsError ? (
              <ErrorState
                message={getApiErrorMessage(paymentError)}
                retry={() => void refetchPayments()}
                isRetrying={paymentsRefetching}
              />
            ) : payments.length === 0 ? (
              <EmptyState
                icon={History}
                title="No payment history yet"
                description="Your payment attempts will appear here when payment records are available."
              />
            ) : (
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-base">
                    Recent transactions
                  </CardTitle>
                  <CardDescription>
                    {payments.length} payment{' '}
                    {payments.length === 1 ? 'record' : 'records'} available
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-180 text-sm">
                      <thead className="bg-muted/40 text-left">
                        <tr className="border-b">
                          <th className="px-5 py-4 font-medium">Fee</th>
                          <th className="px-5 py-4 font-medium">Amount</th>
                          <th className="px-5 py-4 font-medium">Date</th>
                          <th className="px-5 py-4 font-medium">
                            Transaction ID
                          </th>
                          <th className="px-5 py-4 font-medium">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payments.map(payment => (
                          <tr
                            key={payment.id}
                            className="border-b transition-colors last:border-0 hover:bg-muted/20"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium">
                                {payment.fee?.title ?? 'University fee'}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-semibold">
                              {formatBDT(payment.amount)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                              {formatDate(payment.paidAt ?? payment.createdAt)}
                            </td>

                            <td className="max-w-48 break-all px-5 py-4 font-mono text-xs text-muted-foreground">
                              {payment.bkashTrxId ?? '—'}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={payment.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* InvoicesAndReceipts */}
        {activeTab === 'invoices' && (
          <section
            id="fees-panel-invoices"
            role="tabpanel"
            aria-labelledby="fees-tab-invoices"
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold">Invoices & receipts</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Access invoice links for payments recorded as successful.
              </p>
            </div>

            {paymentsPending ? (
              <LoadingState message="Loading invoices..." />
            ) : paymentsError ? (
              <ErrorState
                message={getApiErrorMessage(paymentError)}
                retry={() => void refetchPayments()}
                isRetrying={paymentsRefetching}
              />
            ) : successfulPayments.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No invoices available"
                description="Invoices will appear here after successful payments have been recorded."
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {successfulPayments.map(payment => (
                  <Card
                    key={payment.id}
                    className="overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <CardContent className="flex h-full flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ReceiptText className="size-6" aria-hidden="true" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="wrap-break-word font-semibold">
                              {payment.fee?.title ?? 'University fee'}
                            </h3>
                            <StatusBadge status={payment.status} />
                          </div>

                          <p className="mt-2 break-all text-sm text-muted-foreground">
                            {payment.invoiceNumber
                              ? `Invoice: ${payment.invoiceNumber}`
                              : 'Invoice number unavailable'}
                          </p>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Amount paid
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {formatBDT(payment.amount)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Payment date: {formatDate(payment.paidAt)}
                          </p>
                        </div>

                        {payment.invoiceUrl ? (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
                          >
                            <ExternalLink className="mr-2 size-4" />
                            View invoice
                          </a>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="w-full sm:w-auto"
                          >
                            Invoice unavailable
                          </Button>
                        )}
                      </div>
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
