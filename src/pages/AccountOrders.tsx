import { Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { getOrderStatusLabel, getPaymentStatusLabel } from '@/lib/order-label';
import { useProductStore } from '@/store/product-store';
import { resolveProductImage } from '@/lib/product-image';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

const statusColor = (status: string) => {
  if (status === 'delivered') return 'bg-accent/20 text-accent';
  if (['processing', 'shipped', 'paid'].includes(status)) return 'bg-primary/20 text-primary';
  if (['failed', 'cancelled'].includes(status)) return 'bg-destructive/20 text-destructive';
  return 'bg-muted text-muted-foreground';
};

const AccountOrders = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const myOrders = orders.filter((o) => o.customerId === user.id);

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.backToAccount')}
        </Link>
        <h1 className="font-heading text-3xl font-bold mb-8">{t('accountOrders.title')}</h1>

        {myOrders.length === 0 ? (
          <p className="text-muted-foreground">{t('accountOrders.empty')}</p>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status, t)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {t('accountOrders.payment')}: <span className={order.paymentStatus === 'paid' ? 'text-accent' : 'text-destructive'}>{getPaymentStatusLabel(order.paymentStatus, t)}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={resolveProductImage(products, item.productId, item.image)}
                        alt={item.name}
                        className="h-10 w-10 rounded object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-heading font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{order.paymentMethod}</span>
                  <span className="font-heading font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AccountOrders;
