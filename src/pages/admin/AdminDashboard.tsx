import { Navigate, Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, AlertTriangle, Megaphone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { useMarketingStore } from '@/store/marketing-store';
import { useOrderStore } from '@/store/order-store';
import { useProductStore } from '@/store/product-store';
import { mockCustomers } from '@/data/mock-orders';
import { useT } from '@/store/lang-store';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const banners = useMarketingStore((s) => s.banners);
  const totalOrders = orders.length;
  const pendingPayment = orders.filter((o) => o.paymentStatus !== 'paid').length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const lowStock = products.filter((p) => !p.inStock).length;

  const stats = [
    { label: t('admin.totalOrders'), value: totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: t('admin.pendingPayment'), value: pendingPayment, icon: AlertTriangle, color: 'text-primary' },
    { label: t('admin.paidOrders'), value: paidOrders, icon: Package, color: 'text-accent' },
    { label: t('admin.deliveredOrders'), value: deliveredOrders, icon: CheckCircle, color: 'text-accent' },
    { label: t('admin.products'), value: products.length, icon: Package, color: 'text-foreground' },
    { label: t('admin.availableProducts'), value: inStockProducts, icon: Package, color: 'text-primary' },
    { label: t('admin.lowStock'), value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: t('admin.marketing'), value: banners.length, icon: Megaphone, color: 'text-primary' },
    { label: t('admin.customers'), value: mockCustomers.length, icon: Users, color: 'text-foreground' },
  ];

  const navCards = [
    { to: '/admin/orders', icon: ShoppingCart, title: t('admin.manageOrders'), desc: t('admin.manageOrdersDesc') },
    { to: '/admin/products', icon: Package, title: t('admin.manageProducts'), desc: t('admin.manageProductsDesc') },
    { to: '/admin/marketing', icon: Megaphone, title: t('admin.marketing'), desc: t('admin.marketingDesc') },
    { to: '/admin/customers', icon: Users, title: t('admin.customers'), desc: t('admin.customersDesc') },
  ];

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {navCards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.08, duration: 0.3 }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Link to={card.to} className="block rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors h-full">
                <card.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-heading font-semibold">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
              className="rounded-lg border border-border bg-card p-4 space-y-2 cursor-default"
            >
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="font-heading text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
