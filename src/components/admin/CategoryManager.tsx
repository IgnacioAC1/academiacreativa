import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/categoryApi";

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setCategories(await fetchCategories());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const { error } = await createCategory(newName);
    if (error === "ya_existe") { toast.error("Ya existe una categoría con ese nombre"); return; }
    if (error) { toast.error("Error al crear la categoría"); return; }
    toast.success("Categoría creada");
    setNewName("");
    setAdding(false);
    load();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    const { error } = await updateCategory(id, editingName);
    if (error === "ya_existe") { toast.error("Ya existe una categoría con ese nombre"); return; }
    if (error) { toast.error("Error al actualizar la categoría"); return; }
    toast.success("Categoría actualizada");
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await deleteCategory(id);
    if (error) { toast.error("Error al eliminar la categoría"); return; }
    toast.success(`"${name}" eliminada`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mt-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-sans">Categorías de cursos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las categorías disponibles al crear o editar cursos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-sans">
            {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
          </Badge>
          {!adding && (
            <Button size="sm" className="rounded-full" onClick={() => setAdding(true)}>
              <Plus className="mr-1 h-4 w-4" /> Nueva categoría
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full">
            <thead className="bg-secondary/60 text-left text-sm">
              <tr>
                <th className="px-5 py-3 font-medium font-sans">Nombre</th>
                <th className="px-5 py-3 font-medium font-sans text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {adding && (
                <tr className="bg-secondary/20">
                  <td className="px-5 py-3">
                    <Input
                      autoFocus
                      placeholder="Nombre de la categoría"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                        if (e.key === "Escape") { setAdding(false); setNewName(""); }
                      }}
                      className="max-w-xs"
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={handleCreate}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewName(""); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id} className="transition-smooth hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    {editingId === cat.id ? (
                      <Input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="max-w-xs"
                      />
                    ) : (
                      <span className="font-medium font-sans">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === cat.id ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleUpdate(cat.id)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(cat.id, cat.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
