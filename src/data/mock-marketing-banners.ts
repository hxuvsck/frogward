import type { MarketingBanner } from '@/types/marketing-banner';

export const marketingBanners: MarketingBanner[] = [
  {
    id: 'banner-1',
    title: 'Premium Site Visibility Kits',
    slug: 'premium-site-visibility-kits',
    summary: 'High-visibility sets for mine crews, civil contractors, and industrial safety teams.',
    content:
      'FrogWard now offers new visibility kits built for crews working in low-light and high-traffic environments. Each kit combines high-visibility outerwear, durable reflective trims, and industrial-ready materials suited for repeated site use. This release is aimed at contractors and industrial buyers who need fast procurement for teams without sacrificing compliance or comfort.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=800&fit=crop',
    active: true,
  },
  {
    id: 'banner-2',
    title: 'Boots Built For Long Shifts',
    slug: 'boots-built-for-long-shifts',
    summary: 'Waterproof, steel-toe, and cold-rated protection for demanding field work.',
    content:
      'This new boot line is designed for long industrial shifts, combining waterproof construction, reinforced toe protection, and cold-weather readiness. The goal is to give site workers a durable option that performs across mining, logistics, and heavy construction workloads while staying comfortable for extended wear.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&h=800&fit=crop',
    active: true,
  },
  {
    id: 'banner-3',
    title: 'Outfit Teams At Scale',
    slug: 'outfit-teams-at-scale',
    summary: 'Fast procurement support for company-wide PPE restocks and seasonal rollout campaigns.',
    content:
      'FrogWard supports larger procurement cycles for companies that need consistent PPE supply across departments or active projects. This campaign highlights our ability to prepare seasonal rollouts, repeat orders, and team-wide restocks with practical catalog coverage for industrial use cases.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop',
    active: true,
  },
];
