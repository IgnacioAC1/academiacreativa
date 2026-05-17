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

export async function getUserReservation(
  eventId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("event_reservations")
    .select("id")
    .eq("event_id", eventId)
    .eq("student_id", userId)
    .maybeSingle();
  return !!data;
}

export async function reserveEvent(
  eventId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("event_reservations")
    .insert({ event_id: eventId, student_id: userId });
  if (error) {
    if (error.code === "23505") return { error: "ya_reservado" };
    return { error: error.message };
  }
  return { error: null };
}

export type LeadData = {
  eventId: string;
  fullName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
};

export async function createEventLead(
  lead: LeadData
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("event_leads").insert({
    event_id: lead.eventId,
    full_name: lead.fullName,
    email: lead.email,
    phone: lead.phone || null,
    accepts_marketing: lead.acceptsMarketing,
  });
  if (error) {
    if (error.code === "23505") return { error: "ya_registrado" };
    return { error: error.message };
  }
  return { error: null };
}
