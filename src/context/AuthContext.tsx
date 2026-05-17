import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { type Role, type Profile } from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<Profile, "full_name" | "bio" | "avatar_url">>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const log = (...args: unknown[]) => console.log("[Auth]", ...args);

async function fetchProfileById(userId: string): Promise<Profile | null> {
  log("fetchProfile start for", userId);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    log("fetchProfile error:", error.message);
    return null;
  }
  log("fetchProfile success, role:", (data as Profile)?.role);
  return data as Profile;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Carga inicial: getSession + fetch profile
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      log("initial getSession:", session?.user?.email ?? "no session");
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfileById(session.user.id);
        if (!cancelled) setProfile(p);
      }
      if (!cancelled) setLoading(false);
    });

    // CRÍTICO: el callback NO debe ser async ni hacer await directamente.
    // Supabase JS mantiene un lock interno mientras el callback se ejecuta,
    // y las queries a la DB se cuelgan si se hace await aquí.
    // Solución: diferir el trabajo asíncrono con setTimeout(0).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        log("onAuthStateChange:", event, session?.user?.email ?? "no user");
        if (session?.user) {
          setUser(session.user);
          const uid = session.user.id;
          setTimeout(() => {
            if (cancelled) return;
            fetchProfileById(uid).then((p) => {
              if (cancelled) return;
              setProfile(p);
              setLoading(false);
            });
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    log("signIn called for", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      log("signIn failed:", error?.message);
      return { error: error?.message ?? "Error desconocido" };
    }
    log("signInWithPassword OK, user:", data.user.email);
    // El perfil se cargará automáticamente vía onAuthStateChange.
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfileById(user.id);
    setProfile(p);
  };

  const updateProfile = async (patch: Partial<Pick<Profile, "full_name" | "bio" | "avatar_url">>) => {
    if (!user) return { error: "No autenticado" };
    const { error } = await supabase
      .from("profiles")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (!error) {
      const p = await fetchProfileById(user.id);
      setProfile(p);
    }
    return { error: error ? error.message : null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: (profile?.role as Role) ?? null,
        loading,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
