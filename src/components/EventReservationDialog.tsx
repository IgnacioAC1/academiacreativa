import { useEffect, useState } from "react";
import { z } from "zod";
import { Link } from "react-router-dom";
import { CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  reserveEvent,
  getUserReservation,
  createEventLead,
} from "@/lib/eventApi";

const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Introduce nombre y apellido").max(100),
  email: z.string().trim().email("Email no válido").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Teléfono demasiado largo")
    .regex(/^[\d\s+()-]*$/, "Teléfono no válido")
    .optional()
    .or(z.literal("")),
  acceptsMarketing: z.boolean(),
});

type Props = {
  eventId: string;
  eventTitle: string;
  trigger: React.ReactNode;
};

const EventReservationDialog = ({ eventId, eventTitle, trigger }: Props) => {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [alreadyReserved, setAlreadyReserved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Campos para usuarios anónimos
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !user) return;
    getUserReservation(eventId, user.id).then(setAlreadyReserved);
  }, [open, user, eventId]);

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setDone(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setAcceptsMarketing(false);
      setErrors({});
    }
  };

  const handleAuthSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await reserveEvent(eventId, user.id);
    setSubmitting(false);
    if (error === "ya_reservado") {
      setAlreadyReserved(true);
      return;
    }
    if (error) {
      toast({ title: "Error", description: "No se pudo guardar la reserva.", variant: "destructive" });
      return;
    }
    setAlreadyReserved(true);
    setDone(true);
    toast({ title: "¡Plaza reservada!", description: `Te esperamos en "${eventTitle}".` });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse({ fullName, email, phone, acceptsMarketing });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await createEventLead({
      eventId,
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone || undefined,
      acceptsMarketing: result.data.acceptsMarketing,
    });
    setSubmitting(false);
    if (error === "ya_registrado") {
      toast({
        title: "Ya estás apuntado",
        description: `Tu email ya tiene una reserva para "${eventTitle}".`,
      });
      setDone(true);
      return;
    }
    if (error) {
      toast({ title: "Error", description: "No se pudo guardar la reserva.", variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "¡Reserva confirmada!", description: `Te esperamos en "${eventTitle}".` });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">Reserva tu plaza</DialogTitle>
          <DialogDescription>{eventTitle}</DialogDescription>
        </DialogHeader>

        {/* Estado: reserva completada */}
        {done || (user && alreadyReserved) ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold font-sans text-lg">¡Ya tienes tu plaza!</p>
            <p className="text-sm text-muted-foreground">
              Te hemos registrado para este evento. Recibirás más información próximamente.
            </p>
            <Button variant="outline" className="mt-2 rounded-full" onClick={() => handleClose(false)}>
              Cerrar
            </Button>
          </div>
        ) : user ? (
          /* Usuario autenticado */
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-4">
              <UserCheck className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium font-sans truncate">
                    {profile?.full_name || user.email}
                  </p>
                  <Badge variant="secondary" className="shrink-0">Registrado</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Confirma tu asistencia con un clic. Usaremos los datos de tu perfil.
            </p>
            <DialogFooter>
              <Button
                className="rounded-full px-6 w-full"
                onClick={handleAuthSubmit}
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Confirmar asistencia"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Usuario anónimo */
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Rellena tus datos para reservar tu plaza. Si tienes cuenta,{" "}
              <Link to="/login" className="underline underline-offset-2 text-primary">
                inicia sesión
              </Link>{" "}
              para una reserva más rápida.
            </p>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre y apellido</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
                required
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="marketing"
                checked={acceptsMarketing}
                onCheckedChange={(c) => setAcceptsMarketing(c === true)}
              />
              <Label htmlFor="marketing" className="text-sm leading-snug">
                Acepto recibir correos comerciales de Academia Creativa.
              </Label>
            </div>
            <DialogFooter>
              <Button type="submit" className="rounded-full px-6 w-full" disabled={submitting}>
                {submitting ? "Guardando..." : "Confirmar reserva"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventReservationDialog;
