import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Pencil } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useLangStore, useT } from '@/store/lang-store';
import { Button } from '@/components/ui/button';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-image';
import { useCustomerCart } from '@/hooks/use-customer-cart';
import { getLocalizedProductName } from '@/lib/product-localization';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const ProductCard = ({ product }: { product: Product }) => {
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const { addCustomerItem } = useCustomerCart();
  const inCart = items.some((i) => i.id === product.id);
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const isAdmin = user?.role === 'admin';
  const productName = getLocalizedProductName(product, lang);

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || DEFAULT_PRODUCT_IMAGE}
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-4 space-y-3">
          <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-sm font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.inStock ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
              {t('product.inStock')}
            </span>
          ) : (
            <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold text-destructive">
              {t('product.outOfStock')}
            </span>
          )}
        </div>
        {isAdmin ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/admin/products/${product.id}`}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> {t('admin.editProduct')}
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!product.inStock}
            onClick={() =>
              addCustomerItem({
                id: product.id,
                name: productName,
                price: product.price,
                image: product.image || DEFAULT_PRODUCT_IMAGE,
              })
            }
          >
            {inCart ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" /> {t('product.inCart')}
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> {t('product.addToCart')}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
