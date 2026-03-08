import { Navigate, Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { mockCustomers } from '@/data/mock-orders';
import { products } from '@/data/mock-products';
import { useT } from '@/store/lang-store';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const orders = useOrderStore((s) => s.orders);
  const totalOrders = orders.length;
  const pendingPayment = orders.filter((o) => o.paymentStatus !== 'paid').length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const lowStock = products.filter((p) => !p.inStock).length;

  const stats = [
    { label: t('admin.totalOrders'), value: totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: t('admin.pendingPayment'), value: pendingPayment, icon: AlertTriangle, color: 'text-primary' },
    { label: t('admin.paidOrders'), value: paidOrders, icon: Package, color: 'text-accent' },
    { label: t('admin.products'), value: products.length, icon: Package, color: 'text-foreground' },
    { label: t('admin.lowStock'), value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: t('admin.customers'), value: mockCustomers.length, icon: Users, color: 'text-foreground' },
  ];

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/admin/orders" className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-all">
            <ShoppingCart className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold">{t('admin.manageOrders')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('admin.manageOrdersDesc')}</p>
          </Link>
          <Link to="/admin/products" className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-all">
            <Package className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold">{t('admin.manageProducts')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('admin.manageProductsDesc')}</p>
          </Link>
          <Link to="/admin/customers" className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-all">
            <Users className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold">{t('admin.customers')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('admin.customersDesc')}</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
