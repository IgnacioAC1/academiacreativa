import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/data/mockData";
import { fetchCourse, saveCourse, updateCoursePublished } from "@/lib/courseApi";
import { fetchCategories, type Category } from "@/lib/categoryApi";
import CategoryManagerDialog from "@/components/admin/CategoryManagerDialog";
import { uploadImage, courseImagePath } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";


type Props = { scope: "admin" | "instructor" };

const CourseEditorInner = ({ scope }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCategories().then(setCategories); }, []);

  useEffect(() => {
    if (!id) return;
    fetchCourse(id).then((c) => {
      if (!c) { navigate(scope === "admin" ? "/admin" : "/instructor"); return; }
      if (scope === "instructor" && c.instructorId !== profile?.id) {
        navigate("/instructor");
        return;
      }
      setCourse(c);
      setLoading(false);
    });
  }, [id, profile?.id]);

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

  if (!course) return null;

  const update = (patch: Partial<Course>) => setCourse({ ...course, ...patch });

  const addLesson = (mid: string) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === mid
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                { id: crypto.randomUUID(), title: "Nueva lección", duration: "5:00" },
              ],
            }
          : m
      ),
    });
  };

  const removeLesson = (mid: string, lid: string) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === mid ? { ...m, lessons: m.lessons.filter((l) => l.id !== lid) } : m
      ),
    });
  };

  const setLessonVideo = (mid: string, lid: string, video: string) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === mid
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lid ? { ...l, video } : l)) }
          : m
      ),
    });
  };

  const addModule = () => {
    const mid = crypto.randomUUID();
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        { id: mid, title: `Módulo ${course.modules.length + 1}`, lessons: [] },
      ],
    });
  };

  const renameLesson = (mid: string, lid: string, title: string) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === mid ? { ...m, lessons: m.lessons.map((l) => (l.id === lid ? { ...l, title } : l)) } : m
      ),
    });
  };

  const renameModule = (mid: string, title: string) => {
    setCourse({ ...course, modules: course.modules.map((m) => (m.id === mid ? { ...m, title } : m)) });
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const path = courseImagePath(course.id, file.name);
      const url = await uploadImage("courses", path, file);
      update({ image: url });
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error al subir la imagen");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await saveCourse(course);
    setSaving(false);
    if (error) toast.error(`Error: ${error}`);
    else toast.success("Cambios guardados");
  };

  const handleTogglePublish = async () => {
    await updateCoursePublished(course.id, !course.published);
    update({ published: !course.published });
    toast.success(course.published ? "Curso despublicado" : "Curso publicado");
  };

  const backHref = scope === "admin" ? "/admin" : "/instructor";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container max-w-4xl py-10">
        <BackButton fallback={backHref} />
        <div className="mt-2 mb-8 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-semibold font-sans">Editar curso</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={handleTogglePublish}>
              {course.published ? "Despublicar" : "Publicar"}
            </Button>
            <Button className="rounded-full" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>

        <section className="grid gap-6 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={course.title} onChange={(e) => update({ title: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Descripción</Label>
            <Textarea id="desc" rows={4} value={course.description} onChange={(e) => update({ description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input id="price" type="number" value={course.price} onChange={(e) => update({ price: Number(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <div className="flex items-center gap-1">
                <Select value={course.category} onValueChange={(v) => update({ category: v })}>
                  <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CategoryManagerDialog onChanged={() => fetchCategories().then(setCategories)} />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Imagen de portada</Label>
            {course.image && (
              <img src={course.image} alt="Portada" className="h-40 w-full max-w-sm rounded-xl object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/40 sm:max-w-sm">
              <Upload className="h-4 w-4" />
              Subir imagen (JPEG / PNG / WebP, máx. 5 MB)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
              />
            </label>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-semibold font-sans">Módulos y lecciones</h2>
            <Button variant="outline" size="sm" className="rounded-full" onClick={addModule}>
              <Plus className="mr-1 h-4 w-4" /> Añadir módulo
            </Button>
          </div>

          <div className="space-y-4">
            {course.modules.map((m, i) => (
              <div key={m.id} className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Módulo {i + 1}</span>
                  <Input
                    value={m.title}
                    onChange={(e) => renameModule(m.id, e.target.value)}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                </div>
                <ul className="divide-y divide-border">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={l.title}
                          onChange={(e) => renameLesson(m.id, l.id, e.target.value)}
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                        />
                        <span className="text-xs text-muted-foreground">{l.duration}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeLesson(m.id, l.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-col gap-2 pl-1 sm:flex-row sm:items-center">
                        <Label className="text-xs text-muted-foreground sm:w-20">Vídeo</Label>
                        <Input
                          placeholder="URL del vídeo (YouTube, Vimeo, mp4...)"
                          value={l.video ?? ""}
                          onChange={(e) => setLessonVideo(m.id, l.id, e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="file"
                          accept="video/*"
                          className="sm:max-w-[220px]"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setLessonVideo(m.id, l.id, URL.createObjectURL(file));
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-3">
                  <Button variant="ghost" size="sm" onClick={() => addLesson(m.id)}>
                    <Plus className="mr-1 h-4 w-4" /> Añadir lección
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const CourseEditor = ({ scope }: Props) => (
  <ProtectedRoute role={scope === "admin" ? "admin" : "instructor"}>
    <CourseEditorInner scope={scope} />
  </ProtectedRoute>
);

export default CourseEditor;
