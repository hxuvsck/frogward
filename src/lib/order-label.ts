import type { TranslationKey } from '@/store/lang-store';
import type { OrderStatus } from '@/types/order';

const orderStatusKeys: Record<OrderStatus, TranslationKey> = {
  pending: 'status.pending',
  awaiting_payment: 'status.awaiting_payment',
  paid: 'status.paid',
  processing: 'status.processing',
  shipped: 'status.shipped',
  delivered: 'status.delivered',
  cancelled: 'status.cancelled',
  failed: 'status.failed',
};

const paymentStatusKeys: Record<'unpaid' | 'paid' | 'failed', TranslationKey> = {
  unpaid: 'payment.unpaid',
  paid: 'payment.paid',
  failed: 'payment.failed',
};

export const getOrderStatusLabel = (
  status: OrderStatus,
  t: (key: TranslationKey) => string
) => t(orderStatusKeys[status]);

export const getPaymentStatusLabel = (
  status: 'unpaid' | 'paid' | 'failed',
  t: (key: TranslationKey) => string
) => t(paymentStatusKeys[status]);

export const getPaymentStatusClassName = (
  status: 'unpaid' | 'paid' | 'failed'
) => {
  if (status === 'paid') {
    return 'inline-flex items-center rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent';
  }

  if (status === 'failed') {
    return 'inline-flex items-center rounded-full border border-destructive/30 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive';
  }

  return 'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-destructive';
};
