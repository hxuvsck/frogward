import type { Lang } from '@/store/lang-store';
import type { Category, Product } from '@/types/product';

export const getLocalizedCategoryName = (category: Category, lang: Lang) => {
  const primary = lang === 'mn' ? category.nameMn : category.nameEn;
  const fallback = lang === 'mn' ? category.nameEn : category.nameMn;

  return primary?.trim() || fallback?.trim() || category.name || category.id;
};

export const getCategoryLabelById = (
  categoryId: string,
  categories: Category[],
  lang: Lang,
  fallback?: string
) => {
  const category = categories.find((item) => item.id === categoryId);
  return category ? getLocalizedCategoryName(category, lang) : fallback ?? categoryId;
};

export const getCategoriesWithCounts = (categories: Category[], products: Product[]) =>
  categories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.id).length,
  }));
