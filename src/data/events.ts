import workshop from "@/assets/event-workshop.jpg";
import live from "@/assets/event-live.jpg";
import meetup from "@/assets/event-meetup.jpg";
import branding from "@/assets/event-branding.jpg";

export type Event = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  description: string;
  image: string;
  tag: "Gratis" | "En directo";
  location: string;
  host: string;
};

export const events: Event[] = [
  {
    id: "e1",
    title: "Masterclass: construye tu sistema de marca",
    date: "2026-05-18",
    dateLabel: "18 May · 18:00",
    description: "Una sesión práctica para crear sistemas de marca coherentes y escalables.",
    image: branding,
    tag: "En directo",
    location: "Online · Zoom",
    host: "Marta Ríos",
  },
  {
    id: "e2",
    title: "Taller de motion para redes sociales",
    date: "2026-05-24",
    dateLabel: "24 May · 17:30",
    description: "Animaciones rápidas y efectivas para Instagram y TikTok con After Effects.",
    image: live,
    tag: "Gratis",
    location: "Online · YouTube",
    host: "Diego Ferrer",
  },
  {
    id: "e3",
    title: "Encuentro creativo en Madrid",
    date: "2026-06-07",
    dateLabel: "7 Jun · 11:00",
    description: "Una mañana de sketching, networking y charlas con la comunidad creativa.",
    image: meetup,
    tag: "Gratis",
    location: "Madrid · Espacio Naranjo",
    host: "Comunidad Academia Creativa",
  },
  {
    id: "e4",
    title: "Sesión Q&A: vivir del diseño freelance",
    date: "2026-06-15",
    dateLabel: "15 Jun · 19:00",
    description: "Resuelve tus dudas sobre clientes, precios y rutina freelance.",
    image: workshop,
    tag: "En directo",
    location: "Online · Zoom",
    host: "Lucía Moreno",
  },
];
