import type { CartItem } from '@/types/cart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useT } from '@/store/lang-store';
import { useToast } from '@/hooks/use-toast';

type AddableCartItem = Omit<CartItem, 'quantity'>;

export const useCustomerCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();
  const t = useT();

  const requireCustomer = () => {
    if (isAuthenticated && user?.role === 'customer') {
      return true;
    }

    toast({
      variant: 'destructive',
      title: t('cart.loginRequiredTitle'),
      description: t('cart.loginRequiredDesc'),
    });

    navigate('/login', {
      state: {
        redirectTo: `${location.pathname}${location.search}${location.hash}`,
      },
    });

    return false;
  };

  const addCustomerItem = (item: AddableCartItem) => {
    if (!requireCustomer()) {
      return false;
    }

    addItem(item);
    return true;
  };

  return { addCustomerItem, requireCustomer };
};
