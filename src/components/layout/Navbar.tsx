import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search, Sun, Moon, Globe, LogOut, Shield, ChevronDown, Package, Users, Megaphone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useLangStore } from '@/store/lang-store';
import { useT } from '@/store/lang-store';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang } = useLangStore();
  const t = useT();
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const showCartState = isAuthenticated && user?.role === 'customer';
  const visibleCartCount = showCartState ? totalItems : 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    setUserMenuOpen(false);
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
            {visibleCartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {visibleCartCount}
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
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <User className="h-3.5 w-3.5" /> {user.name.split(' ')[0]}
                <ChevronDown className={`h-3 w-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-fade-in">
                  {!isAdmin && (
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <User className="h-3.5 w-3.5" /> {t('account.title')}
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5" /> {t('nav.admin')}
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> {t('admin.orders')}
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <Package className="h-3.5 w-3.5" /> {t('admin.products')}
                      </Link>
                      <Link
                        to="/admin/customers"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" /> {t('admin.customers')}
                      </Link>
                      <Link
                        to="/admin/marketing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <Megaphone className="h-3.5 w-3.5" /> {t('admin.marketing')}
                      </Link>
                    </>
                  )}
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted/50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
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
            {t('nav.cart')} {visibleCartCount > 0 && `(${visibleCartCount})`}
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
            <div className="space-y-2 pt-2 border-t border-border">
              {!isAdmin && (
                <Link to="/account" className="block text-sm" onClick={() => setMobileOpen(false)}>
                  <User className="h-3.5 w-3.5 inline mr-1" /> {user.name.split(' ')[0]}
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin" className="block text-sm" onClick={() => setMobileOpen(false)}>
                    <Shield className="h-3.5 w-3.5 inline mr-1" /> {t('nav.admin')}
                  </Link>
                  <Link to="/admin/orders" className="block text-sm" onClick={() => setMobileOpen(false)}>
                    <ShoppingCart className="h-3.5 w-3.5 inline mr-1" /> {t('admin.orders')}
                  </Link>
                  <Link to="/admin/products" className="block text-sm" onClick={() => setMobileOpen(false)}>
                    <Package className="h-3.5 w-3.5 inline mr-1" /> {t('admin.products')}
                  </Link>
                  <Link to="/admin/customers" className="block text-sm" onClick={() => setMobileOpen(false)}>
                    <Users className="h-3.5 w-3.5 inline mr-1" /> {t('admin.customers')}
                  </Link>
                  <Link to="/admin/marketing" className="block text-sm" onClick={() => setMobileOpen(false)}>
                    <Megaphone className="h-3.5 w-3.5 inline mr-1" /> {t('admin.marketing')}
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="block text-sm text-destructive">
                <LogOut className="h-3.5 w-3.5 inline mr-1" /> {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="block text-sm" onClick={() => setMobileOpen(false)}>{t('nav.signIn')}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
