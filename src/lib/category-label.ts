import type { TranslationKey } from '@/store/lang-store';

const categoryTranslationKeys: Record<string, TranslationKey> = {
  helmets: 'cat.helmets',
  vests: 'cat.vests',
  gloves: 'cat.gloves',
  boots: 'cat.boots',
  eyewear: 'cat.eyewear',
  coveralls: 'cat.coveralls',
};

export const getCategoryLabel = (
  categoryId: string,
  t: (key: TranslationKey) => string,
  fallback?: string
) => {
  const key = categoryTranslationKeys[categoryId];
  return key ? t(key) : fallback ?? categoryId;
};

