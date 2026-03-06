import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">
            <span className="text-primary">FROG</span>WARD
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Industrial workwear & safety equipment. Built for the toughest conditions.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Shop</h4>
          <div className="space-y-2">
            <Link to="/products" className="block text-sm text-foreground hover:text-primary transition-colors">All Products</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Support</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>info@frogward.mn</p>
            <p>+976 9911 2233</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 FrogWard. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
