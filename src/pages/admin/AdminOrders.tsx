import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { getOrderStatusLabel, getPaymentStatusLabel } from '@/lib/order-label';
import type { OrderStatus } from '@/types/order';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;
const allStatuses: OrderStatus[] = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'];

const statusColor = (status: string) => {
  if (status === 'delivered') return 'bg-accent/20 text-accent';
  if (['processing', 'shipped', 'paid'].includes(status)) return 'bg-primary/20 text-primary';
  if (['failed', 'cancelled'].includes(status)) return 'bg-destructive/20 text-destructive';
  return 'bg-muted text-muted-foreground';
};

const downloadCsv = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminOrders = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { orders } = useOrderStore();

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportOrders = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Total', 'Payment Method', 'Payment Status', 'Status', 'Date', 'Items'];
    const rows = filtered.map((o) => [
      o.id,
      o.customerName,
      o.customerPhone,
      String(o.totalAmount),
      o.paymentMethod,
      getPaymentStatusLabel(o.paymentStatus, t),
      getOrderStatusLabel(o.status, t),
      new Date(o.createdAt).toLocaleDateString(),
      o.items.map((i) => `${i.name} x${i.quantity}`).join('; '),
    ]);
    downloadCsv('orders.csv', headers, rows);
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.dashboard')}
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">{t('admin.orders')}</h1>
          <Button variant="outline" onClick={exportOrders} className="font-heading font-semibold">
            <Download className="mr-2 h-4 w-4" /> {t('admin.exportCsv')}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Input placeholder={t('admin.searchOrders')} value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter('all')} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${statusFilter === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>{t('admin.all')}</button>
            {allStatuses.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${statusFilter === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>{getOrderStatusLabel(s, t)}</button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.order')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.customer')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.total')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.payment')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.status')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.4)' }}
                    className="transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-heading font-semibold">{order.id}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/customers/${order.customerId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-primary transition-colors"
                      >
                        <p className="flex items-center gap-1"><User className="h-3 w-3" /> {order.customerName}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs uppercase tracking-wider">{order.paymentMethod}</span>
                      <span className={`ml-2 text-xs ${order.paymentStatus === 'paid' ? 'text-accent' : 'text-destructive'}`}>{getPaymentStatusLabel(order.paymentStatus, t)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{getOrderStatusLabel(order.status, t)}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t('admin.noOrders')}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
