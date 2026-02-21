import { AuthService } from "@/app/api/admin/auth/service";

export class AdminSessionService {
    static verify(token: string | undefined) {
        return AuthService.verifySession(token);
    }
}
