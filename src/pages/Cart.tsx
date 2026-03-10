import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useT } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
import { resolveProductImage } from '@/lib/product-image';
import type { CartItem } from '@/types/cart';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const products = useProductStore((s) => s.products);
  const t = useT();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const visibleItems = isAuthenticated && user?.role === 'customer' ? items : [];

  if (visibleItems.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="font-heading text-2xl font-bold">{t('cart.empty')}</h1>
          <p className="text-muted-foreground">{t('cart.emptyDesc')}</p>
          <Button asChild>
            <Link to="/products">{t('cart.browse')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {visibleItems.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <img
                  src={resolveProductImage(products, item.id, item.image)}
                  alt={item.name}
                  className="h-20 w-20 rounded-md object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-semibold truncate">{item.name}</h3>
                  <p className="text-primary font-heading font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => setItemToRemove(item)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="text-sm font-heading font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setConfirmClearOpen(true)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
              {t('cart.clear')}
            </button>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 h-fit space-y-4">
            <h2 className="font-heading text-lg font-semibold">{t('cart.orderSummary')}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.shipping')}</span>
                <span className="text-accent">{t('cart.free')}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between">
              <span className="font-heading font-semibold">{t('cart.total')}</span>
              <span className="font-heading text-xl font-bold text-primary">{formatPrice(totalPrice())}</span>
            </div>
            <Button asChild size="lg" className="w-full font-heading font-semibold">
              <Link to="/checkout">{t('cart.checkout')}</Link>
            </Button>
          </div>
        </div>

        <AlertDialog open={!!itemToRemove} onOpenChange={(open) => { if (!open) setItemToRemove(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('cart.confirmDeleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('cart.confirmRemoveItem')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (itemToRemove) removeItem(itemToRemove.id);
                setItemToRemove(null);
              }}>
                {t('common.yes')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('cart.confirmDeleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('cart.confirmClearCart')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                clearCart();
                setConfirmClearOpen(false);
              }}>
                {t('common.yes')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Cart;
