import type { Category } from '@/types/product';

export const initialCategories: Category[] = [
  { id: 'helmets', name: 'Safety Helmets', nameEn: 'Safety Helmets', nameMn: 'Аюулгүйн малгай', icon: 'HardHat' },
  { id: 'vests', name: 'Hi-Vis Vests', nameEn: 'Hi-Vis Vests', nameMn: 'Тусгай хантааз', icon: 'Shirt' },
  { id: 'gloves', name: 'Work Gloves', nameEn: 'Work Gloves', nameMn: 'Ажлын бээлий', icon: 'Hand' },
  { id: 'boots', name: 'Safety Boots', nameEn: 'Safety Boots', nameMn: 'Аюулгүйн гутал', icon: 'Footprints' },
  { id: 'eyewear', name: 'Eye Protection', nameEn: 'Eye Protection', nameMn: 'Нүдний хамгаалалт', icon: 'Glasses' },
  { id: 'coveralls', name: 'Coveralls', nameEn: 'Coveralls', nameMn: 'Комбинезон', icon: 'Shirt' },
];
