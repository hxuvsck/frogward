import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { getProductBySlug, products } from '@/data/mock-products';
import { useCartStore } from '@/store/cart-store';

const formatPrice = (price: number) => `₮${price.toLocaleString()}`;

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/products" className="text-primary hover:underline text-sm mt-4 inline-block">← Back to products</Link>
        </div>
      </Layout>
    );
  }

  const inCart = items.some((i) => i.id === product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="container py-10">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</span>
              <h1 className="font-heading text-3xl font-bold">{product.name}</h1>
            </div>

            <p className="text-2xl font-heading font-bold text-primary">{formatPrice(product.price)}</p>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.inStock ? (
              <div className="flex items-center gap-2 text-accent text-sm">
                <Check className="h-4 w-4" /> In Stock
              </div>
            ) : (
              <p className="text-destructive text-sm">Currently out of stock</p>
            )}

            <Button
              size="lg"
              className="w-full md:w-auto font-heading font-semibold"
              disabled={!product.inStock}
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
            >
              {inCart ? (
                <><Check className="mr-2 h-4 w-4" /> Added to Cart</>
              ) : (
                <><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>
              )}
            </Button>

            {product.specs && (
              <div className="border-t border-border pt-6">
                <h3 className="font-heading text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="text-sm font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
