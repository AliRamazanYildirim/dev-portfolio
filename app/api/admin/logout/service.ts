import { AuthService } from "@/app/api/admin/auth/service";
import { createAdminLogoutSuccessResponse } from "@/lib/contracts/adminLogout";
import { verifyToken } from "@/lib/auth";
import { revokeToken } from "@/lib/security/tokenRevocation";
import { recordAudit } from "@/lib/security/audit";
import type { LogoutPayload } from "./types";

export class AdminLogoutService {
    static buildPayload(): LogoutPayload {
        return createAdminLogoutSuccessResponse();
    }

    static getCookieName() {
        return AuthService.cookieName;
    }

    static getExpiredCookieOptions() {
        return {
            ...AuthService.cookieOptions,
            expires: new Date(0),
        };
    }

    /**
     * Widerruft den JWT durch Eintrag in die Revocation-Liste.
     * Fehler werden geschluckt: Logout muss auch bei DB-Ausfall Cookie loeschen.
     */
    static async revokeSession(token: string | undefined): Promise<void> {
        if (!token) return;

        const decoded = verifyToken(token);
        if (!decoded?.jti || !decoded.exp) return;

        try {
            await revokeToken(decoded.jti, decoded.exp);
            await recordAudit({
                action: "admin.logout",
                actorId: decoded.userId,
                actorEmail: decoded.email,
                success: true,
            });
        } catch (error) {
            console.error("revokeSession failed", error);
        }
    }
}
