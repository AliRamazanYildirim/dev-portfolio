import { ProjectsService } from "../service";

export class ProjectBySlugService {
    static getBySlug(slug: string) {
        return ProjectsService.getBySlug(slug);
    }
}
