import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.id === product.id);

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-4 space-y-3">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading text-sm font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.inStock ? (
            <span className="text-xs text-accent">In Stock</span>
          ) : (
            <span className="text-xs text-destructive">Out of Stock</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={!product.inStock}
          onClick={() =>
            addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
          }
        >
          {inCart ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" /> In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
