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
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-end md:justify-between">
          <p>{t('footer.rights')}</p>
          <a
            href="https://www.biotain.solutions"
            target="_blank"
            rel="noreferrer"
            className="flex flex-wrap items-center justify-end gap-3 self-start transition-opacity hover:opacity-85 md:self-auto"
          >
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Developed by</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
                Biotain Solutions Mongolia LLC.
              </p>
            </div>
            <img
              src="/biotain_%20logo_notxt_nobg.png"
              alt="Biotain Solutions Mongolia LLC."
              className="relative z-10 h-11 w-auto shrink-0 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
