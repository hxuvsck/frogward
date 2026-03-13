import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '@/data/mock-products';
import { sanitizeProductImage } from '@/lib/product-image';
import type { Product } from '@/types/product';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
}

const normalizeProduct = (product: Product): Product => {
  const name = product.name?.trim() || product.nameEn?.trim() || product.nameMn?.trim() || 'Untitled Product';
  const description =
    product.description?.trim() ||
    product.descriptionEn?.trim() ||
    product.descriptionMn?.trim() ||
    '';

  return {
    ...product,
    image: sanitizeProductImage(product.image),
    name,
    nameEn: product.nameEn?.trim() || name,
    nameMn: product.nameMn?.trim() || undefined,
    description,
    descriptionEn: product.descriptionEn?.trim() || description,
    descriptionMn: product.descriptionMn?.trim() || undefined,
  };
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts.map(normalizeProduct),
      addProduct: (product) => set((state) => ({ products: [normalizeProduct(product), ...state.products] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? normalizeProduct({ ...product, ...updates }) : product
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      toggleStock: (id) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, inStock: !product.inStock } : product
          ),
        })),
    }),
    {
      name: 'frogward-products',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as ProductStore | undefined;
        if (!state?.products) return persistedState;

        return {
          ...state,
          products: state.products.map((product) => normalizeProduct(product)),
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ProductStore> | undefined;
        const current = currentState as ProductStore;

        return {
          ...current,
          ...persisted,
          products: (persisted?.products ?? current.products).map((product) => normalizeProduct(product)),
        };
      },
    }
  )
);
