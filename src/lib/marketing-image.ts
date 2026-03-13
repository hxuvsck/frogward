const marketingPlaceholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="FrogWard marketing placeholder">
  <defs>
    <linearGradient id="frogward-banner-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e9e3cf"/>
      <stop offset="50%" stop-color="#f5f1e4"/>
      <stop offset="100%" stop-color="#d9d2bd"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#frogward-banner-bg)"/>
  <rect x="44" y="44" width="1112" height="587" rx="40" fill="#fbfaf4" stroke="#d6d0bf" stroke-width="4"/>
  <circle cx="986" cy="164" r="96" fill="#17352c" opacity="0.08"/>
  <circle cx="214" cy="500" r="126" fill="#c79b2c" opacity="0.12"/>
  <text x="600" y="304" text-anchor="middle" font-family="Arial, sans-serif" font-size="94" font-weight="800" letter-spacing="6" fill="#17352c">frogward</text>
  <rect x="390" y="328" width="420" height="16" rx="8" fill="#c79b2c"/>
  <text x="600" y="418" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" letter-spacing="3" fill="#17352c">banner here</text>
  <text x="600" y="482" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#5f6b65">Branded SVG placeholder</text>
</svg>`;

export const DEFAULT_MARKETING_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(marketingPlaceholderSvg)}`;

const isRemoteImage = (image?: string) => /^https?:\/\//i.test(image?.trim() || '');

const normalizeMarketingImage = (image?: string) => {
  const trimmed = image?.trim() || '';

  if (!trimmed) return '';
  if (isRemoteImage(trimmed)) return DEFAULT_MARKETING_IMAGE;

  return trimmed;
};

export const sanitizeMarketingImage = (image?: string) =>
  normalizeMarketingImage(image) || DEFAULT_MARKETING_IMAGE;

export const resolveMarketingImage = (image?: string) =>
  normalizeMarketingImage(image) || DEFAULT_MARKETING_IMAGE;
