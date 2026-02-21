import { AuthService } from "@/app/api/admin/auth/service";
import type { LogoutPayload } from "./types";

export class AdminLogoutService {
    static buildPayload(): LogoutPayload {
        return {
            success: true,
            message: "Successfully logged out",
        };
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
}
