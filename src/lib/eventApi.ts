import { supabase } from "./supabase";
import type { Event } from "@/data/events";

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  if (error || !data) return [];
  return data.map((e) => ({
    id: e.id as string,
    title: e.title as string,
    date: (e.date as string).slice(0, 10),
    dateLabel: (e.date_label as string) ?? "",
    description: (e.description as string) ?? "",
    image: (e.image_url as string) ?? "",
    tag: e.tag as Event["tag"],
    location: (e.location as string) ?? "",
    host: (e.host as string) ?? "",
  }));
}

export async function fetchEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return {
    id: data.id as string,
    title: data.title as string,
    date: (data.date as string).slice(0, 10),
    dateLabel: (data.date_label as string) ?? "",
    description: (data.description as string) ?? "",
    image: (data.image_url as string) ?? "",
    tag: data.tag as Event["tag"],
    location: (data.location as string) ?? "",
    host: (data.host as string) ?? "",
  };
}
