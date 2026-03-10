import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, User, ShoppingCart, Phone, Mail, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { useCustomerStore } from '@/store/customer-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
import { resolveProductImage } from '@/lib/product-image';
import { getOrderStatusLabel } from '@/lib/order-label';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

const statusColor = (status: string) => {
  if (status === 'delivered') return 'bg-accent/20 text-accent';
  if (['processing', 'shipped', 'paid'].includes(status)) return 'bg-primary/20 text-primary';
  if (['failed', 'cancelled'].includes(status)) return 'bg-destructive/20 text-destructive';
  return 'bg-muted text-muted-foreground';
};

const AdminCustomerProfile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const { id } = useParams();
  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const customers = useCustomerStore((s) => s.customers);

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <Layout>
        <div className="container py-10">
          <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> {t('admin.customers')}
          </Link>
          <p className="text-muted-foreground">{t('admin.noCustomers')}</p>
        </div>
      </Layout>
    );
  }

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerTotal = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Layout>
      <div className="container py-10 max-w-3xl space-y-6">
        <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('admin.customers')}
        </Link>

        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            {customer.name}
          </h1>

          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${customer.customerType === 'company' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {customer.customerType === 'company' ? t('profile.companyCustomer') : t('profile.individual')}
            </span>
            {customer.companyName ? (
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                {customer.companyName}
              </span>
            ) : null}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {customer.phone}
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {customer.email}
              </div>
            )}
            {customerOrders.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {customerOrders[0].deliveryAddress}
              </div>
            )}
            {customer.customerType === 'company' && (
              <>
                {customer.companyRegistrationNumber && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.companyRegistrationNumber')}:</span> {customer.companyRegistrationNumber}
                  </div>
                )}
                {customer.businessSector && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.businessSector')}:</span> {t(`profile.sector.${customer.businessSector}`)}
                  </div>
                )}
                {customer.employeeCount && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.employeeCount')}:</span> {customer.employeeCount}
                  </div>
                )}
                {customer.jobTitle && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.jobTitle')}:</span> {customer.jobTitle}
                  </div>
                )}
                {customer.companyEmail && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.companyEmail')}:</span> {customer.companyEmail}
                  </div>
                )}
                {customer.companyPhone && (
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t('profile.companyPhone')}:</span> {customer.companyPhone}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-heading text-xl font-bold">{customerOrders.length}</p>
              <p className="text-xs text-muted-foreground">{t('admin.ordersCount')}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-heading text-xl font-bold text-primary">{formatPrice(customerTotal)}</p>
              <p className="text-xs text-muted-foreground">{t('admin.totalSpent')}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-heading text-xl font-bold">{new Date(customer.lastActive).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">{t('admin.lastActive')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" /> {t('admin.orderHistory')}
            </p>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.noOrdersYet')}</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customerOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-3 hover:border-primary/30 transition-all"
                  >
                    <div>
                      <p className="font-heading font-semibold text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} {t('common.items')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-semibold text-primary text-sm">{formatPrice(order.totalAmount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status, t)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold">{t('admin.productsPurchased')}</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Map(
                  customerOrders
                    .flatMap((o) => o.items)
                    .map((i) => [i.productId, i])
                ).values()
              ).map((item) => (
                <Link
                  key={item.productId}
                  to={`/admin/products/${item.productId}`}
                  className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 hover:border-primary/30 transition-all"
                >
                  <img
                    src={resolveProductImage(products, item.productId, item.image)}
                    alt={item.name}
                    className="h-6 w-6 rounded object-cover bg-muted"
                  />
                  <span className="text-xs">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCustomerProfile;
