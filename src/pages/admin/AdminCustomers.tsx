import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useCustomerStore } from '@/store/customer-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

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

const AdminCustomers = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const customers = useCustomerStore((s) => s.customers);
  const [search, setSearch] = useState('');

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (c.companyName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (c.customerType?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const getCustomerOrders = (customerId: string) =>
    orders.filter((o) => o.customerId === customerId);

  const getCustomerTotal = (customerId: string) =>
    getCustomerOrders(customerId).reduce((sum, o) => sum + o.totalAmount, 0);

  const exportCustomers = () => {
    const headers = ['Name', 'Type', 'Company', 'Phone', 'Email', 'Orders', 'Total Spent', 'Last Active'];
    const rows = filtered.map((c) => [
      c.name,
      c.customerType === 'company' ? t('profile.companyCustomer') : t('profile.individual'),
      c.companyName || '',
      c.phone,
      c.email || '',
      String(getCustomerOrders(c.id).length),
      String(getCustomerTotal(c.id)),
      new Date(c.lastActive).toLocaleDateString(),
    ]);
    downloadCsv('customers.csv', headers, rows);
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t('common.dashboard')}
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold">{t('admin.customers')}</h1>
          <Button variant="outline" onClick={exportCustomers} className="font-heading font-semibold">
            <Download className="mr-2 h-4 w-4" /> {t('admin.exportCsv')}
          </Button>
        </div>

        <Input placeholder={t('admin.searchCustomers')} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 max-w-sm" />

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.customer')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.customerType')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('profile.company')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.phone')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.email')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.ordersCount')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.totalSpent')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.lastActive')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.4)' }}
                    className="transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/customers/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-heading font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.customerType === 'company' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {c.customerType === 'company' ? t('profile.companyCustomer') : t('profile.individual')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.companyName || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email || '—'}</td>
                    <td className="px-4 py-3">{getCustomerOrders(c.id).length}</td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(getCustomerTotal(c.id))}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.lastActive).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t('admin.noCustomers')}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCustomers;
