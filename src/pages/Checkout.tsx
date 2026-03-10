import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useCustomerStore } from '@/store/customer-store';
import { useOrderStore } from '@/store/order-store';
import { useT } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
import { resolveProductImage } from '@/lib/product-image';
import type { Order, PaymentMethod } from '@/types/order';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const addOrder = useOrderStore((s) => s.addOrder);
  const syncFromOrder = useCustomerStore((s) => s.syncFromOrder);
  const products = useProductStore((s) => s.products);
  const t = useT();
  const [payment, setPayment] = useState<PaymentMethod>('qpay');
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (items.length === 0 && !submitted) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <h1 className="font-heading text-2xl font-bold">{t('checkout.noItems')}</h1>
          <Button asChild><Link to="/products">{t('cart.browse')}</Link></Button>
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
          <h1 className="font-heading text-2xl font-bold">{t('checkout.success')}</h1>
          <p className="text-muted-foreground">{t('checkout.successDesc')}</p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline"><Link to="/account/orders">{t('checkout.viewOrders')}</Link></Button>
            <Button asChild><Link to="/">{t('checkout.backHome')}</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current!;
    const fd = new FormData(form);
    const now = new Date().toISOString();
    const orderId = `ORD-${String(Date.now()).slice(-6)}`;

    const order: Order = {
      id: orderId,
      customerId: user?.id ?? 'guest',
      customerName: (fd.get('name') as string) || user?.name || 'Guest',
      customerPhone: (fd.get('phone') as string) || user?.phone || '',
      customerEmail: (fd.get('email') as string) || user?.email,
      deliveryAddress: (fd.get('address') as string) || '',
      items: items.map((item, i) => ({
        id: `${orderId}-item-${i}`,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: resolveProductImage(products, item.id, item.image),
      })),
      totalAmount: totalPrice(),
      paymentMethod: payment,
      paymentStatus: 'unpaid',
      status: 'awaiting_payment',
      createdAt: now,
      updatedAt: now,
    };

    addOrder(order);
    syncFromOrder(order);
    clearCart();
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> {t('checkout.backToCart')}
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold">{t('checkout.customerInfo')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('checkout.fullName')}</Label>
                <Input id="name" name="name" defaultValue={user?.name ?? ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('checkout.phone')}</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={user?.phone ?? ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('checkout.email')}</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email ?? ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('checkout.address')}</Label>
                <Input id="address" name="address" defaultValue={user?.defaultAddress ?? ''} required />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <h2 className="font-heading text-lg font-semibold">{t('checkout.orderSummary')}</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-heading font-semibold">
              <span>{t('cart.total')}</span>
              <span className="text-primary text-lg">{formatPrice(totalPrice())}</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold">{t('checkout.paymentMethod')}</h2>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPayment('qpay')} className={`rounded-lg border p-4 text-center transition-all ${payment === 'qpay' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                <QrCode className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">QPay</span>
              </button>
              <button type="button" onClick={() => setPayment('storepay')} className={`rounded-lg border p-4 text-center transition-all ${payment === 'storepay' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">StorePay</span>
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-heading font-semibold text-base">
            {t('checkout.placeOrder')} — {formatPrice(totalPrice())}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
