/**
 * Zentrale API-Response-Helfer.
 *
 * Einheitliches Response-Format für alle API-Route-Handler.
 * Ersetzt die bisher über mehrere Domänen verstreuten Helper.
 */

import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";

/* ---------- Typen ---------- */

const SHOULD_EXPOSE_ERROR_DETAILS = process.env.NODE_ENV !== "production";

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data?: T;
    message?: string;
    count?: number;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    details?: string;
}

/* ---------- Erfolg ---------- */

export function successResponse<T>(data: T, statusOrMessage?: number | string, status?: number) {
    const body: ApiSuccessResponse<T> = { success: true, data };

    if (typeof statusOrMessage === "string") {
        body.message = statusOrMessage;
        return NextResponse.json(body, { status: status ?? 200 });
    }

    return NextResponse.json(body, { status: statusOrMessage ?? 200 });
}

/* ---------- Fehler ---------- */

export function errorResponse(error: string, status = 500, details?: string) {
    const body: ApiErrorResponse = { success: false, error };
    if (details) body.details = details;
    return NextResponse.json(body, { status });
}

/**
 * Wandelt einen beliebigen Fehler in eine standardisierte API-Antwort um.
 * Erkennt AppError automatisch und nutzt den darin enthaltenen statusCode.
 */
export function handleError(error: unknown, fallbackMessage = "Internal server error") {
    if (isAppError(error)) {
        return errorResponse(error.message, error.statusCode);
    }

    const details = error instanceof Error ? error.message : String(error);
    console.error(fallbackMessage, error);

    if (!SHOULD_EXPOSE_ERROR_DETAILS) {
        return errorResponse(fallbackMessage, 500);
    }

    return errorResponse(fallbackMessage, 500, details);
}
