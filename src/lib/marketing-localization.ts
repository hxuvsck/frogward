import type { Lang } from '@/store/lang-store';
import type { MarketingBanner } from '@/types/marketing-banner';

const normalizeText = (value?: string) => value?.trim() || '';

export const getLocalizedBannerTitle = (banner: MarketingBanner, lang: Lang) => {
  const en = normalizeText(banner.titleEn) || normalizeText(banner.title);
  const mn = normalizeText(banner.titleMn);

  if (lang === 'mn') {
    return mn || en;
  }

  return en || mn;
};

export const getLocalizedBannerSummary = (banner: MarketingBanner, lang: Lang) => {
  const en = normalizeText(banner.summaryEn) || normalizeText(banner.summary);
  const mn = normalizeText(banner.summaryMn);

  if (lang === 'mn') {
    return mn || en;
  }

  return en || mn;
};

export const getLocalizedBannerContent = (banner: MarketingBanner, lang: Lang) => {
  const en = normalizeText(banner.contentEn) || normalizeText(banner.content);
  const mn = normalizeText(banner.contentMn);

  if (lang === 'mn') {
    return mn || en;
  }

  return en || mn;
};

export const matchesBannerSearch = (banner: MarketingBanner, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const fields = [
    banner.title,
    banner.titleEn,
    banner.titleMn,
    banner.summary,
    banner.summaryEn,
    banner.summaryMn,
    banner.content,
    banner.contentEn,
    banner.contentMn,
    banner.image,
  ];

  return fields.some((value) => value?.toLowerCase().includes(normalizedQuery));
};
