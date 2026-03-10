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

const slugifyBanner = (title: string, fallbackId: string) => {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return base || fallbackId;
};

const normalizeBanner = (banner: MarketingBanner): MarketingBanner => ({
  ...banner,
  slug: banner.slug?.trim() || slugifyBanner(banner.title, banner.id),
  focalX: typeof banner.focalX === 'number' ? banner.focalX : 50,
  focalY: typeof banner.focalY === 'number' ? banner.focalY : 50,
  zoom: typeof banner.zoom === 'number' ? banner.zoom : 100,
});

const ensureUniqueSlugs = (banners: MarketingBanner[]) => {
  const used = new Map<string, number>();

  return banners.map((banner) => {
    const normalized = normalizeBanner(banner);
    const count = used.get(normalized.slug) ?? 0;
    used.set(normalized.slug, count + 1);

    if (count === 0) return normalized;

    return {
      ...normalized,
      slug: `${normalized.slug}-${count + 1}`,
    };
  });
};

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set) => ({
      banners: ensureUniqueSlugs(initialBanners),
      addBanner: (banner) =>
        set((state) => ({ banners: ensureUniqueSlugs([banner, ...state.banners]) })),
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: ensureUniqueSlugs(state.banners.map((banner) =>
            banner.id === id ? normalizeBanner({ ...banner, ...updates }) : banner
          )),
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
    {
      name: 'frogward-marketing',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as MarketingStore | undefined;
        if (!state) return { banners: ensureUniqueSlugs(initialBanners) } as MarketingStore;

        return {
          ...state,
          banners: ensureUniqueSlugs(state.banners || initialBanners),
        } as MarketingStore;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<MarketingStore> | undefined;
        const current = currentState as MarketingStore;

        return {
          ...current,
          ...persisted,
          banners: ensureUniqueSlugs(persisted?.banners || current.banners),
        };
      },
    }
  )
);
