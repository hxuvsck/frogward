import { useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, User, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import type { OrderStatus } from '@/types/order';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;
const allStatuses: OrderStatus[] = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'];

const statusColor = (status: string) => {
  if (status === 'delivered') return 'bg-accent/20 text-accent';
  if (['processing', 'shipped', 'paid'].includes(status)) return 'bg-primary/20 text-primary';
  if (['failed', 'cancelled'].includes(status)) return 'bg-destructive/20 text-destructive';
  return 'bg-muted text-muted-foreground';
};

const AdminOrders = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { orders, updateOrderStatus: storeUpdateStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;

  // Auto-open order detail from URL param (cross-link from products/customers)
  const highlightId = searchParams.get('view');
  if (highlightId && !selectedOrder) {
    const found = orders.find((o) => o.id === highlightId);
    if (found) {
      setTimeout(() => setSelectedOrder(found), 0);
      searchParams.delete('view');
      setSearchParams(searchParams, { replace: true });
    }
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    storeUpdateStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="font-heading text-3xl font-bold mb-6">Orders</h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Input placeholder="Search by ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-xs" />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter('all')} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${statusFilter === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>All</button>
            {allStatuses.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${statusFilter === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Payment</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-heading font-semibold">{order.id}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/customers?view=${order.customerId}`} className="hover:text-primary transition-colors">
                        <p className="flex items-center gap-1"><User className="h-3 w-3" /> {order.customerName}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-heading font-semibold text-primary">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs uppercase tracking-wider">{order.paymentMethod}</span>
                      <span className={`ml-2 text-xs ${order.paymentStatus === 'paid' ? 'text-accent' : 'text-destructive'}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found.</p>}
        </div>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Order {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer: </span>
                    <Link to={`/admin/customers?view=${selectedOrder.customerId}`} onClick={() => setSelectedOrder(null)} className="text-primary hover:underline">
                      {selectedOrder.customerName}
                    </Link>
                  </div>
                  <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedOrder.deliveryAddress}</div>
                  <div><span className="text-muted-foreground">Payment:</span> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</div>
                  <div><span className="text-muted-foreground">Created:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/admin/products?view=${item.productId}`}
                      onClick={() => setSelectedOrder(null)}
                      className="flex items-center gap-3 rounded-md p-1.5 -mx-1.5 hover:bg-muted/50 transition-colors"
                    >
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover bg-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate flex items-center gap-1"><Package className="h-3 w-3 text-primary" /> {item.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-heading font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-heading font-semibold">Total</span>
                  <span className="font-heading font-bold text-primary text-lg">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading font-semibold">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {allStatuses.map((s) => (
                      <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${selectedOrder.status === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>{s}</button>
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

export default AdminOrders;
