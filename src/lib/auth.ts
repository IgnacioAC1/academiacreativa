export type Role = "admin" | "student" | "instructor";

const KEY = "ac_session";

export type Session = {
  role: Role;
  name: string;
  userId: string;
};

const defaults: Record<Role, Session> = {
  admin: { role: "admin", name: "Laura", userId: "u-laura" },
  student: { role: "student", name: "Alex", userId: "u-alex" },
  instructor: { role: "instructor", name: "Marta Ríos", userId: "u-marta" },
};

export const setSession = (role: Role) => {
  localStorage.setItem(KEY, JSON.stringify(defaults[role]));
};

export const getSession = (): Session | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const clearSession = () => localStorage.removeItem(KEY);

export const homeFor = (role: Role) =>
  role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/student";
