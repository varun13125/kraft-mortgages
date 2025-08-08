export type Permission = "VIEW_RATES" | "VIEW_LEADS" | "MANAGE_LEADS" | "ADMIN";
export function hasPermission(role: string, p: Permission) {
  const map: Record<string, Permission[]> = {
    ADMIN: ["ADMIN","MANAGE_LEADS","VIEW_LEADS","VIEW_RATES"],
    ADVISOR: ["MANAGE_LEADS","VIEW_LEADS","VIEW_RATES"],
    ASSISTANT: ["VIEW_LEADS","VIEW_RATES"],
    CLIENT: ["VIEW_RATES"],
  };
  return map[role]?.includes(p) ?? false;
}
