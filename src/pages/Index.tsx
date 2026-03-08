import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/mock-products';
import { useT } from '@/store/lang-store';
import { useLangStore } from '@/store/lang-store';
import heroBg from '@/assets/hero-bg.jpg';
import type { TranslationKey } from '@/store/lang-store';

const catKeys: Record<string, TranslationKey> = {
  helmets: 'cat.helmets',
  vests: 'cat.vests',
  gloves: 'cat.gloves',
  boots: 'cat.boots',
  eyewear: 'cat.eyewear',
  coveralls: 'cat.coveralls',
};

const Index = () => {
  const featured = products.slice(0, 4);
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Industrial workspace" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-xl space-y-6">
            <div className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="text-xs font-medium text-primary">{t('hero.badge')}</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              {t('hero.title1')}<span className="text-primary">{t('hero.titleHighlight')}</span>{t('hero.title2')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('hero.desc')}
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="font-heading font-semibold">
                <Link to="/products">
                  {t('hero.shopNow')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
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
                {catKeys[cat.id] ? t(catKeys[cat.id]) : cat.name}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
