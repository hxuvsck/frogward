import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import HomeMarketingCarousel from '@/components/home/HomeMarketingCarousel';
import { getCategoriesWithCounts } from '@/data/mock-products';
import { DEFAULT_MARKETING_IMAGE } from '@/lib/marketing-image';
import { useT } from '@/store/lang-store';
import { useMarketingStore } from '@/store/marketing-store';
import { useProductStore } from '@/store/product-store';
import { getCategoryLabel } from '@/lib/category-label';

const Index = () => {
  const products = useProductStore((s) => s.products);
  const banners = useMarketingStore((s) => s.banners);
  const t = useT();
  const categories = useMemo(
    () => getCategoriesWithCounts(products).filter((category) => category.count > 0),
    [products]
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[48vh] min-h-[280px] overflow-hidden sm:h-[56vh] sm:min-h-[360px] md:h-[72vh] md:min-h-[440px]">
        <HomeMarketingCarousel
          banners={banners.filter((banner) => banner.active)}
          fallbackImage={DEFAULT_MARKETING_IMAGE}
        />
      </section>

      {/* Features */}
      <section className="border-y border-border">
        <div className="container grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { icon: Shield, title: t('hero.certifiedSafety'), desc: t('hero.certifiedSafetyDesc') },
            { icon: Truck, title: t('hero.fastDelivery'), desc: t('hero.fastDeliveryDesc') },
            { icon: Headphones, title: t('hero.support'), desc: t('hero.supportDesc') },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 py-6 px-6">
              <f.icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-heading text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="font-heading text-2xl font-bold mb-8">{t('hero.shopByCategory')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group rounded-lg border border-border bg-card p-4 text-center hover:border-primary/30 transition-all"
            >
              <h3 className="font-heading text-sm font-semibold group-hover:text-primary transition-colors">
                {getCategoryLabel(cat.id, t, cat.name)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} {t('product.items')}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold">{t('hero.featured')}</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            {t('hero.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
