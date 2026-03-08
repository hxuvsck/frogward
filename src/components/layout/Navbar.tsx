import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Shield, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems());
  const { isAuthenticated, user } = useAuthStore();
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-border"
          />
        </form>

        <div className="hidden md:flex items-center gap-5 ml-auto">
          <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated && user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {user.name.split(' ')[0]}
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> Sign In
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </form>
          <Link to="/products" className="block text-sm" onClick={() => setMobileOpen(false)}>Products</Link>
          <Link to="/about" className="block text-sm" onClick={() => setMobileOpen(false)}>About Us</Link>
          <Link to="/cart" className="block text-sm" onClick={() => setMobileOpen(false)}>
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {isAuthenticated && user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="block text-sm" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
              )}
              <Link to="/account" className="block text-sm" onClick={() => setMobileOpen(false)}>My Account</Link>
            </>
          ) : (
            <Link to="/login" className="block text-sm" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
