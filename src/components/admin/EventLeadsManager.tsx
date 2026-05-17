import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { fetchEventLeads, deleteLead, type EventLead } from "@/lib/eventApi";

const EventLeadsManager = () => {
  const [leads, setLeads] = useState<EventLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const data = await fetchEventLeads();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead eliminado");
  };

  const eventOptions = Array.from(
    new Map(leads.map((l) => [l.eventId, l.eventTitle])).entries()
  );

  const filtered = filterEvent === "all"
    ? leads
    : leads.filter((l) => l.eventId === filterEvent);

  return (
    <div className="mt-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-sans">Interesados en eventos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Visitantes que reservaron plaza sin estar registrados en la plataforma.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-sans">
            {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
          </Badge>
          {eventOptions.length > 1 && (
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-52 rounded-full text-sm">
                <SelectValue placeholder="Filtrar por evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los eventos</SelectItem>
                {eventOptions.map(([id, title]) => (
                  <SelectItem key={id} value={id}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card px-6 py-14 text-center">
          <p className="text-muted-foreground text-sm">No hay leads registrados todavía.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full">
            <thead className="bg-secondary/60 text-left text-sm">
              <tr>
                <th className="px-5 py-3 font-medium font-sans">Nombre</th>
                <th className="px-5 py-3 font-medium font-sans">Contacto</th>
                <th className="hidden px-5 py-3 font-medium font-sans md:table-cell">Evento</th>
                <th className="hidden px-5 py-3 font-medium font-sans lg:table-cell">Marketing</th>
                <th className="hidden px-5 py-3 font-medium font-sans lg:table-cell">Fecha</th>
                <th className="px-5 py-3 font-medium font-sans text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.map((lead) => (
                <tr key={lead.id} className="transition-smooth hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium font-sans">{lead.fullName}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {lead.eventTitle}
                  </td>
                  <td className="hidden px-5 py-3 lg:table-cell">
                    {lead.acceptsMarketing ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check className="h-3.5 w-3.5" /> Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <X className="h-3.5 w-3.5" /> No
                      </span>
                    )}
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventLeadsManager;
