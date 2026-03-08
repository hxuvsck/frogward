import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Shield, Search, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useLangStore } from '@/store/lang-store';
import { useT } from '@/store/lang-store';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang } = useLangStore();
  const t = useT();
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const toggleLang = () => setLang(lang === 'mn' ? 'en' : 'mn');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight shrink-0">
          <span className="text-primary">FROG</span>WARD
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('nav.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-border"
          />
        </form>

        <div className="hidden md:flex items-center gap-4 ml-auto">
          <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.products')}
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.about')}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors" title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language toggle */}
          <button onClick={toggleLang} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-2 py-1">
            <Globe className="h-3 w-3" />
            {lang === 'mn' ? 'EN' : 'MN'}
          </button>

          {isAuthenticated && user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> {t('nav.admin')}
                </Link>
              )}
              <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                <LogOut className="h-3.5 w-3.5" /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {t('nav.signIn')}
            </Link>
          )}
        </div>

        <button className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </form>
          <Link to="/products" className="block text-sm" onClick={() => setMobileOpen(false)}>{t('nav.products')}</Link>
          <Link to="/about" className="block text-sm" onClick={() => setMobileOpen(false)}>{t('nav.about')}</Link>
          <Link to="/cart" className="block text-sm" onClick={() => setMobileOpen(false)}>
            {t('nav.cart')} {totalItems > 0 && `(${totalItems})`}
          </Link>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button onClick={toggleTheme} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? t('theme.light') : t('theme.dark')}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-1 text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-1">
              <Globe className="h-3 w-3" /> {lang === 'mn' ? 'EN' : 'MN'}
            </button>
          </div>
          {isAuthenticated && user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="block text-sm" onClick={() => setMobileOpen(false)}>{t('nav.admin')}</Link>
              )}
              <Link to="/account" className="block text-sm" onClick={() => setMobileOpen(false)}>{user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} className="block text-sm text-destructive">
                <LogOut className="h-3.5 w-3.5 inline mr-1" /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-sm" onClick={() => setMobileOpen(false)}>{t('nav.signIn')}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
