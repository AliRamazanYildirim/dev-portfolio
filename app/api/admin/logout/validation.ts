import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";

export function validateLogoutRequest(request: NextRequest): void {
    if (request.method !== "POST") {
        throw new ValidationError("Method not allowed");
    }
}
