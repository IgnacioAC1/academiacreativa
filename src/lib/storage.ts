import { supabase } from "./supabase";

type Bucket = "courses" | "events" | "avatars";

export async function uploadImage(
  bucket: Bucket,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function getPublicUrl(bucket: Bucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(bucket: Bucket, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export function courseImagePath(courseId: string, fileName: string) {
  return `${courseId}/${fileName}`;
}

export function eventImagePath(eventId: string, fileName: string) {
  return `${eventId}/${fileName}`;
}

export function avatarPath(userId: string, fileName: string) {
  return `${userId}/${fileName}`;
}
