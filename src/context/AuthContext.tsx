import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { type Role, type Profile } from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; role: Role | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<Profile, "full_name" | "bio" | "avatar_url">>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const log = (...args: unknown[]) => console.log("[Auth]", ...args);

async function fetchProfileById(userId: string): Promise<Profile | null> {
  log("fetchProfile start for", userId);
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("fetchProfile timeout (10s)")), 10000)
    );
    const queryPromise = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as Awaited<typeof queryPromise>;
    if (error) {
      log("fetchProfile error:", error.message);
      return null;
    }
    log("fetchProfile success, role:", (data as Profile)?.role);
    return data as Profile;
  } catch (e) {
    log("fetchProfile exception:", e);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      log("initial getSession:", session?.user?.email ?? "no session");
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfileById(session.user.id);
        if (!cancelled) setProfile(p);
      }
      if (!cancelled) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log("onAuthStateChange:", event, session?.user?.email ?? "no user");
        setUser(session?.user ?? null);
        if (session?.user) {
          // Solo recarga el perfil si no lo tenemos aún o cambia el usuario
          try {
            const p = await fetchProfileById(session.user.id);
            setProfile(p);
          } finally {
            setLoading(false);
          }
        } else {
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
    setLoading(true);
    try {
      const authTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("signInWithPassword timeout (15s)")), 15000)
      );
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const { data, error } = (await Promise.race([authPromise, authTimeout])) as Awaited<typeof authPromise>;
      if (error || !data.user) {
        setLoading(false);
        log("signIn failed:", error?.message);
        return { error: error?.message ?? "Error desconocido", role: null };
      }
      log("signInWithPassword OK, user:", data.user.email);
      const p = await fetchProfileById(data.user.id);
      setUser(data.user);
      setProfile(p);
      setLoading(false);
      const role = (p?.role as Role) ?? null;
      log("signIn complete, role:", role);
      return { error: null, role };
    } catch (e) {
      setLoading(false);
      const msg = e instanceof Error ? e.message : String(e);
      log("signIn exception:", msg);
      return { error: msg, role: null };
    }
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
