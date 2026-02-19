/**
 * Zentrale Fehlerklassen für die gesamte API.
 *
 * Jede Fehlerklasse trägt einen HTTP-Statuscode, damit Route-Handler
 * ihn direkt aus dem Error-Objekt ablesen können, ohne String-Matching.
 */

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Access denied") {
        super(message, 403);
    }
}

export class RateLimitError extends AppError {
    constructor(message = "Too many requests") {
        super(message, 429);
    }
}

/**
 * Typeguard: Prüft ob ein Error ein bekannter AppError ist.
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}
