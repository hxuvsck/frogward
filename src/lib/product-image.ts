import type { Product } from '@/types/product';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop';

export const resolveProductImage = (
  products: Product[],
  productId: string,
  fallback?: string
) => {
  const current = products.find((product) => product.id === productId)?.image;
  return current || fallback || DEFAULT_PRODUCT_IMAGE;
};

