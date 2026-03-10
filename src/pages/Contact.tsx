import Layout from '@/components/layout/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getLocalizedSiteContent } from '@/lib/site-content-localization';
import { useLangStore, useT } from '@/store/lang-store';
import { useSiteContentStore } from '@/store/site-content-store';

const Contact = () => {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const content = useSiteContentStore();

  return (
    <Layout>
      <div className="container max-w-4xl py-16">
        <h1 className="font-heading text-4xl font-bold mb-4">{t('contact.title')}</h1>
        <p className="text-lg text-muted-foreground mb-12">{getLocalizedSiteContent(content.contactDescription, lang)}</p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.email')}</h2>
            <p className="text-sm text-muted-foreground">{content.contactEmail}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <Phone className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.phone')}</h2>
            <p className="text-sm text-muted-foreground">{content.contactPhone}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.address')}</h2>
            <p className="text-sm text-muted-foreground">{getLocalizedSiteContent(content.address, lang)}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
