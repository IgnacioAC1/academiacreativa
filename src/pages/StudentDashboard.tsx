import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchEnrollments, fetchCourse } from "@/lib/courseApi";
import type { Course } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type EnrolledCourse = {
  course: Course;
  progress: number;
};

const StudentDashboardInner = () => {
  const { profile, user } = useAuth();
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchEnrollments(user.id).then(async (enrollments) => {
      const resolved = await Promise.all(
        enrollments.map(async ({ courseId, progress }) => {
          const course = await fetchCourse(courseId);
          if (!course) return null;
          return { course, progress };
        })
      );
      setMyCourses(resolved.filter(Boolean) as EnrolledCourse[]);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">Estudiante</p>
          <h1 className="text-4xl font-semibold font-sans">
            Hola, {profile?.full_name ?? "estudiante"}
          </h1>
          <p className="mt-2 text-muted-foreground">Continúa donde lo dejaste.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : myCourses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="mb-4 text-muted-foreground">Aún no te has matriculado en ningún curso.</p>
            <Button asChild className="rounded-full">
              <Link to="/courses">Explorar cursos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {myCourses.map(({ course, progress }) => (
              <article key={course.id} className="overflow-hidden rounded-2xl bg-card shadow-card">
                <div className="grid grid-cols-[140px_1fr] gap-0 sm:grid-cols-[200px_1fr]">
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="space-y-3 p-5">
                    <span className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">
                      {course.category}
                    </span>
                    <h3 className="font-serif text-xl font-semibold leading-snug">{course.title}</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                    <Button asChild size="sm" className="rounded-full">
                      <Link to={`/learn/${course.id}`}>
                        {progress === 100 ? "Revisar" : "Continuar"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const StudentDashboard = () => (
  <ProtectedRoute role="student">
    <StudentDashboardInner />
  </ProtectedRoute>
);

export default StudentDashboard;
