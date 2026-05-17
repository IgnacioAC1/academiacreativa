import { useState, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { uploadImage, avatarPath } from "@/lib/storage";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const ProfileInner = () => {
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = (fullName || profile?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAvatarChange = async (file: File) => {
    if (!profile?.id) return;
    try {
      const path = avatarPath(profile.id, file.name);
      const url = await uploadImage("avatars", path, file);
      setAvatarUrl(url);
      const { error } = await updateProfile({ avatar_url: url });
      if (error) toast.error(error);
      else toast.success("Avatar actualizado");
    } catch {
      toast.error("Error al subir el avatar");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, bio });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success("Perfil guardado");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container max-w-xl py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="mb-8 text-4xl font-semibold font-sans">Mi perfil</h1>

        <div className="rounded-2xl border border-border bg-card p-8 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-2xl font-semibold font-sans">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm hover:opacity-90"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarChange(file);
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {profile?.email}
            </p>
            <span className="inline-flex rounded-full bg-secondary px-3 py-0.5 text-xs font-medium font-sans capitalize">
              {profile?.role}
            </span>
          </div>

          {/* Campos */}
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Cuéntanos algo sobre ti..."
              />
            </div>
          </div>

          <Button className="w-full rounded-full" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </main>
    </div>
  );
};

const Profile = () => (
  <ProtectedRoute role={null}>
    <ProfileInner />
  </ProtectedRoute>
);

export default Profile;
