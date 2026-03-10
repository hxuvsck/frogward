import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { marketingBanners as initialBanners } from '@/data/mock-marketing-banners';
import type { MarketingBanner } from '@/types/marketing-banner';

interface MarketingStore {
  banners: MarketingBanner[];
  addBanner: (banner: MarketingBanner) => void;
  updateBanner: (id: string, updates: Partial<MarketingBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
}

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set) => ({
      banners: initialBanners,
      addBanner: (banner) => set((state) => ({ banners: [banner, ...state.banners] })),
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: state.banners.map((banner) =>
            banner.id === id ? { ...banner, ...updates } : banner
          ),
        })),
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((banner) => banner.id !== id),
        })),
      toggleBanner: (id) =>
        set((state) => ({
          banners: state.banners.map((banner) =>
            banner.id === id ? { ...banner, active: !banner.active } : banner
          ),
        })),
    }),
    { name: 'frogward-marketing' }
  )
);
