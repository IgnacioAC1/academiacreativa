import { useParams, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { courses } from "@/data/mockData";
import { getSession } from "@/lib/auth";
import { Check, Play, Clock } from "lucide-react";

const CourseViewer = () => {
  const { id } = useParams();
  const session = getSession();
  if (!session || session.role !== "student") return <Navigate to="/login" replace />;

  const course = courses.find((c) => c.id === id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string>(course?.modules[0]?.lessons[0]?.id ?? "");

  if (!course) return <div className="container py-20">Curso no encontrado.</div>;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const active = allLessons.find((l) => l.id === activeId) ?? allLessons[0];

  const toggle = (lid: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(lid) ? next.delete(lid) : next.add(lid);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <BackButton fallback="/student" label="Mi panel" />
          <div className="aspect-video overflow-hidden rounded-2xl bg-foreground/95">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-background/80">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-background/10 backdrop-blur">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </div>
              <p className="text-sm">Reproductor de vídeo (demo)</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{course.title}</p>
            <h1 className="mt-1 text-3xl font-semibold font-sans">{active.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" /> {active.duration}
            </p>
            <button
              onClick={() => toggle(active.id)}
              className={`mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium font-sans transition-smooth ${
                completed.has(active.id)
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <Check className="h-4 w-4" />
              {completed.has(active.id) ? "Lección completada" : "Marcar como completada"}
            </button>
          </div>
        </main>

        <aside className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 px-2 text-lg font-semibold font-sans">Contenido</h2>
          <div className="space-y-4">
            {course.modules.map((m, i) => (
              <div key={m.id}>
                <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">
                  Módulo {i + 1} · {m.title}
                </h3>
                <ul className="mt-1 space-y-0.5">
                  {m.lessons.map((l) => {
                    const done = completed.has(l.id);
                    const isActive = l.id === activeId;
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => setActiveId(l.id)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-smooth ${
                            isActive ? "bg-secondary font-medium font-sans" : "hover:bg-secondary/60"
                          }`}
                        >
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${done ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}>
                            {done && <Check className="h-3 w-3" />}
                          </span>
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="text-xs text-muted-foreground">{l.duration}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseViewer;
