import { Navigate, Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { mockOrders, mockCustomers } from '@/data/mock-orders';
import { products } from '@/data/mock-products';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const totalOrders = mockOrders.length;
  const pendingPayment = mockOrders.filter((o) => o.paymentStatus !== 'paid').length;
  const paidOrders = mockOrders.filter((o) => o.paymentStatus === 'paid').length;
  const lowStock = products.filter((p) => !p.inStock).length;

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Pending Payment', value: pendingPayment, icon: AlertTriangle, color: 'text-primary' },
    { label: 'Paid Orders', value: paidOrders, icon: Package, color: 'text-accent' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-foreground' },
    { label: 'Low/No Stock', value: lowStock, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Customers', value: mockCustomers.length, icon: Users, color: 'text-foreground' },
  ];

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-heading text-3xl font-bold mb-8">Admin Dashboard</h1>

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
            <h3 className="font-heading font-semibold">Manage Orders</h3>
            <p className="text-xs text-muted-foreground mt-1">View, filter, and update order statuses</p>
          </Link>
          <Link to="/admin/products" className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-all">
            <Package className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold">Manage Products</h3>
            <p className="text-xs text-muted-foreground mt-1">Create, edit, and manage inventory</p>
          </Link>
          <Link to="/admin/customers" className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-all">
            <Users className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold">Customers</h3>
            <p className="text-xs text-muted-foreground mt-1">View customer list and activity</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
