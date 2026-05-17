import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Users, Shield, GraduationCap, Palette, Trash2 } from "lucide-react";
import type { Role } from "@/lib/auth";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  created_at: string;
};

const roleLabel: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
  admin: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" },
  instructor: { label: "Instructor", icon: Palette, color: "bg-blue-100 text-blue-700" },
  student: { label: "Estudiante", icon: GraduationCap, color: "bg-green-100 text-green-700" },
};

const UserRoleManager = () => {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("student");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const roleOrder: Record<Role, number> = { admin: 0, instructor: 1, student: 2 };
    const { data, error } = await supabase.rpc("get_users_with_roles");
    if (!error && data) {
      const sorted = (data as UserRow[]).sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
      setUsers(sorted);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.rpc("set_user_role", {
      user_email: email.trim().toLowerCase(),
      new_role: newRole,
    });
    if (error) {
      toast.error(
        error.message.includes("no encontrado")
          ? "No existe ningún usuario con ese email."
          : "Error al actualizar el rol."
      );
    } else {
      toast.success(`Rol actualizado a "${roleLabel[newRole].label}" para ${email.trim()}`);
      setEmail("");
      loadUsers();
    }
    setSubmitting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.rpc("delete_user", { target_user_id: deleteTarget.id });
    if (error) {
      toast.error("Error al eliminar el usuario");
    } else {
      toast.success(`Usuario "${deleteTarget.full_name ?? deleteTarget.email}" eliminado`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold font-sans">Gestión de usuarios</h2>
          <p className="text-sm text-muted-foreground">Asigna roles a los usuarios registrados.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Formulario */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold font-sans">Asignar rol</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Email del usuario</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Rol</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={submitting}>
              {submitting ? "Guardando…" : "Guardar rol"}
            </Button>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {loadingUsers ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Cargando usuarios…
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Aún no hay usuarios registrados.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary/60 text-left text-sm">
                <tr>
                  <th className="px-5 py-3 font-medium font-sans">Usuario</th>
                  <th className="hidden px-5 py-3 font-medium font-sans md:table-cell">Email</th>
                  <th className="px-5 py-3 font-medium font-sans">Rol</th>
                  <th className="px-5 py-3 font-medium font-sans text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {users.map((u) => {
                  const r = roleLabel[u.role] ?? roleLabel.student;
                  const Icon = r.icon;
                  return (
                    <tr key={u.id} className="hover:bg-secondary/30 transition-smooth">
                      <td className="px-5 py-3 font-medium font-sans">{u.full_name ?? "—"}</td>
                      <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                        {u.email ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium font-sans ${r.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {r.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans">¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar permanentemente la cuenta de{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.full_name ?? deleteTarget?.email ?? "este usuario"}
              </span>
              . Esta acción no se puede deshacer y el usuario perderá acceso a todos sus cursos y datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Eliminar usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default UserRoleManager;
