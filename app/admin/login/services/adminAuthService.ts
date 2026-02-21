import {
  parseAdminSessionResponse,
  type AdminSessionResponse,
} from "@/lib/contracts/adminSession";

export async function checkSession() {
  try {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    const json = await res.json();
    return parseAdminSessionResponse(json);
  } catch (err) {
    return { success: false, authenticated: false, error: "network" } satisfies AdminSessionResponse;
  }
}

export async function login(formData: { email: string; password: string }) {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: "network" };
  }
}
