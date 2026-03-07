import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/auth-store';
import { mockCustomers } from '@/data/mock-orders';

const AdminCustomers = () => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="font-heading text-3xl font-bold mb-6">Customers</h1>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Phone</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Orders</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-heading font-semibold">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email || '—'}</td>
                    <td className="px-4 py-3">{c.orderCount}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.lastActive).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCustomers;
