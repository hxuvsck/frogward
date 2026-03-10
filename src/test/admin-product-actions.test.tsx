import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import ProductDetail from '@/pages/ProductDetail';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useLangStore } from '@/store/lang-store';
import { useProductStore } from '@/store/product-store';
import type { Product } from '@/types/product';

const product: Product = {
  id: 'prod-admin-1',
  name: 'Impact Drill',
  slug: 'impact-drill',
  description: 'Heavy-duty drill',
  price: 180000,
  image: '',
  category: 'power-tools',
  inStock: true,
};

describe('admin product interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    useLangStore.setState({ lang: 'en' });
    useCartStore.setState({ items: [] });
    useAuthStore.setState({ user: null, isAuthenticated: false });
    useProductStore.setState({ products: [product] });
  });

  it('shows edit product instead of add to cart for admin on product cards', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'admin-1',
        name: 'Admin',
        phone: '99112233',
        role: 'admin',
        isPhoneVerified: true,
        isEmailVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    const editLink = screen.getByRole('link', { name: /edit product/i });
    expect(editLink).toHaveAttribute('href', '/admin/products/prod-admin-1');
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('shows edit product instead of add to cart for admin on product detail', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'admin-1',
        name: 'Admin',
        phone: '99112233',
        role: 'admin',
        isPhoneVerified: true,
        isEmailVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    render(
      <MemoryRouter initialEntries={['/products/impact-drill']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const editLink = screen.getByRole('link', { name: /edit product/i });
    expect(editLink).toHaveAttribute('href', '/admin/products/prod-admin-1');
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('persists product edits in the product store', () => {
    useProductStore.getState().updateProduct(product.id, {
      name: 'Updated Drill',
      price: 190000,
    });

    const state = useProductStore.getState();
    expect(state.products[0].name).toBe('Updated Drill');
    expect(state.products[0].price).toBe(190000);

    const persisted = localStorage.getItem('frogward-products');
    expect(persisted).toContain('Updated Drill');
    expect(persisted).toContain('190000');
  });
});
