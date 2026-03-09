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

