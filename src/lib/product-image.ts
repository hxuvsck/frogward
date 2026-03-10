import type { Product } from '@/types/product';

const productPlaceholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="FrogWard product placeholder">
  <rect width="600" height="600" fill="#f5f5f4"/>
  <rect x="36" y="36" width="528" height="528" rx="32" fill="#ffffff" stroke="#e7e5e4" stroke-width="4"/>
  <text x="300" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#111111">FROG</text>
  <text x="300" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#111111">WARD</text>
  <rect x="208" y="344" width="184" height="10" rx="5" fill="#d4a200"/>
</svg>`;

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(productPlaceholderSvg)}`;

export const resolveProductImage = (
  products: Product[],
  productId: string,
  fallback?: string
) => {
  const current = products.find((product) => product.id === productId)?.image;
  return current || fallback || DEFAULT_PRODUCT_IMAGE;
};
