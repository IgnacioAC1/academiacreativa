import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { uploadImage, eventImagePath } from "@/lib/storage";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

type EventRow = {
  id: string;
  title: string;
  date: string;
  date_label: string;
  description: string;
  image_url: string;
  tag: "Gratis" | "En directo";
  location: string;
  host: string;
};

const emptyEvent = (): Omit<EventRow, "id"> => ({
  title: "Nuevo evento",
  date: new Date().toISOString().slice(0, 10),
  date_label: "Próximamente",
  description: "Describe tu evento...",
  image_url: "",
  tag: "Gratis",
  location: "Online",
  host: "",
});

const EventsManager = () => {
  const [list, setList] = useState<EventRow[]>([]);
  const [editing, setEditing] = useState<Partial<EventRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (error) { toast.error("Error al cargar eventos"); return; }
    setList(
      (data ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        date: (e.date as string).slice(0, 10),
        date_label: e.date_label ?? "",
        description: e.description ?? "",
        image_url: e.image_url ?? "",
        tag: e.tag as EventRow["tag"],
        location: e.location ?? "",
        host: e.host ?? "",
      }))
    );
  };

  const openCreate = () => {
    setIsNew(true);
    setEditing(emptyEvent());
  };

  const openEdit = (e: EventRow) => {
    setIsNew(false);
    setEditing({ ...e });
  };

  const handleImageUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const tempId = editing.id ?? `tmp-${Date.now()}`;
      const path = eventImagePath(tempId, file.name);
      const url = await uploadImage("events", path, file);
      setEditing({ ...editing, image_url: url });
      toast.success("Imagen subida");
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      title: editing.title ?? "",
      date: editing.date ?? new Date().toISOString(),
      date_label: editing.date_label ?? "",
      description: editing.description ?? "",
      image_url: editing.image_url ?? "",
      tag: editing.tag ?? "Gratis",
      location: editing.location ?? "",
      host: editing.host ?? "",
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("events").insert(payload));
    } else {
      ({ error } = await supabase.from("events").update(payload).eq("id", editing.id!));
    }

    setSaving(false);
    if (error) { toast.error("Error al guardar el evento"); return; }
    toast.success(isNew ? "Evento creado" : "Evento guardado");
    setEditing(null);
    loadEvents();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error("Error al eliminar el evento"); return; }
    toast.success("Evento eliminado");
    setList((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <section className="mt-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Admin</p>
          <h2 className="text-4xl font-semibold font-sans">Todos los eventos</h2>
          <p className="mt-2 text-muted-foreground">Gestiona los eventos de la plataforma.</p>
        </div>
        <Button onClick={openCreate} className="rounded-full" size="lg">
          <Plus className="mr-2 h-4 w-4" /> Crear evento
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full">
          <thead className="bg-secondary/60 text-left text-sm">
            <tr>
              <th className="px-5 py-3 font-medium font-sans">Evento</th>
              <th className="hidden px-5 py-3 font-medium font-sans md:table-cell">Fecha</th>
              <th className="hidden px-5 py-3 font-medium font-sans lg:table-cell">Ubicación</th>
              <th className="px-5 py-3 font-medium font-sans">Tipo</th>
              <th className="px-5 py-3 font-medium font-sans text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {list.map((e) => (
              <tr key={e.id} className="transition-smooth hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {e.image_url ? (
                      <img src={e.image_url} alt="" className="h-10 w-14 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-14 rounded bg-secondary" />
                    )}
                    <span className="font-medium font-sans">{e.title}</span>
                  </div>
                </td>
                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{e.date_label}</td>
                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{e.location}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium font-sans ${
                      e.tag === "En directo"
                        ? "bg-primary/15 text-primary"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {e.tag}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(e)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-sans">{isNew ? "Crear evento" : "Editar evento"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Imagen del evento</Label>
                <div className="flex items-center gap-3">
                  {editing.image_url ? (
                    <img src={editing.image_url} alt="" className="h-16 w-24 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="h-16 w-24 rounded-md bg-secondary border border-border" />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/40">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Subiendo..." : "Subir imagen"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ev-title">Título</Label>
                <Input
                  id="ev-title"
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ev-desc">Descripción</Label>
                <Textarea
                  id="ev-desc"
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="ev-date">Fecha</Label>
                  <Input
                    id="ev-date"
                    type="date"
                    value={editing.date ?? ""}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-dateLabel">Etiqueta de fecha</Label>
                  <Input
                    id="ev-dateLabel"
                    value={editing.date_label ?? ""}
                    onChange={(e) => setEditing({ ...editing, date_label: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="ev-location">Ubicación</Label>
                  <Input
                    id="ev-location"
                    value={editing.location ?? ""}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-host">Host</Label>
                  <Input
                    id="ev-host"
                    value={editing.host ?? ""}
                    onChange={(e) => setEditing({ ...editing, host: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={editing.tag ?? "Gratis"}
                  onValueChange={(v) => setEditing({ ...editing, tag: v as EventRow["tag"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gratis">Gratis</SelectItem>
                    <SelectItem value="En directo">En directo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={save} disabled={saving || uploading}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EventsManager;
