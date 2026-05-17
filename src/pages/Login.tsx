import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { role, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si el usuario ya está logueado al entrar a /login, redirige a su panel
  useEffect(() => {
    if (!authLoading && role) {
      navigate(homeFor(role), { replace: true });
    }
  }, [authLoading, role, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err, role: userRole } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    if (userRole) {
      navigate(homeFor(userRole), { replace: true });
    } else {
      // Sin role: redirige a home (no se debería dar si el perfil existe)
      setError("No se pudo cargar el perfil. Contacta con un administrador.");
    }
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
              <p className="text-sm text-muted-foreground">
                Introduce tus datos para acceder a tu cuenta
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hola@academia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">Contraseña</Label>
                <PasswordInput
                  id="pw"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full rounded-full" size="lg" disabled={submitting}>
                {submitting ? "Entrando…" : "Entrar"}
              </Button>
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
