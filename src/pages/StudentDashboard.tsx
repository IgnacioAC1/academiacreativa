import { Link, Navigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses, enrollments } from "@/data/mockData";
import { getSession } from "@/lib/auth";

const StudentDashboard = () => {
  const session = getSession();
  if (!session || session.role !== "student") return <Navigate to="/login" replace />;

  const myCourses = enrollments
    .map((e) => ({ ...e, course: courses.find((c) => c.id === e.courseId)! }))
    .filter((x) => x.course);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="mb-6"><BackButton /></div>
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">Estudiante</p>
          <h1 className="text-4xl font-semibold font-sans">Hola, {session.name}</h1>
          <p className="mt-2 text-muted-foreground">Continúa donde lo dejaste.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {myCourses.map(({ course, progress }) => (
            <article key={course.id} className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="grid grid-cols-[140px_1fr] gap-0 sm:grid-cols-[200px_1fr]">
                <img src={course.image} alt={course.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="space-y-3 p-5">
                  <span className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">{course.category}</span>
                  <h3 className="font-serif text-xl font-semibold leading-snug">{course.title}</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progreso</span><span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <Button asChild size="sm" className="rounded-full">
                    <Link to={`/learn/${course.id}`}>{progress === 100 ? "Revisar" : "Continuar"}</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
