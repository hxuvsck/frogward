import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getLocalizedBannerContent, getLocalizedBannerSummary, getLocalizedBannerTitle } from '@/lib/marketing-localization';
import { resolveMarketingImage } from '@/lib/marketing-image';
import { useLangStore } from '@/store/lang-store';
import { useMarketingStore } from '@/store/marketing-store';

const StoryDetail = () => {
  const { slug } = useParams();
  const banners = useMarketingStore((state) => state.banners);
  const story = banners.find((banner) => banner.slug === slug);
  const lang = useLangStore((s) => s.lang);

  if (!story) {
    return <Navigate to="/" replace />;
  }

  const title = getLocalizedBannerTitle(story, lang);
  const summary = getLocalizedBannerSummary(story, lang);
  const content = getLocalizedBannerContent(story, lang);

  return (
    <Layout>
      <article className="container max-w-4xl py-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <img src={resolveMarketingImage(story.image)} alt={title} className="h-[340px] w-full object-cover md:h-[460px]" />
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-bold leading-tight">{title}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{summary}</p>
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {content.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={`${story.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default StoryDetail;
