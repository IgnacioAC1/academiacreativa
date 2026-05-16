import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/data/events";

const EventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/event/${event.id}`}
    className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-lift"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
      <img
        src={event.image}
        alt={event.title}
        loading="lazy"
        width={1024}
        height={640}
        className="h-full w-full object-cover transition-smooth group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium font-sans text-primary-foreground">
        {event.tag}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-2 p-5">
      <div className="flex items-center gap-2 text-xs font-medium font-sans uppercase tracking-wider text-primary">
        <Calendar className="h-3.5 w-3.5" />
        {event.dateLabel}
      </div>
      <h3 className="text-lg font-semibold leading-snug font-sans">{event.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {event.location}
        </span>
        <span className="text-sm font-medium font-sans text-primary opacity-0 transition-smooth group-hover:opacity-100">
          Ver evento →
        </span>
      </div>
    </div>
  </Link>
);

export default EventCard;
