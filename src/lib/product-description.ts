import type { Product } from '@/types/product';
import type { Lang } from '@/store/lang-store';

const mnDescriptions: Record<string, string> = {
  'industrial-safety-helmet-pro':
    'Хүнд даацын ABS бүрхүүлтэй, тохируулгатай дотоод тулгууртай аюулгүйн малгай. ANSI Z89.1 стандартад нийцсэн. Агааржуулалтын нүх болон хөлс шингээгч туузтай.',
  'hi-vis-safety-vest-class3':
    'ANSI Class III шаардлага хангасан, гэрэл ойлгогч судалтай өндөр тод харагдах хантааз. Амьсгалдаг торон материалтай, олон халаастай.',
  'cut-resistant-work-gloves':
    'A5 түвшний зүсэлтээс хамгаалах, нитрил бүрээстэй ажлын бээлий. Нойтон болон хуурай орчинд маш сайн барьцтай.',
  'steel-toe-safety-boots':
    'Усны хамгаалалттай бүтэн ширэн, ган хошуутай аюулгүйн гутал. Цооролтоос хамгаалах дунд ултай, тос болон халтираанаас хамгаалсан ултай.',
  'anti-fog-safety-glasses':
    'Манан таталт болон зурааснаас хамгаалсан поликарбонат линзтэй хамгаалалтын шил. UV400 хамгаалалттай, нүд бүрхсэн загвартай.',
  'flame-resistant-coverall':
    'ATPV 8.5 cal/cm² үнэлгээтэй, галд тэсвэртэй комбинезон. Хоёр чиглэлийн цахилгаантай, олон зориулалтын халаастай.',
  'insulated-winter-work-jacket':
    'Усны хамгаалалттай, дулаалгатай өвлийн ажлын хүрэм. Маш хүйтэн нөхцөлд тохиромжтой, салдаг бүрх малгайтай.',
  'heavy-duty-leather-gloves':
    'Дээд зэрэглэлийн үхрийн ширэн, халуунд тэсвэртэй доторлогоотой хүнд даацын бээлий. Шуу хамгаалах урт ханцуйвчтай.',
};

export const getLocalizedProductDescription = (product: Product, lang: Lang) => {
  if (lang === 'mn') {
    return mnDescriptions[product.slug] ?? product.description;
  }
  return product.description;
};

