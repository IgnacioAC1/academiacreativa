import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { setSession, homeFor } from "@/lib/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updates, setUpdates] = useState(false);
  const [touched, setTouched] = useState(false);

  const mismatch = touched && confirm.length > 0 && password !== confirm;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (password !== confirm || password.length === 0) return;
    // Mock signup → log in as student and go to dashboard
    setSession("student");
    navigate(homeFor("student"));
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container py-[24px]">
        <BackButton />
        <div className="mt-4 flex justify-center">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold font-sans">Crea tu cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Únete a Academia Creativa y empieza a aprender hoy mismo
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hola@academia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pw">Contraseña</Label>
              <PasswordInput
                id="pw"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pw2">Confirmar contraseña</Label>
              <PasswordInput
                id="pw2"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="new-password"
                aria-invalid={mismatch}
                className={mismatch ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {mismatch && (
                <p className="text-sm font-medium text-destructive">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="updates"
                checked={updates}
                onCheckedChange={(v) => setUpdates(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="updates" className="text-sm font-normal leading-snug text-foreground">
                Quiero recibir novedades e información sobre la comunidad por email
              </Label>
            </div>

            <p className="text-xs text-muted-foreground">
              Al crear una cuenta, aceptas los Términos y Condiciones.
            </p>

            <Button type="submit" className="w-full rounded-full" size="lg">
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
