import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getLocalizedBannerTitle } from '@/lib/marketing-localization';
import { resolveMarketingImage } from '@/lib/marketing-image';
import { useLangStore, useT } from '@/store/lang-store';
import type { MarketingBanner } from '@/types/marketing-banner';

const AUTO_ADVANCE_MS = 5000;
const getHeroImageStyle = (banner: MarketingBanner, isHovered = false) => ({
  objectPosition: `${banner.focalX ?? 50}% ${banner.focalY ?? 50}%`,
  transform: `scale(${((banner.zoom ?? 100) / 100) * (isHovered ? 1.03 : 1)})`,
  transformOrigin: `${banner.focalX ?? 50}% ${banner.focalY ?? 50}%`,
});

const HomeMarketingCarousel = ({
  banners,
  fallbackImage,
}: {
  banners: MarketingBanner[];
  fallbackImage: string;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  useEffect(() => {
    if (!api || banners.length <= 1) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
        return;
      }

      api.scrollTo(0);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [api, banners.length]);

  useEffect(() => {
    if (!api) return;

    const updateSelectedIndex = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    updateSelectedIndex();
    api.on('select', updateSelectedIndex);
    api.on('reInit', updateSelectedIndex);

    return () => {
      api.off('select', updateSelectedIndex);
      api.off('reInit', updateSelectedIndex);
    };
  }, [api]);

  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: 'default-hero',
            title: 'Industrial workspace',
            image: fallbackImage,
            ctaHref: '',
            active: true,
          } as MarketingBanner,
        ];
  const activeSlide = slides[selectedIndex] ?? slides[0];

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: slides.length > 1 }}
      className="h-full w-full"
      onMouseEnter={() => setIsHeroHovered(true)}
      onMouseLeave={() => setIsHeroHovered(false)}
    >
      <CarouselContent className="ml-0 h-full">
        {slides.map((banner, index) => (
          <CarouselItem key={banner.id} className="h-full pl-0">
            {'slug' in banner && banner.slug ? (
              <Link to={`/stories/${banner.slug}`} className="group block h-full overflow-hidden">
                <img
                  src={resolveMarketingImage(banner.image)}
                  alt={getLocalizedBannerTitle(banner, lang)}
                  className="h-full w-full object-cover transition duration-300 ease-out"
                  style={getHeroImageStyle(banner, isHeroHovered && index === selectedIndex)}
                />
              </Link>
            ) : (
              <div className="h-full overflow-hidden">
                <img
                  src={resolveMarketingImage(banner.image)}
                  alt={getLocalizedBannerTitle(banner, lang)}
                  className="h-full w-full object-cover transition duration-300 ease-out"
                  style={getHeroImageStyle(banner, isHeroHovered && index === selectedIndex)}
                />
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      {'slug' in activeSlide && activeSlide.slug ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className={`rounded-full border border-primary/50 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition duration-200 ease-out ${isHeroHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {t('hero.visitPost')}
          </div>
        </div>
      ) : null}
      {slides.length > 1 ? (
        <>
          <CarouselPrevious className="left-3 top-1/2 h-9 w-9 -translate-y-1/2 border-border bg-background/85 hover:bg-background sm:left-4 sm:h-10 sm:w-10" />
          <CarouselNext className="right-3 top-1/2 h-9 w-9 -translate-y-1/2 border-border bg-background/85 hover:bg-background sm:right-4 sm:h-10 sm:w-10" />
        </>
      ) : null}
    </Carousel>
  );
};

export default HomeMarketingCarousel;
