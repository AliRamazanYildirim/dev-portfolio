/**
 * Backward-compatible `db` façade.
 *
 * All database logic now lives in individual repository modules under
 * `lib/repositories/`. This file re-exports them grouped into the legacy
 * `db.*` shape so existing consumers keep working without changes.
 *
 * **New code should import repositories directly:**
 *   import { customerRepository } from "@/lib/repositories";
 */
import { adminRepository } from "./repositories/adminRepository";
import {
  projectRepository,
  projectImageRepository,
  projectTagRepository,
} from "./repositories/projectRepository";
import { contactRepository } from "./repositories/contactRepository";
import { customerRepository } from "./repositories/customerRepository";
import { referralRepository } from "./repositories/referralRepository";

export const db = {
  adminUser: adminRepository,
  project: projectRepository,
  projectImage: projectImageRepository,
  projectTag: projectTagRepository,
  contactMessage: contactRepository,
  customer: customerRepository,
  referralTransaction: referralRepository,
};

export default db;
