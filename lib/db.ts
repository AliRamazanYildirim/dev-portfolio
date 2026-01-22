import AdminModel from "@/models/Admin";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";
import ProjectTagModel from "@/models/ProjectTag";
import ContactMessageModel from "@/models/ContactMessage";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";

// Helper to normalize Mongoose documents (add `id` from `_id`) and handle lean() results
function normalizeDoc<T = any>(doc: any): T | null {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map(d => normalizeDoc(d)) as unknown as T;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  if (obj && obj._id && !obj.id) obj.id = String(obj._id);
  return obj as T;
}

// Compatibility `db` object mapping common Prisma-like methods to Mongoose models
export const db = {
  adminUser: {
    findUnique: async (opts: any) => {
      await connectToMongo();
      if (opts.where?.id) return normalizeDoc(await AdminModel.findById(opts.where.id).lean().exec());
      if (opts.where?.email) return normalizeDoc(await AdminModel.findOne({ email: opts.where.email }).lean().exec());
      return null;
    },
    findFirst: async (opts: any) => (await db.adminUser.findUnique(opts)),
    create: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await AdminModel.create(params.data));
    },
    delete: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await AdminModel.findOneAndDelete({ email: opts.where.email }).exec());
    },
    update: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await AdminModel.findOneAndUpdate(opts.where, opts.data, { new: true }).exec());
    },
    upsert: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await AdminModel.findOneAndUpdate(opts.where, opts.update || opts.create, { upsert: true, new: true }).exec());
    },
  },
  project: {
    findMany: async (opts: any) => {
      await connectToMongo();
      const where = opts?.where || {};
      const select = opts?.select || null;
      const orderBy = opts?.orderBy || { createdAt: "asc" };
      const query = ProjectModel.find(where).sort({ createdAt: orderBy.createdAt === "asc" ? 1 : -1 });
      return normalizeDoc(await query.lean().exec()) as any;
    },
    findUnique: async (opts: any) => {
      await connectToMongo();
      if (opts.where?.id) return normalizeDoc(await ProjectModel.findById(opts.where.id).lean().exec());
      if (opts.where?.slug) return normalizeDoc(await ProjectModel.findOne({ slug: opts.where.slug }).lean().exec());
      return null;
    },
    create: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectModel.create(params.data));
    },
    update: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectModel.findByIdAndUpdate(opts.where.id, opts.data, { new: true }).exec());
    },
    delete: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectModel.findByIdAndDelete(opts.where.id).exec());
    },
  },
  projectImage: {
    createMany: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectImageModel.insertMany(params.data || []));
    },
    deleteMany: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectImageModel.deleteMany(opts.where || {}).exec());
    },
  },
  projectTag: {
    findMany: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await ProjectTagModel.find(opts?.where || {}).lean().exec());
    },
  },
  contactMessage: {
    create: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await ContactMessageModel.create(params.data));
    },
    findMany: async (opts: any) => {
      await connectToMongo();
      const where = opts?.where || {};
      const limit = opts?.take || undefined;
      return normalizeDoc(await ContactMessageModel.find(where).sort({ createdAt: -1 }).limit(limit).lean().exec());
    },
  },
  customer: {
    findMany: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await CustomerModel.find(opts?.where || {}).sort(opts?.orderBy || {}).lean().exec());
    },
    findUnique: async (opts: any) => {
      await connectToMongo();
      if (opts.where?.id) return normalizeDoc(await CustomerModel.findById(opts.where.id).lean().exec());
      if (opts.where?.email) return normalizeDoc(await CustomerModel.findOne({ email: opts.where.email }).lean().exec());
      if (opts.where?.myReferralCode) return normalizeDoc(await CustomerModel.findOne({ myReferralCode: opts.where.myReferralCode }).lean().exec());
      return null;
    },
    create: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await CustomerModel.create(params.data));
    },
    update: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await CustomerModel.findByIdAndUpdate(opts.where.id, opts.data, { new: true }).exec());
    },
    delete: async (opts: any) => {
      await connectToMongo();
      return normalizeDoc(await CustomerModel.findByIdAndDelete(opts.where.id).exec());
    },
  },
  referralTransaction: {
    create: async (params: any) => {
      await connectToMongo();
      return normalizeDoc(await ReferralTransactionModel.create(params.data));
    },
  },
  // Note: Prisma passthrough methods removed — project uses Mongoose now
};

export default db;
