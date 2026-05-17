import { supabase } from "./supabase";
import type { Course, Module, Lesson } from "@/data/mockData";

type Row = Record<string, unknown>;

const toLesson = (r: Row): Lesson => ({
  id: r.id as string,
  title: r.title as string,
  duration: (r.duration as string) ?? "0:00",
  video: (r.video_url as string) ?? undefined,
});

const toModule = (r: Row, lessons: Lesson[]): Module => ({
  id: r.id as string,
  title: r.title as string,
  lessons,
});

const toCourse = (r: Row, instructorName: string, modules: Module[]): Course => ({
  id: r.id as string,
  title: r.title as string,
  description: (r.description as string) ?? "",
  category: r.category as string,
  price: Number(r.price),
  image: (r.image_url as string) ?? "",
  published: r.published as boolean,
  instructor: instructorName,
  instructorId: r.instructor_id as string,
  modules,
});

export async function fetchPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) =>
    toCourse(r, (r.profiles as { full_name: string } | null)?.full_name ?? "", [])
  );
}

export async function fetchAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) =>
    toCourse(r, (r.profiles as { full_name: string } | null)?.full_name ?? "", [])
  );
}

export async function fetchCourse(id: string): Promise<Course | null> {
  const { data: courseRow, error } = await supabase
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("id", id)
    .single();
  if (error || !courseRow) return null;

  const { data: moduleRows } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("position", { ascending: true });

  const modules: Module[] = await Promise.all(
    (moduleRows ?? []).map(async (m) => {
      const { data: lessonRows } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", m.id)
        .order("position", { ascending: true });
      return toModule(m as Row, (lessonRows ?? []).map((l) => toLesson(l as Row)));
    })
  );

  return toCourse(
    courseRow as Row,
    (courseRow.profiles as { full_name: string } | null)?.full_name ?? "",
    modules
  );
}

export async function deleteCourse(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  return { error: error ? error.message : null };
}

export async function updateCoursePublished(id: string, published: boolean): Promise<void> {
  await supabase.from("courses").update({ published }).eq("id", id);
}

export async function createCourse(course: Omit<Course, "modules">): Promise<string | null> {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      image_url: course.image || null,
      published: course.published,
      instructor_id: course.instructorId,
    })
    .select("id")
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function saveCourse(course: Course): Promise<{ error: string | null }> {
  const { error: courseErr } = await supabase
    .from("courses")
    .update({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      image_url: course.image || null,
      published: course.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", course.id);
  if (courseErr) return { error: courseErr.message };

  // Fetch existing module IDs to detect deletions
  const { data: existingModules } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", course.id);

  const existingModuleIds = new Set((existingModules ?? []).map((m) => m.id as string));
  const currentModuleIds = new Set(course.modules.map((m) => m.id));

  // Delete removed modules (cascade deletes lessons)
  for (const oldId of existingModuleIds) {
    if (!currentModuleIds.has(oldId)) {
      await supabase.from("modules").delete().eq("id", oldId);
    }
  }

  // Upsert modules and their lessons
  for (let mi = 0; mi < course.modules.length; mi++) {
    const m = course.modules[mi];
    const { error: modErr } = await supabase.from("modules").upsert({
      id: m.id,
      course_id: course.id,
      title: m.title,
      position: mi,
    });
    if (modErr) return { error: modErr.message };

    // Fetch existing lesson IDs for this module
    const { data: existingLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("module_id", m.id);
    const existingLessonIds = new Set((existingLessons ?? []).map((l) => l.id as string));
    const currentLessonIds = new Set(m.lessons.map((l) => l.id));

    for (const oldId of existingLessonIds) {
      if (!currentLessonIds.has(oldId)) {
        await supabase.from("lessons").delete().eq("id", oldId);
      }
    }

    for (let li = 0; li < m.lessons.length; li++) {
      const l = m.lessons[li];
      const { error: lesErr } = await supabase.from("lessons").upsert({
        id: l.id,
        module_id: m.id,
        title: l.title,
        duration: l.duration,
        video_url: l.video ?? null,
        position: li,
      });
      if (lesErr) return { error: lesErr.message };
    }
  }

  return { error: null };
}

export async function enrollStudent(studentId: string, courseId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("enrollments")
    .upsert({ student_id: studentId, course_id: courseId }, { onConflict: "student_id,course_id" });
  return { error: error ? error.message : null };
}

export async function fetchEnrollments(studentId: string): Promise<{ courseId: string; progress: number }[]> {
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", studentId);
  if (!enrollments?.length) return [];

  const results = await Promise.all(
    enrollments.map(async (e) => {
      const courseId = e.course_id as string;

      // Total lessons in course
      const { count: total } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .in(
          "module_id",
          (
            await supabase.from("modules").select("id").eq("course_id", courseId)
          ).data?.map((m) => m.id) ?? []
        );

      // Completed lessons
      const { count: done } = await supabase
        .from("lesson_progress")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("completed", true)
        .in(
          "lesson_id",
          (
            await supabase
              .from("lessons")
              .select("id")
              .in(
                "module_id",
                (
                  await supabase.from("modules").select("id").eq("course_id", courseId)
                ).data?.map((m) => m.id) ?? []
              )
          ).data?.map((l) => l.id) ?? []
        );

      const progress = total ? Math.round(((done ?? 0) / total) * 100) : 0;
      return { courseId, progress };
    })
  );
  return results;
}

export async function fetchLessonProgress(studentId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("student_id", studentId)
    .eq("completed", true);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export async function toggleLessonComplete(
  studentId: string,
  lessonId: string,
  completed: boolean
): Promise<void> {
  await supabase.from("lesson_progress").upsert(
    {
      student_id: studentId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "student_id,lesson_id" }
  );
}
