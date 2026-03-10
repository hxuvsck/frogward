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
import type { MarketingBanner } from '@/types/marketing-banner';

const AUTO_ADVANCE_MS = 5000;

const HomeMarketingCarousel = ({
  banners,
  fallbackImage,
}: {
  banners: MarketingBanner[];
  fallbackImage: string;
}) => {
  const [api, setApi] = useState<CarouselApi>();

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

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: slides.length > 1 }}
      className="h-full w-full"
    >
      <CarouselContent className="ml-0 h-full">
        {slides.map((banner) => (
          <CarouselItem key={banner.id} className="pl-0">
            {'slug' in banner && banner.slug ? (
              <Link to={`/stories/${banner.slug}`} className="block h-full">
                <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
              </Link>
            ) : (
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      {slides.length > 1 ? (
        <>
          <CarouselPrevious className="left-4 border-border bg-background/80 hover:bg-background" />
          <CarouselNext className="right-4 border-border bg-background/80 hover:bg-background" />
        </>
      ) : null}
    </Carousel>
  );
};

export default HomeMarketingCarousel;
