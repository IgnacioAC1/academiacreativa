import { useState } from "react";
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
import { events as seedEvents, type Event } from "@/data/events";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyEvent = (): Event => ({
  id: `e${Date.now()}`,
  title: "Nuevo evento",
  date: new Date().toISOString().slice(0, 10),
  dateLabel: "Próximamente",
  description: "Describe tu evento...",
  image: seedEvents[0].image,
  tag: "Gratis",
  location: "Online",
  host: "",
});

const EventsManager = () => {
  const [list, setList] = useState<Event[]>(seedEvents);
  const [editing, setEditing] = useState<Event | null>(null);

  const save = () => {
    if (!editing) return;
    setList((prev) => {
      const exists = prev.some((e) => e.id === editing.id);
      return exists ? prev.map((e) => (e.id === editing.id ? editing : e)) : [editing, ...prev];
    });
    toast.success("Evento guardado");
    setEditing(null);
  };

  const remove = (id: string) => {
    setList((prev) => prev.filter((e) => e.id !== id));
    toast.success("Evento eliminado");
  };

  return (
    <section className="mt-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Admin</p>
          <h2 className="text-4xl font-semibold font-sans">Todos los eventos</h2>
          <p className="mt-2 text-muted-foreground">Gestiona los eventos de la plataforma.</p>
        </div>
        <Button onClick={() => setEditing(emptyEvent())} className="rounded-full" size="lg">
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
                    <img src={e.image} alt="" className="h-10 w-14 rounded object-cover" />
                    <span className="font-medium font-sans">{e.title}</span>
                  </div>
                </td>
                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{e.dateLabel}</td>
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
                    <Button variant="ghost" size="sm" onClick={() => setEditing(e)}>
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
            <DialogTitle className="font-sans">Editar evento</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Imagen del evento</Label>
                <div className="flex items-center gap-3">
                  <img
                    src={editing.image}
                    alt=""
                    className="h-16 w-24 rounded-md object-cover border border-border"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        setEditing({ ...editing, image: String(reader.result) });
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Descripción</Label>
                <Textarea
                  id="desc"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateLabel">Etiqueta de fecha</Label>
                  <Input
                    id="dateLabel"
                    value={editing.dateLabel}
                    onChange={(e) => setEditing({ ...editing, dateLabel: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={editing.location}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={editing.host}
                    onChange={(e) => setEditing({ ...editing, host: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={editing.tag}
                  onValueChange={(v) => setEditing({ ...editing, tag: v as Event["tag"] })}
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
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EventsManager;
