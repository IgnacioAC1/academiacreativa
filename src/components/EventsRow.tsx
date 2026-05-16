import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const EventsRow = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", () => {
      setSnaps(api.scrollSnapList());
      onSelect();
    });
  }, [api]);

  return (
    <section id="eventos" className="bg-muted/40 py-[24px]">
      <div className="container">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold md:text-4xl font-sans">Próximos eventos</h2>
          <p className="mt-2 font-medium text-secondary-foreground">
            Talleres y sesiones en directo para aprender y conectar.
          </p>
        </div>

        <Carousel setApi={setApi} opts={{ align: "start" }}>
          <CarouselContent>
            {events.map((e) => (
              <CarouselItem key={e.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <EventCard event={e} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsRow;
