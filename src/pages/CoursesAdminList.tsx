import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { courses as seedCourses, type Course } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AdminDashboard from "@/components/AdminDashboard";
import EventsManager from "@/components/EventsManager";
import UserRoleManager from "@/components/admin/UserRoleManager";
import ProtectedRoute from "@/components/ProtectedRoute";

type Props = { scope: "admin" | "instructor" };

const CoursesAdminListInner = ({ scope }: Props) => {
  const { profile } = useAuth();
  const [list, setList] = useState<Course[]>(seedCourses);

  const visible =
    scope === "admin"
      ? list
      : list.filter((c) => c.instructorId === profile?.id);

  const togglePublish = (id: string) => {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c)));
    toast.success("Estado actualizado");
  };

  const createCourse = () => {
    const id = `c${Date.now()}`;
    const fresh: Course = {
      id,
      title: "Nuevo curso sin título",
      category: "Diseño",
      instructor: profile?.full_name ?? "Instructor",
      instructorId: profile?.id ?? "",
      price: 97,
      image: list[0].image,
      description: "Describe tu curso...",
      published: false,
      modules: [
        { id: "m1", title: "Módulo 1", lessons: [{ id: "m1-l0", title: "Lección 1", duration: "5:00" }] },
      ],
    };
    setList((prev) => [fresh, ...prev]);
    toast.success("Curso creado");
  };

  const editPath = scope === "admin" ? "/admin/course" : "/instructor/course";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        {scope === "admin" && <AdminDashboard />}

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground capitalize">{scope}</p>
            <h1 className="text-4xl font-semibold font-sans">
              {scope === "admin" ? "Todos los cursos" : "Mis cursos"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {scope === "admin" ? "Gestiona toda la plataforma." : "Crea y edita tus cursos."}
            </p>
          </div>
          <Button onClick={createCourse} className="rounded-full" size="lg">
            <Plus className="mr-2 h-4 w-4" /> Crear curso
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full">
            <thead className="bg-secondary/60 text-left text-sm">
              <tr>
                <th className="px-5 py-3 font-medium font-sans">Curso</th>
                <th className="hidden px-5 py-3 font-medium font-sans md:table-cell">Categoría</th>
                <th className="hidden px-5 py-3 font-medium font-sans lg:table-cell">Instructor</th>
                <th className="px-5 py-3 font-medium font-sans">Precio</th>
                <th className="px-5 py-3 font-medium font-sans">Estado</th>
                <th className="px-5 py-3 font-medium font-sans text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {visible.map((c) => (
                <tr key={c.id} className="transition-smooth hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" />
                      <span className="font-medium font-sans">{c.title}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{c.category}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{c.instructor}</td>
                  <td className="px-5 py-3">{c.price === 0 ? "Gratis" : `${c.price} €`}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium font-sans ${
                        c.published
                          ? "bg-accent/15 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => togglePublish(c.id)}>
                        {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`${editPath}/${c.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {scope === "admin" && (
          <>
            <EventsManager />
            <UserRoleManager />
          </>
        )}
      </main>
    </div>
  );
};

const CoursesAdminList = ({ scope }: Props) => (
  <ProtectedRoute role={scope === "admin" ? "admin" : "instructor"}>
    <CoursesAdminListInner scope={scope} />
  </ProtectedRoute>
);

export default CoursesAdminList;
