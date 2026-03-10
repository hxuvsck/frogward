import type { Lang } from '@/store/lang-store';

export const getLocalizedSiteContent = (value: { en: string; mn: string }, lang: Lang) =>
  (lang === 'mn' ? value.mn : value.en).trim() || (lang === 'mn' ? value.en : value.mn).trim();
