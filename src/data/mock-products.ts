import type { Product, Category } from '@/types/product';

export const categories: Category[] = [
  { id: 'helmets', name: 'Safety Helmets', icon: 'HardHat', count: 12 },
  { id: 'vests', name: 'Hi-Vis Vests', icon: 'Shirt', count: 18 },
  { id: 'gloves', name: 'Work Gloves', icon: 'Hand', count: 15 },
  { id: 'boots', name: 'Safety Boots', icon: 'Footprints', count: 20 },
  { id: 'eyewear', name: 'Eye Protection', icon: 'Glasses', count: 8 },
  { id: 'coveralls', name: 'Coveralls', icon: 'Shirt', count: 10 },
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'industrial-safety-helmet-pro',
    name: 'Industrial Safety Helmet Pro',
    description: 'Heavy-duty ABS shell safety helmet with adjustable suspension system. Meets ANSI Z89.1 standards. Features ventilation slots and integrated sweatband.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop',
    category: 'helmets',
    inStock: true,
    specs: { Material: 'ABS Plastic', Weight: '340g', Standard: 'ANSI Z89.1', Color: 'Yellow' },
  },
  {
    id: '2',
    slug: 'hi-vis-safety-vest-class3',
    name: 'Hi-Vis Safety Vest Class III',
    description: 'ANSI Class III compliant high-visibility vest with reflective stripes. Breathable mesh fabric with multiple pockets.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1618517048289-4e04bae8b3a7?w=600&h=600&fit=crop',
    category: 'vests',
    inStock: true,
    specs: { Material: 'Polyester Mesh', Class: 'ANSI Class III', Sizes: 'M-3XL', Color: 'Neon Yellow' },
  },
  {
    id: '3',
    slug: 'cut-resistant-work-gloves',
    name: 'Cut-Resistant Work Gloves',
    description: 'Level A5 cut-resistant gloves with nitrile coating. Superior grip in wet and dry conditions.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop',
    category: 'gloves',
    inStock: true,
    specs: { Material: 'HPPE + Nitrile', 'Cut Level': 'A5', Sizes: 'S-XXL', Coating: 'Sandy Nitrile' },
  },
  {
    id: '4',
    slug: 'steel-toe-safety-boots',
    name: 'Steel Toe Safety Boots',
    description: 'Waterproof full-grain leather boots with steel toe cap and puncture-resistant midsole. Oil and slip-resistant outsole.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    category: 'boots',
    inStock: true,
    specs: { Material: 'Full-Grain Leather', 'Toe Cap': 'Steel', Waterproof: 'Yes', Standard: 'ASTM F2413' },
  },
  {
    id: '5',
    slug: 'anti-fog-safety-glasses',
    name: 'Anti-Fog Safety Glasses',
    description: 'Polycarbonate lenses with anti-fog and anti-scratch coating. UV400 protection with wraparound design.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop',
    category: 'eyewear',
    inStock: true,
    specs: { Lens: 'Polycarbonate', UV: '400 Protection', Coating: 'Anti-fog/scratch', Weight: '28g' },
  },
  {
    id: '6',
    slug: 'flame-resistant-coverall',
    name: 'Flame Resistant Coverall',
    description: 'Inherently flame-resistant coverall rated for ATPV 8.5 cal/cm². Two-way zipper with multiple utility pockets.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=600&h=600&fit=crop',
    category: 'coveralls',
    inStock: false,
    specs: { Material: 'Nomex IIIA', ATPV: '8.5 cal/cm²', Standard: 'NFPA 2112', Sizes: 'S-4XL' },
  },
  {
    id: '7',
    slug: 'insulated-winter-work-jacket',
    name: 'Insulated Winter Work Jacket',
    description: 'Waterproof insulated jacket with hi-vis accents. Rated for extreme cold with detachable hood.',
    price: 156000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    category: 'coveralls',
    inStock: true,
    specs: { Material: 'Nylon/Polyester', Insulation: 'Thinsulate', Waterproof: 'Yes', Rating: '-40°C' },
  },
  {
    id: '8',
    slug: 'heavy-duty-leather-gloves',
    name: 'Heavy Duty Leather Gloves',
    description: 'Premium cowhide leather welding gloves with heat-resistant lining. Extended cuff for forearm protection.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
    category: 'gloves',
    inStock: true,
    specs: { Material: 'Cowhide Leather', 'Heat Resistance': '250°C', Length: '14"', Lining: 'Kevlar' },
  },
];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (category: string) => products.filter((p) => p.category === category);

export const getCategoriesWithCounts = (items: Product[]) =>
  categories.map((category) => ({
    ...category,
    count: items.filter((product) => product.category === category.id).length,
  }));
