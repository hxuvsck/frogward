import { Link, Navigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { mockOrders } from '@/data/mock-orders';

const formatPrice = (p: number) => `₮${p.toLocaleString()}`;

const Account = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const myOrders = mockOrders.filter((o) => o.customerId === user.id).slice(0, 3);

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">My Account</h1>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Profile Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-sm font-semibold">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.phone}</p>
            {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-sm font-semibold">Delivery Address</h3>
            <p className="text-xs text-muted-foreground">{user.defaultAddress || 'Not set'}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-sm font-semibold">Orders</h3>
            <p className="text-xs text-muted-foreground">{myOrders.length} recent orders</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link to="/account/profile">Edit Profile</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/account/orders">All Orders</Link>
          </Button>
        </div>

        {/* Recent Orders */}
        <h2 className="font-heading text-lg font-semibold mb-4">Recent Orders</h2>
        {myOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {myOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-heading text-sm font-semibold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-heading font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                    order.status === 'processing' || order.status === 'shipped' ? 'bg-primary/20 text-primary' :
                    order.status === 'failed' || order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
