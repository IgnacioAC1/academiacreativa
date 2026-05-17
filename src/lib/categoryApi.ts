import { supabase } from "./supabase";

export type Category = { id: string; name: string };

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as Category[];
}

export async function createCategory(name: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("categories").insert({ name: name.trim() });
  if (error) {
    if (error.code === "23505") return { error: "ya_existe" };
    return { error: error.message };
  }
  return { error: null };
}

export async function updateCategory(id: string, name: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("categories").update({ name: name.trim() }).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "ya_existe" };
    return { error: error.message };
  }
  return { error: null };
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return { error: error ? error.message : null };
}
