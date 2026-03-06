import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cart-store';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

type PaymentMethod = 'qpay' | 'storepay';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const [payment, setPayment] = useState<PaymentMethod>('qpay');
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <h1 className="font-heading text-2xl font-bold">No items to checkout</h1>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <QrCode className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">Your order has been submitted. You will receive payment instructions shortly.</p>
          <Button asChild><Link to="/">Back to Home</Link></Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold">Customer Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Bat Boldyn" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+976 9911 2233" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="bat@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" placeholder="Ulaanbaatar, District..." required />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-heading font-semibold">
              <span>Total</span>
              <span className="text-primary text-lg">{formatPrice(totalPrice())}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayment('qpay')}
                className={`rounded-lg border p-4 text-center transition-all ${
                  payment === 'qpay' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                }`}
              >
                <QrCode className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">QPay</span>
              </button>
              <button
                type="button"
                onClick={() => setPayment('storepay')}
                className={`rounded-lg border p-4 text-center transition-all ${
                  payment === 'storepay' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">StorePay</span>
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-heading font-semibold text-base">
            Place Order — {formatPrice(totalPrice())}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
