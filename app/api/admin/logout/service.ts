import { AuthService } from "@/app/api/admin/auth/service";
import { createAdminLogoutSuccessResponse } from "@/lib/contracts/adminLogout";
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
}
