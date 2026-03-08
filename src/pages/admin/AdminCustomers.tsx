import { useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, User, ShoppingCart, Phone, Mail, MapPin, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { mockCustomers } from '@/data/mock-orders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

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

const AdminCustomers = () => {
  const { user, isAuthenticated } = useAuthStore();
  const t = useT();
  const orders = useOrderStore((s) => s.orders);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const highlightId = searchParams.get('view');
  if (highlightId && !selectedCustomer) {
    const found = mockCustomers.find((c) => c.id === highlightId);
    if (found) {
      setTimeout(() => setSelectedCustomer(found), 0);
      searchParams.delete('view');
      setSearchParams(searchParams, { replace: true });
    }
  }

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const getCustomerOrders = (customerId: string) =>
    orders.filter((o) => o.customerId === customerId);

  const getCustomerTotal = (customerId: string) =>
    getCustomerOrders(customerId).reduce((sum, o) => sum + o.totalAmount, 0);

  const exportCustomers = () => {
    const headers = ['Name', 'Phone', 'Email', 'Orders', 'Total Spent', 'Last Active'];
    const rows = filtered.map((c) => [
      c.name, c.phone, c.email || '',
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
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.phone')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.email')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.ordersCount')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.totalSpent')}</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('admin.lastActive')}</th>
                  <th className="px-4 py-3"></th>
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
                    className="transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-heading font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email || '—'}</td>
                    <td className="px-4 py-3">{getCustomerOrders(c.id).length}</td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(getCustomerTotal(c.id))}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.lastActive).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(c)}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t('admin.noCustomers')}</p>}
        </div>

        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {selectedCustomer?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-5">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {selectedCustomer.phone}
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {selectedCustomer.email}
                    </div>
                  )}
                  {getCustomerOrders(selectedCustomer.id).length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {getCustomerOrders(selectedCustomer.id)[0].deliveryAddress}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <p className="font-heading text-xl font-bold">{getCustomerOrders(selectedCustomer.id).length}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.ordersCount')}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <p className="font-heading text-xl font-bold text-primary">{formatPrice(getCustomerTotal(selectedCustomer.id))}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.totalSpent')}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <p className="font-heading text-xl font-bold">{new Date(selectedCustomer.lastActive).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.lastActive')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" /> {t('admin.orderHistory')}
                  </p>
                  {getCustomerOrders(selectedCustomer.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('admin.noOrdersYet')}</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getCustomerOrders(selectedCustomer.id).map((order) => (
                        <Link
                          key={order.id}
                          to={`/admin/orders?view=${order.id}`}
                          onClick={() => setSelectedCustomer(null)}
                          className="flex items-center justify-between rounded-md border border-border p-3 hover:border-primary/30 transition-all"
                        >
                          <div>
                            <p className="font-heading font-semibold text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-heading font-semibold text-primary text-sm">{formatPrice(order.totalAmount)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
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
                        getCustomerOrders(selectedCustomer.id)
                          .flatMap((o) => o.items)
                          .map((i) => [i.productId, i])
                      ).values()
                    ).map((item) => (
                      <Link
                        key={item.productId}
                        to={`/admin/products?view=${item.productId}`}
                        onClick={() => setSelectedCustomer(null)}
                        className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 hover:border-primary/30 transition-all"
                      >
                        <img src={item.image} alt={item.name} className="h-6 w-6 rounded object-cover bg-muted" />
                        <span className="text-xs">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminCustomers;
