import Layout from '@/components/layout/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useT } from '@/store/lang-store';

const Contact = () => {
  const t = useT();

  return (
    <Layout>
      <div className="container max-w-4xl py-16">
        <h1 className="font-heading text-4xl font-bold mb-4">{t('contact.title')}</h1>
        <p className="text-lg text-muted-foreground mb-12">{t('contact.desc')}</p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.email')}</h2>
            <p className="text-sm text-muted-foreground">contact@frogward.mn</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <Phone className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.phone')}</h2>
            <p className="text-sm text-muted-foreground">+976 9911 2233</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-lg font-semibold">{t('contact.address')}</h2>
            <p className="text-sm text-muted-foreground">{t('contact.addressValue')}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
