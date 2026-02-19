/**
 * Auth Service – Business Logic für Authentifizierung.
 *
 * Extrahiert aus login/route.ts und session/route.ts (SRP + DIP-Fix).
 * Route-Handler delegieren nur an diesen Service.
 */

import { adminRepository } from "@/lib/repositories";
import {
    verifyPassword,
    createToken,
    verifyToken,
    AUTH_COOKIE_NAME,
    COOKIE_OPTIONS,
    type AdminUser,
} from "@/lib/auth";
import { UnauthorizedError, ValidationError } from "@/lib/errors";
import { isValidEmail } from "@/lib/validation";

export interface LoginResult {
    token: string;
    user: AdminUser;
}

export interface SessionResult {
    user: AdminUser;
}

export class AuthService {
    /**
     * Admin-Login: Validiert Credentials und gibt einen JWT-Token zurück.
     * @throws ValidationError bei fehlender/ungültiger Eingabe
     * @throws UnauthorizedError bei falschen Credentials
     */
    static async login(email: string | undefined, password: string | undefined): Promise<LoginResult> {
        if (!email || !password) {
            throw new ValidationError("Email and password are required");
        }

        if (!isValidEmail(email)) {
            throw new ValidationError("Invalid email address");
        }

        const adminUser = await adminRepository.findActiveByEmail(email.toLowerCase().trim());
        if (!adminUser) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isPasswordValid = await verifyPassword(password, adminUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const user: AdminUser = {
            id: adminUser._id.toString(),
            email: adminUser.email,
            name: adminUser.name,
        };

        const token = createToken(user);

        return { token, user };
    }

    /**
     * Session-Prüfung: Verifiziert einen Auth-Token und gibt den Admin zurück.
     * @throws UnauthorizedError wenn Token ungültig oder User inaktiv
     */
    static async verifySession(token: string | undefined): Promise<SessionResult> {
        if (!token) {
            throw new UnauthorizedError("No session found");
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new UnauthorizedError("Invalid session");
        }

        const adminUser = await adminRepository.findByIdExec(decoded.userId);
        if (!adminUser || !adminUser.active) {
            throw new UnauthorizedError("User not found");
        }

        return {
            user: {
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
            },
        };
    }

    /** Cookie-Name und -Optionen als statische Getter für Route-Handler */
    static get cookieName() {
        return AUTH_COOKIE_NAME;
    }

    static get cookieOptions() {
        return COOKIE_OPTIONS;
    }
}
