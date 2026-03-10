import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialCategories } from '@/data/mock-categories';
import type { Category } from '@/types/product';

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Pick<Category, 'name' | 'nameEn' | 'nameMn'>) => Category;
  updateCategory: (id: string, updates: Pick<Category, 'name' | 'nameEn' | 'nameMn'>) => void;
  deleteCategory: (id: string) => void;
}

const slugifyCategoryId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeCategory = (category: Category): Category => {
  const name = category.name?.trim() || category.nameEn?.trim() || category.nameMn?.trim() || 'Untitled Category';

  return {
    ...category,
    id: slugifyCategoryId(category.id || name) || `category-${Date.now()}`,
    name,
    nameEn: category.nameEn?.trim() || name,
    nameMn: category.nameMn?.trim() || undefined,
  };
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: initialCategories.map(normalizeCategory),
      addCategory: (categoryInput) => {
        const baseName = categoryInput.name.trim() || categoryInput.nameEn?.trim() || categoryInput.nameMn?.trim() || '';
        const seed = slugifyCategoryId(baseName) || `category-${Date.now()}`;
        const existingIds = new Set(get().categories.map((category) => category.id));
        let id = seed;
        let suffix = 2;

        while (existingIds.has(id)) {
          id = `${seed}-${suffix}`;
          suffix += 1;
        }

        const category = normalizeCategory({
          id,
          name: baseName,
          nameEn: categoryInput.nameEn,
          nameMn: categoryInput.nameMn,
        });

        set((state) => ({
          categories: [...state.categories, category],
        }));

        return category;
      },
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? normalizeCategory({
                  ...category,
                  name: updates.name,
                  nameEn: updates.nameEn,
                  nameMn: updates.nameMn,
                })
              : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
    }),
    {
      name: 'frogward-categories',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as CategoryStore | undefined;
        if (!state?.categories) return persistedState;

        return {
          ...state,
          categories: state.categories.map(normalizeCategory),
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CategoryStore> | undefined;
        const current = currentState as CategoryStore;

        return {
          ...current,
          ...persisted,
          categories: (persisted?.categories ?? current.categories).map(normalizeCategory),
        };
      },
    }
  )
);
