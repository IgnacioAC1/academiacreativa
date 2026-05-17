import { useEffect, useRef, useState } from "react";
import { Settings2, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/categoryApi";

type Props = {
  onChanged: () => void; // avisa al padre para recargar el select
};

const CategoryManagerDialog = ({ onChanged }: Props) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const newInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setCategories(await fetchCategories());
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingId(null);
      setNewName("");
      onChanged();
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const { error } = await createCategory(newName);
    if (error === "ya_existe") { toast.error("Ya existe esa categoría"); return; }
    if (error) { toast.error("Error al crear"); return; }
    setNewName("");
    load();
    onChanged();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    const { error } = await updateCategory(id, editingName);
    if (error === "ya_existe") { toast.error("Ya existe esa categoría"); return; }
    if (error) { toast.error("Error al actualizar"); return; }
    setEditingId(null);
    load();
    onChanged();
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await deleteCategory(id);
    if (error) { toast.error("Error al eliminar"); return; }
    toast.success(`"${name}" eliminada`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    onChanged();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full p-0 text-muted-foreground hover:text-foreground"
          title="Gestionar categorías"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-sans text-base">Categorías</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/50 transition-colors"
            >
              {editingId === cat.id ? (
                <>
                  <Input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(cat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="h-7 flex-1 text-sm"
                  />
                  <button onClick={() => handleUpdate(cat.id)} className="text-green-600 hover:text-green-700">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium font-sans">{cat.name}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(cat)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-secondary"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Input
            ref={newInputRef}
            placeholder="Nueva categoría..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            className="h-8 flex-1 text-sm"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={handleCreate}
            disabled={!newName.trim()}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagerDialog;
