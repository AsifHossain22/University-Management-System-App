'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMyFees } from '@/hooks/fee.hook';
import { useCreatePayment } from '@/hooks/payment.hook';
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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const statusStyles: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PARTIALLY_PAID: 'bg-blue-100 text-blue-700',
  UNPAID: 'bg-amber-100 text-amber-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function StudentFeesPage() {
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);

  const {
    data: feesResponse,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useMyFees({
    page: 1,
    limit: 100,
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const createPayment = useCreatePayment();

  // API envelope: { success, message, data: { meta, data: fees } }
  const fees = feesResponse?.data?.data ?? [];

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.totalPaid, 0);
  const totalOutstanding = fees.reduce(
    (sum, fee) => sum + fee.outstandingAmount,
    0,
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
          // ApiResponse<CreatePaymentResponse>:
          // response.data is the CreatePaymentResponse.
          const paymentUrl = response.data?.paymentUrl;

          if (!paymentUrl) {
            toast.error('The payment link was not returned by the server.');
            setPayingFeeId(null);
            return;
          }

          // Redirect to the backend-provided bKash checkout URL.
          window.location.assign(paymentUrl);
        },
        onError: paymentError => {
          toast.error(getApiErrorMessage(paymentError));
          setPayingFeeId(null);
        },
      },
    );
  };

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading your fees...
        </span>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CircleAlert className="size-10 text-destructive" />
            <h2 className="text-lg font-semibold">Could not load your fees</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {getApiErrorMessage(error)}
            </p>
            <Button
              onClick={() => {
                void refetch();
              }}
              variant="outline"
              disabled={isRefetching}
            >
              {isRefetching ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Try again'
              )}
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
          Review your university fees and pay outstanding balances securely
          through bKash.
        </p>
      </div>

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

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Fee Details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pay each eligible fee using the bKash checkout.
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

                    {fee.outstandingAmount > 0 && (
                      <div
                        className="h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label="Fee payment progress"
                        aria-valuenow={Math.min(
                          Math.round(
                            (fee.totalPaid / Math.max(fee.amount, 1)) * 100,
                          ),
                          100,
                        )}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(
                              (fee.totalPaid / Math.max(fee.amount, 1)) * 100,
                              100,
                            )}%`,
                          }}
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
                        ) : fee.status === 'PAID' ||
                          fee.outstandingAmount <= 0 ? (
                          <>
                            <CheckCircle2 className="mr-2 size-4" />
                            Fully Paid
                          </>
                        ) : fee.status === 'CANCELLED' || !fee.isActive ? (
                          'Payment Unavailable'
                        ) : (
                          <>
                            <CreditCard className="mr-2 size-4" />
                            Pay {formatBDT(fee.outstandingAmount)} with bKash
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
    </main>
  );
}
