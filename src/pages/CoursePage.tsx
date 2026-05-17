import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchCourse, enrollStudent, isEnrolled } from "@/lib/courseApi";
import type { Course } from "@/data/mockData";
import { toast } from "sonner";
import { PlayCircle, Clock, BookOpen, CheckCircle2 } from "lucide-react";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const c = await fetchCourse(id);
      setCourse(c);
      if (c && user) {
        const already = await isEnrolled(user.id, c.id);
        setEnrolled(already);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

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

  if (!course) return <div className="container py-20">Curso no encontrado.</div>;

  // Ocultar borradores a quienes no son el instructor ni admin
  const canSeeDraft = role === "admin" || (role === "instructor" && user?.id === course.instructorId);
  if (!course.published && !canSeeDraft) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container flex flex-col items-center justify-center py-40 text-center">
          <div className="mb-4 text-5xl">🔒</div>
          <h1 className="mb-2 text-2xl font-semibold font-sans">Curso temporalmente no disponible</h1>
          <p className="mb-6 max-w-md text-muted-foreground">
            Este curso está actualmente despublicado. Si crees que es un error, ponte en contacto con el equipo de Academia Creativa.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/courses">Ver otros cursos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  const buy = async () => {
    if (!role || !user) { navigate("/login"); return; }
    setBuying(true);
    const { error } = await enrollStudent(user.id, course.id);
    setBuying(false);
    if (error) { toast.error("Error al matricularse"); return; }
    toast.success("¡Te has matriculado correctamente!");
    navigate("/student");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container pt-6">
        <BackButton />
      </div>
      <article className="container grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl shadow-lift">
            <img src={course.image} alt={course.title} width={1024} height={768} className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{course.category}</span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl font-sans">{course.title}</h1>
            <p className="text-muted-foreground">por <span className="font-medium font-sans text-foreground">{course.instructor}</span></p>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/80">{course.description}</p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold font-sans">Contenido del curso</h2>
            <div className="space-y-3">
              {course.modules.map((m, i) => (
                <div key={m.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between bg-secondary/60 px-5 py-3 font-sans">
                    <h3 className="font-medium font-sans">Módulo {i + 1}: {m.title}</h3>
                    <span className="text-xs text-muted-foreground">{m.lessons.length} lecciones</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                        <span className="flex items-center gap-3">
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          {l.title}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {l.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            {enrolled ? (
              <>
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-2 text-sm text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium font-sans">Ya estás matriculado</span>
                </div>
                <Button asChild size="lg" className="w-full rounded-full">
                  <Link to={`/learn/${course.id}`}>Continuar curso</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="mb-1 text-sm text-muted-foreground">Acceso de por vida</div>
                <div className="mb-6 text-4xl font-semibold font-sans">
                  {course.price === 0 ? "Gratis" : `${course.price} €`}
                </div>
                <Button onClick={buy} size="lg" className="w-full rounded-full" disabled={buying}>
                  {buying ? "Procesando..." : "Comprar curso"}
                </Button>
              </>
            )}
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {course.modules.length} módulos · {totalLessons} lecciones</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Avanza a tu ritmo</li>
            </ul>
            <Link to="/courses" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">← Volver a cursos</Link>
          </div>
        </aside>
      </article>
    </div>
  );
};

export default CoursePage;
