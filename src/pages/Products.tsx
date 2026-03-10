import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { getCategoriesWithCounts, getLocalizedCategoryName } from '@/lib/category-localization';
import { useProductStore } from '@/store/product-store';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoryStore } from '@/store/category-store';
import { useLangStore, useT } from '@/store/lang-store';
import { matchesProductSearch } from '@/lib/product-localization';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const products = useProductStore((s) => s.products);
  const categories = useCategoryStore((s) => s.categories);
  const categoryCounts = useMemo(() => getCategoriesWithCounts(categories, products), [categories, products]);

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
                {getLocalizedCategoryName(cat, lang)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">{filtered.length} {t('products.items')}</p>
          <div className="w-[190px]">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder={t('products.default')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t('products.default')}</SelectItem>
                <SelectItem value="price-asc">{t('products.priceAsc')}</SelectItem>
                <SelectItem value="price-desc">{t('products.priceDesc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
