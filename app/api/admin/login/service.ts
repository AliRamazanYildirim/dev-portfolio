import { AuthService } from "@/app/api/admin/auth/service";
import type { LoginRequest } from "./types";

export class AdminLoginService {
    static login(input: LoginRequest) {
        return AuthService.login(input.email, input.password);
    }
}
