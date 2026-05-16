import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { setSession, homeFor, type Role } from "@/lib/auth";
import { Shield, GraduationCap, Palette } from "lucide-react";

const roles: { id: Role; label: string; desc: string; icon: any }[] = [
  { id: "admin", label: "Admin", desc: "Laura — propietaria de la plataforma", icon: Shield },
  { id: "student", label: "Estudiante", desc: "Accede a tus cursos y avanza", icon: GraduationCap },
  { id: "instructor", label: "Instructor", desc: "Crea y edita tus cursos", icon: Palette },
];

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession(role);
    navigate(homeFor(role));
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container py-[24px]">
        <BackButton />
        <div className="mt-4 flex justify-center">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold font-sans">Bienvenido</h1>
            <p className="text-sm text-muted-foreground">Entra para continuar (demo — sin autenticación real)</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="hola@academia.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Contraseña</Label>
              <PasswordInput id="pw" defaultValue="demo1234" />
            </div>

            <div className="space-y-2">
              <Label>Entrar como</Label>
              <div className="grid gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-smooth ${active ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/60"}`}
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium font-sans">{r.label}</span>
                        <span className="block text-xs text-muted-foreground">{r.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full" size="lg">Entrar</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Crea una cuenta
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
