import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useLangStore } from '@/store/lang-store';
import type { Product } from '@/types/product';

const product: Product = {
  id: 'prod-1',
  name: 'Safety Helmet',
  slug: 'safety-helmet',
  description: 'Helmet',
  price: 25000,
  image: '',
  category: 'helmets',
  inStock: true,
};

const renderProductCard = () =>
  render(
    <MemoryRouter initialEntries={['/products']}>
      <Toaster />
      <Routes>
        <Route path="/products" element={<ProductCard product={product} />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('customer cart guard', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
    useAuthStore.setState({ user: null, isAuthenticated: false });
    useLangStore.setState({ lang: 'en' });
  });

  it('redirects unauthenticated users to login and does not add the item', async () => {
    renderProductCard();

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(await screen.findByText(/sign in to add items to cart/i)).toBeInTheDocument();
  });

  it('allows logged-in customers to add the item to cart', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'cust-1',
        name: 'Customer',
        phone: '99999999',
        role: 'customer',
        isPhoneVerified: true,
        isEmailVerified: false,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    renderProductCard();

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });
});
