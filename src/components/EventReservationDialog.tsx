import { useState } from "react";
import { z } from "zod";
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
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  fullName: z.string().trim().min(2, "Introduce nombre y apellido").max(100),
  email: z.string().trim().email("Email no válido").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Teléfono demasiado largo")
    .regex(/^[\d\s+()-]*$/, "Teléfono no válido")
    .optional()
    .or(z.literal("")),
  acceptsMarketing: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el envío de correos comerciales" }),
  }),
});

type Props = {
  eventTitle: string;
  trigger: React.ReactNode;
};

const EventReservationDialog = ({ eventTitle, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ fullName, email, phone, acceptsMarketing });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({
      title: "Reserva confirmada",
      description: `Te hemos reservado plaza para "${eventTitle}".`,
    });
    setOpen(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setAcceptsMarketing(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">Reserva tu plaza</DialogTitle>
          <DialogDescription>{eventTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {errors.acceptsMarketing && (
            <p className="text-sm text-destructive">{errors.acceptsMarketing}</p>
          )}
          <DialogFooter>
            <Button type="submit" className="rounded-full px-6">
              Confirmar reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventReservationDialog;
