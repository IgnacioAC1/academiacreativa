import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      navigate(homeFor((profile?.role as any) ?? "student"));
    } else {
      navigate("/");
    }
    setLoading(false);
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

              <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
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
