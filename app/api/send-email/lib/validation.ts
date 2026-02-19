import type { SendEmailPayload } from "./types";

export function validateSendEmailPayload(body: unknown):
    | { valid: true; value: SendEmailPayload }
    | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name.trim() : "";
    const email = typeof obj.email === "string" ? obj.email.trim() : "";
    const message = typeof obj.message === "string" ? obj.message.trim() : "";

    if (!name || !email || !message) {
        return { valid: false, error: "Name, email and message are required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: "Invalid email format" };
    }

    return { valid: true, value: { name, email, message } };
}
