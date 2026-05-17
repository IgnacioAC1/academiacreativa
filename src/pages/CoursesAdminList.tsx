import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/mockData";
import { fetchAllCourses, createCourse, updateCoursePublished, deleteCourse } from "@/lib/courseApi";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminDashboard from "@/components/AdminDashboard";
import EventsManager from "@/components/EventsManager";
import UserRoleManager from "@/components/admin/UserRoleManager";
import EventLeadsManager from "@/components/admin/EventLeadsManager";
import CategoryManager from "@/components/admin/CategoryManager";
import ProtectedRoute from "@/components/ProtectedRoute";

type Props = { scope: "admin" | "instructor" };

const CoursesAdminListInner = ({ scope }: Props) => {
  const { profile } = useAuth();
  const [list, setList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await fetchAllCourses();
    setList(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visible =
    scope === "admin"
      ? list
      : list.filter((c) => c.instructorId === profile?.id);

  const handleDelete = async (id: string) => {
    const { error } = await deleteCourse(id);
    if (error) { toast.error("Error al eliminar el curso"); return; }
    toast.success("Curso eliminado");
    setList((prev) => prev.filter((c) => c.id !== id));
  };

  const togglePublish = async (id: string, current: boolean) => {
    await updateCoursePublished(id, !current);
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, published: !current } : c)));
    toast.success("Estado actualizado");
  };

  const handleCreate = async () => {
    if (!profile?.id) return;
    const id = await createCourse({
      id: "",
      title: "Nuevo curso sin título",
      category: "Diseño",
      instructor: profile.full_name ?? "Instructor",
      instructorId: profile.id,
      price: 97,
      image: "",
      description: "Describe tu curso...",
      published: false,
    });
    if (!id) { toast.error("Error al crear el curso"); return; }
    toast.success("Curso creado");
    load();
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
          <Button onClick={handleCreate} className="rounded-full" size="lg">
            <Plus className="mr-2 h-4 w-4" /> Crear curso
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
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
                        {c.image ? (
                          <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-14 rounded bg-secondary" />
                        )}
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
                        <Button variant="ghost" size="sm" onClick={() => togglePublish(c.id, c.published)}>
                          {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`${editPath}/${c.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        {scope === "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {scope === "admin" && (
          <>
            <EventsManager />
            <EventLeadsManager />
            <CategoryManager />
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
