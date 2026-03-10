import type { MarketingBanner } from '@/types/marketing-banner';

export const marketingBanners: MarketingBanner[] = [
  {
    id: 'banner-1',
    eyebrow: 'New Arrival',
    title: 'Premium Site Visibility Kits',
    description: 'High-visibility sets for mine crews, civil contractors, and industrial safety teams.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=800&fit=crop',
    ctaLabel: 'Explore New Gear',
    ctaHref: '/products?category=vests',
    active: true,
  },
  {
    id: 'banner-2',
    eyebrow: 'Crew Ready',
    title: 'Boots Built For Long Shifts',
    description: 'Waterproof, steel-toe, and cold-rated protection for demanding field work.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&h=800&fit=crop',
    ctaLabel: 'Shop Safety Boots',
    ctaHref: '/products?category=boots',
    active: true,
  },
  {
    id: 'banner-3',
    eyebrow: 'Bulk Supply',
    title: 'Outfit Teams At Scale',
    description: 'Fast procurement support for company-wide PPE restocks and seasonal rollout campaigns.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop',
    ctaLabel: 'Browse All Products',
    ctaHref: '/products',
    active: true,
  },
];
