import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import CourseCard from "@/components/CourseCard";
import { fetchPublishedCourses } from "@/lib/courseApi";
import type { Course } from "@/data/mockData";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container py-16">
        <div className="mb-6"><BackButton /></div>
        <div className="mb-10">
          <h1 className="text-4xl font-semibold md:text-5xl font-sans">Todos los cursos</h1>
          <p className="mt-2 font-medium text-secondary-foreground">Explora el catálogo completo.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
      <footer className="border-t border-border/60 py-10 mt-10">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 Academia Creativa</p>
          <p>Diseñado para creativos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
