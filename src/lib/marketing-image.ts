const marketingPlaceholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="FrogWard marketing placeholder">
  <rect width="1200" height="675" fill="#f5f5f4"/>
  <rect x="48" y="48" width="1104" height="579" rx="36" fill="#ffffff" stroke="#e7e5e4" stroke-width="4"/>
  <text x="600" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="84" font-weight="700" fill="#111111">FROG</text>
  <text x="600" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="84" font-weight="700" fill="#111111">WARD</text>
  <rect x="420" y="438" width="360" height="16" rx="8" fill="#d4a200"/>
  <text x="600" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="500" fill="#57534e">Your marketing here</text>
</svg>`;

export const DEFAULT_MARKETING_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(marketingPlaceholderSvg)}`;

export const resolveMarketingImage = (image?: string) => image || DEFAULT_MARKETING_IMAGE;
