import { AdminProjectsService } from "../service";
import type { AdminProjectUpdateRequest } from "./types";

export class AdminProjectByIdService {
    static update(id: string, input: AdminProjectUpdateRequest) {
        return AdminProjectsService.update(id, input);
    }

    static delete(id: string) {
        return AdminProjectsService.delete(id);
    }
}
