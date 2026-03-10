import type { Product } from '@/types/product';
import type { Lang } from '@/store/lang-store';

const normalizeText = (value?: string) => value?.trim() || '';

export const getLocalizedProductName = (product: Product, lang: Lang) => {
  const en = normalizeText(product.nameEn) || normalizeText(product.name);
  const mn = normalizeText(product.nameMn);

  if (lang === 'mn') {
    return mn || en;
  }

  return en || mn;
};

export const getLocalizedProductDescription = (product: Product, lang: Lang) => {
  const en = normalizeText(product.descriptionEn) || normalizeText(product.description);
  const mn = normalizeText(product.descriptionMn);

  if (lang === 'mn') {
    return mn || en;
  }

  return en || mn;
};

export const matchesProductSearch = (product: Product, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const fields = [
    product.name,
    product.nameEn,
    product.nameMn,
    product.description,
    product.descriptionEn,
    product.descriptionMn,
    product.category,
  ];

  return fields.some((value) => value?.toLowerCase().includes(normalizedQuery));
};
