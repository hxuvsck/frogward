export interface MarketingBanner {
  id: string;
  title: string;
  titleEn?: string;
  titleMn?: string;
  slug: string;
  summary: string;
  summaryEn?: string;
  summaryMn?: string;
  content: string;
  contentEn?: string;
  contentMn?: string;
  image: string;
  focalX: number;
  focalY: number;
  zoom: number;
  active: boolean;
}
