import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { marketingBanners as initialBanners } from '@/data/mock-marketing-banners';
import type { MarketingBanner } from '@/types/marketing-banner';

interface MarketingStore {
  banners: MarketingBanner[];
  addBanner: (banner: MarketingBanner) => void;
  updateBanner: (id: string, updates: Partial<MarketingBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
}

type MarketingStoreState = Pick<MarketingStore, 'banners'>;

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
  title: banner.title?.trim() || banner.titleEn?.trim() || banner.titleMn?.trim() || 'Untitled banner',
  titleEn: banner.titleEn?.trim() || banner.title?.trim() || 'Untitled banner',
  titleMn: banner.titleMn?.trim() || undefined,
  summary: banner.summary?.trim() || banner.summaryEn?.trim() || banner.summaryMn?.trim() || '',
  summaryEn: banner.summaryEn?.trim() || banner.summary?.trim() || '',
  summaryMn: banner.summaryMn?.trim() || undefined,
  content: banner.content?.trim() || banner.contentEn?.trim() || banner.contentMn?.trim() || '',
  contentEn: banner.contentEn?.trim() || banner.content?.trim() || '',
  contentMn: banner.contentMn?.trim() || undefined,
  image: typeof banner.image === 'string' ? banner.image : '',
  slug: banner.slug?.trim() || slugifyBanner(banner.title, banner.id),
  focalX: typeof banner.focalX === 'number' ? banner.focalX : 50,
  focalY: typeof banner.focalY === 'number' ? banner.focalY : 50,
  zoom: typeof banner.zoom === 'number' ? banner.zoom : 100,
  active: typeof banner.active === 'boolean' ? banner.active : true,
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

const isMarketingBanner = (value: unknown): value is MarketingBanner => {
  if (!value || typeof value !== 'object') return false;

  const banner = value as Partial<MarketingBanner>;
  return (
    typeof banner.id === 'string' &&
    typeof banner.title === 'string' &&
    typeof banner.summary === 'string' &&
    typeof banner.content === 'string'
  );
};

const sanitizeBanners = (banners: unknown): MarketingBanner[] => {
  if (!Array.isArray(banners)) return ensureUniqueSlugs(initialBanners);

  const normalized = banners
    .filter(isMarketingBanner)
    .map((banner) => normalizeBanner(banner));

  return normalized.length > 0 ? ensureUniqueSlugs(normalized) : ensureUniqueSlugs(initialBanners);
};

const safeStorage = createJSONStorage<MarketingStoreState>(() => ({
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      window.localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {}
  },
}));

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
      storage: safeStorage,
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<MarketingStore> | undefined;
        if (!state) return { banners: ensureUniqueSlugs(initialBanners) } as MarketingStore;

        return {
          ...state,
          banners: sanitizeBanners(state.banners),
        } as MarketingStore;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<MarketingStore> | undefined;
        const current = currentState as MarketingStore;

        return {
          ...current,
          ...persisted,
          banners: sanitizeBanners(persisted?.banners || current.banners),
        };
      },
    }
  )
);
