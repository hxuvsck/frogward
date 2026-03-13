import type { Product } from '@/types/product';

const productPlaceholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="FrogWard product placeholder">
  <defs>
    <linearGradient id="frogward-product-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2efe4"/>
      <stop offset="100%" stop-color="#ded9c8"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#frogward-product-bg)"/>
  <rect x="38" y="38" width="524" height="524" rx="34" fill="#fbfaf4" stroke="#d6d0bf" stroke-width="3"/>
  <circle cx="300" cy="214" r="78" fill="#17352c" opacity="0.08"/>
  <text x="300" y="276" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="4" fill="#17352c">frogward</text>
  <rect x="180" y="292" width="240" height="10" rx="5" fill="#c79b2c"/>
  <text x="300" y="362" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="2" fill="#17352c">product here</text>
  <text x="300" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#5f6b65">Branded SVG placeholder</text>
</svg>`;

export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(productPlaceholderSvg)}`;

const isRemoteImage = (image?: string) => /^https?:\/\//i.test(image?.trim() || '');

const normalizeProductImage = (image?: string) => {
  const trimmed = image?.trim() || '';

  if (!trimmed) return '';
  if (isRemoteImage(trimmed)) return DEFAULT_PRODUCT_IMAGE;

  return trimmed;
};

export const sanitizeProductImage = (image?: string) =>
  normalizeProductImage(image) || DEFAULT_PRODUCT_IMAGE;

export const resolveProductImage = (
  products: Product[],
  productId: string,
  fallback?: string
) => {
  const current = products.find((product) => product.id === productId)?.image;
  return normalizeProductImage(current) || normalizeProductImage(fallback) || DEFAULT_PRODUCT_IMAGE;
};
