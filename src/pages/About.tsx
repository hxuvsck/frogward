import Layout from '@/components/layout/Layout';
import { Wrench, Shield, Users, Truck } from 'lucide-react';
import { useT } from '@/store/lang-store';
import { useSiteContentStore } from '@/store/site-content-store';

const About = () => {
  const t = useT();
  const contactEmail = useSiteContentStore((s) => s.contactEmail);

  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold mb-4">
          {t('about.title')} <span className="text-primary">FROG</span>WARD
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {t('about.desc')}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: Shield, title: t('about.safetyFirst'), desc: t('about.safetyFirstDesc') },
            { icon: Wrench, title: t('about.industrialGrade'), desc: t('about.industrialGradeDesc') },
            { icon: Users, title: t('about.b2b'), desc: t('about.b2bDesc') },
            { icon: Truck, title: t('about.delivery'), desc: t('about.deliveryDesc') },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-6 space-y-3">
              <item.icon className="h-6 w-6 text-primary" />
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-8 space-y-4">
          <h2 className="font-heading text-2xl font-bold">{t('about.mission')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('about.missionText1')}</p>
          <p className="text-muted-foreground leading-relaxed">{t('about.missionText2')}</p>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t('about.contact')} <span className="text-primary font-medium">{contactEmail}</span></p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
