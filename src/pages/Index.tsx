import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import CourseCard from "@/components/CourseCard";
import ValueProps from "@/components/ValueProps";
import EventsRow from "@/components/EventsRow";
import FAQ from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mockData";
import hero from "@/assets/hero.jpg";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const visible = courses.filter((c) => c.published);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section
        className="relative overflow-hidden bg-black bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div className="container relative min-h-[78vh] flex-col gap-6 py-20 md:py-28 text-center flex items-center justify-end">
          <h1 translate="no" className="max-w-3xl text-5xl font-semibold leading-[1.05] text-white md:text-6xl font-sans">
            <span>Aprende de los mejores</span>
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Formación especializada en diseño gráfico, branding y comunicación visual. Para profesionales que quieren subir de nivel.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full bg-white px-7 text-black hover:bg-white/90">
              <a href="#cursos">Explorar cursos</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white border-2">
              <Link to="/login">Empezar ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="cursos" className="container py-[24px]">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl font-sans">Cursos destacados</h2>
            <p className="mt-2 font-medium text-secondary-foreground">​Impulsa tu carrera con las habilidades más demandadas del sector.</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} hidePrice />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link to="/courses">Ver todos los cursos</Link>
          </Button>
        </div>
      </section>

      <ValueProps />
      <EventsRow />
      <FAQ />

      <footer className="border-t border-border/60 py-10">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 Academia Creativa</p>
          <p>Diseñado para creativos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
