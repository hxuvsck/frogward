import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { getOrderStatusLabel, getPaymentStatusClassName, getPaymentStatusLabel } from '@/lib/order-label';
import { useProductStore } from '@/store/product-store';
import { resolveProductImage } from '@/lib/product-image';
import type { OrderStatus } from '@/types/order';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;
const allStatuses: OrderStatus[] = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'];

const AdminOrderProfile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const { id } = useParams();
  const { orders, updateOrderStatus } = useOrderStore();
  const products = useProductStore((s) => s.products);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Layout>
        <div className="container py-10">
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> {t('admin.orders')}
          </Link>
          <p className="text-muted-foreground">{t('admin.noOrders')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 max-w-3xl space-y-6">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('admin.orders')}
        </Link>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h1 className="font-heading text-2xl font-bold">{t('admin.order')} {order.id}</h1>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t('admin.customer')}: </span>
              <Link to={`/admin/customers/${order.customerId}`} className="text-primary hover:underline">
                {order.customerName}
              </Link>
            </div>
            <div><span className="text-muted-foreground">{t('admin.phone')}:</span> {order.customerPhone}</div>
            <div className="col-span-2"><span className="text-muted-foreground">{t('admin.address')}:</span> {order.deliveryAddress}</div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{t('admin.payment')}:</span>
              <span>{order.paymentMethod}</span>
              <span className={getPaymentStatusClassName(order.paymentStatus)}>{getPaymentStatusLabel(order.paymentStatus, t)}</span>
            </div>
            <div><span className="text-muted-foreground">{t('admin.created')}:</span> {new Date(order.createdAt).toLocaleString()}</div>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <Link
                key={item.id}
                to={`/admin/products/${item.productId}`}
                className="flex items-center gap-3 rounded-md p-1.5 -mx-1.5 hover:bg-muted/50 transition-colors"
              >
                <img
                  src={resolveProductImage(products, item.productId, item.image)}
                  alt={item.name}
                  className="h-10 w-10 rounded object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate flex items-center gap-1"><Package className="h-3 w-3 text-primary" /> {item.name}</p>
                  <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                </div>
                <p className="text-sm font-heading font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-heading font-semibold">{t('admin.total')}</span>
            <span className="font-heading font-bold text-primary text-lg">{formatPrice(order.totalAmount)}</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold">{t('admin.updateStatus')}</p>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateOrderStatus(order.id, s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${order.status === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  {getOrderStatusLabel(s, t)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrderProfile;
