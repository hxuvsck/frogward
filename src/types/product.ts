export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  nameMn?: string;
  description: string;
  descriptionEn?: string;
  descriptionMn?: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  specs?: Record<string, string>;
  images?: string[];
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
};
