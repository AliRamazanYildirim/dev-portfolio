/**
 * Projects API – Service Layer (Root Facade)
 *
 * Re-exportiert den Service aus lib/ für konsistente Architektur.
 * Service.ts liegt am Domain-Root gemäß ARCHITECTURE.md.
 */

export {
    ProjectsService,
    ProjectReadService,
    ProjectWriteService,
} from "./lib/service";
