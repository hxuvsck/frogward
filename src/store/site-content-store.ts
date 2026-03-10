import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocalizedContent = {
  en: string;
  mn: string;
};

export interface SiteContentState {
  contactDescription: LocalizedContent;
  address: LocalizedContent;
  contactEmail: string;
  contactPhone: string;
  updateContent: (updates: Partial<Omit<SiteContentState, 'updateContent'>>) => void;
}

const initialState: Omit<SiteContentState, 'updateContent'> = {
  contactDescription: {
    en: 'Reach us for sales, orders, and company supply inquiries.',
    mn: 'Борлуулалт, захиалга, байгууллагын нийлүүлэлтийн талаар бидэнтэй холбогдоорой.',
  },
  address: {
    en: 'Ulaanbaatar, Mongolia',
    mn: 'Улаанбаатар, Монгол',
  },
  contactEmail: 'contact@frogward.mn',
  contactPhone: '+976 9911 2233',
};

const normalizeLocalized = (value: LocalizedContent | string | undefined, fallback: LocalizedContent): LocalizedContent => {
  if (typeof value === 'string') {
    const next = value.trim();
    return {
      en: next || fallback.en,
      mn: fallback.mn,
    };
  }

  return {
    en: value?.en?.trim() || fallback.en,
    mn: value?.mn?.trim() || fallback.mn,
  };
};

export const useSiteContentStore = create<SiteContentState>()(
  persist(
    (set) => ({
      ...initialState,
      updateContent: (updates) =>
        set((state) => ({
          ...state,
          ...updates,
          contactDescription: normalizeLocalized(updates.contactDescription, state.contactDescription),
          address: normalizeLocalized(updates.address, state.address),
          contactEmail: (updates.contactEmail ?? state.contactEmail).trim(),
          contactPhone: (updates.contactPhone ?? state.contactPhone).trim(),
        })),
    }),
    {
      name: 'frogward-site-content',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<SiteContentState> | undefined;
        if (!state) return persistedState;

        return {
          ...state,
          contactDescription: normalizeLocalized(state.contactDescription, initialState.contactDescription),
          address: normalizeLocalized(state.address, initialState.address),
          contactEmail: state.contactEmail?.trim() || initialState.contactEmail,
          contactPhone: state.contactPhone?.trim() || initialState.contactPhone,
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SiteContentState> | undefined;
        const current = currentState as SiteContentState;

        return {
          ...current,
          ...persisted,
          contactDescription: normalizeLocalized(persisted?.contactDescription, current.contactDescription),
          address: normalizeLocalized(persisted?.address, current.address),
          contactEmail: persisted?.contactEmail?.trim() || current.contactEmail,
          contactPhone: persisted?.contactPhone?.trim() || current.contactPhone,
        };
      },
    }
  )
);
