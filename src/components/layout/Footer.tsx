import { Link } from 'react-router-dom';
import { useT } from '@/store/lang-store';

const Footer = () => {
  const t = useT();

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-lg font-bold mb-3">
              <span className="text-primary">FROG</span>WARD
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{t('footer.shop')}</h4>
            <div className="space-y-2">
              <Link to="/products" className="block text-sm text-foreground hover:text-primary transition-colors">{t('footer.allProducts')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{t('footer.support')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>info@frogward.mn</p>
              <p>+976 9911 2233</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
