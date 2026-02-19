/**
 * Contact API Types and Interfaces
 * Separiert Request/Response Types vom Business Logic
 */

export interface RateLimitMeta {
    limit: number;
    remaining: number;
    reset: number; // epoch seconds
}

export interface RateLimitResult {
    allowed: boolean;
    meta: RateLimitMeta;
}

export interface CreateContactRequest {
    name: string;
    email: string;
    message: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    read?: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export interface ContactResponse {
    success: boolean;
    data?: ContactMessage | ContactMessage[];
    error?: string;
    message?: string;
    count?: number;
}

export interface GetContactsQuery {
    unreadOnly?: boolean;
    limit?: number;
}
