import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { categories, getCategoriesWithCounts } from '@/data/mock-products';
import { useProductStore } from '@/store/product-store';
import { Input } from '@/components/ui/input';
import { useT } from '@/store/lang-store';
import { getCategoryLabel } from '@/lib/category-label';
import { matchesProductSearch } from '@/lib/product-localization';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const t = useT();
  const products = useProductStore((s) => s.products);
  const categoryCounts = useMemo(() => getCategoriesWithCounts(products), [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (search) result = result.filter((p) => matchesProductSearch(p, search));
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, search, sortBy, products]);

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('products.title')}</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('products.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSearchParams({})}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                !activeCategory ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {t('products.all')}
            </button>
            {categories
              .filter((category) => {
                const count = categoryCounts.find((entry) => entry.id === category.id)?.count ?? 0;
                return count > 0;
              })
              .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {getCategoryLabel(cat.id, t, cat.name)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{filtered.length} {t('products.items')}</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-card border border-border rounded-md px-3 py-1.5 text-foreground"
          >
            <option value="default">{t('products.default')}</option>
            <option value="price-asc">{t('products.priceAsc')}</option>
            <option value="price-desc">{t('products.priceDesc')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{t('products.noResults')}</p>
        )}
      </div>
    </Layout>
  );
};

export default Products;
