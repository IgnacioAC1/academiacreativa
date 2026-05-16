export type Role = "admin" | "student" | "instructor";

export type Profile = {
  id: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string | null;
  created_at: string;
};

export const homeFor = (role: Role) =>
  role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/student";
