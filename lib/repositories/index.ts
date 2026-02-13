/**
 * Barrel export for all repositories.
 *
 * Usage:
 *   import { adminRepository } from "@/lib/repositories";
 *   import { customerRepository } from "@/lib/repositories";
 */
export { adminRepository } from "./adminRepository";
export {
    projectRepository,
    projectImageRepository,
    projectTagRepository,
} from "./projectRepository";
export { contactRepository } from "./contactRepository";
export { customerRepository } from "./customerRepository";
export { referralRepository } from "./referralRepository";
export { normalizeDoc } from "./normalize";
