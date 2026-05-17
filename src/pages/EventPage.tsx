import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, User } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import EventReservationDialog from "@/components/EventReservationDialog";
import { fetchEvent } from "@/lib/eventApi";
import type { Event } from "@/data/events";

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchEvent(id).then((e) => {
      setEvent(e);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex justify-center py-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold font-sans">Evento no encontrado</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="container max-w-4xl py-12">
        <BackButton />
        <div className="mt-6 overflow-hidden rounded-2xl">
          {event.image && (
            <img src={event.image} alt={event.title} width={1024} height={640} className="aspect-[16/9] w-full object-cover" />
          )}
        </div>
        <div className="mt-8 space-y-4">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium font-sans text-primary-foreground">
            {event.tag}
          </span>
          <h1 className="text-4xl font-semibold leading-tight font-sans md:text-5xl">{event.title}</h1>
          <p className="text-lg text-muted-foreground">{event.description}</p>

          <div className="grid gap-4 rounded-xl border border-border/60 bg-card p-6 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Fecha</p>
                <p className="font-medium font-sans">{event.dateLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Lugar</p>
                <p className="font-medium font-sans">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Imparte</p>
                <p className="font-medium font-sans">{event.host}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <EventReservationDialog
              eventTitle={event.title}
              trigger={<Button size="lg" className="rounded-full px-7">Reservar plaza</Button>}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventPage;
