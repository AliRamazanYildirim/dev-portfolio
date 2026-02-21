import AdminModel, { type IAdmin } from "@/models/Admin";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";
import { classifyMongoError } from "./errors";

export const adminRepository = {
    findUnique: async (opts: { where: { id?: string; email?: string } }) => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc<IAdmin>(
                await AdminModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.email)
            return normalizeDoc<IAdmin>(
                await AdminModel.findOne({ email: opts.where.email }).lean().exec(),
            );
        return null;
    },

    /** Find active admin by email (returns full mongoose doc for password access) */
    findActiveByEmail: async (email: string) => {
        await connectToMongo();
        return AdminModel.findOne({ email, active: true }).exec();
    },

    /** Find admin by ID (returns full mongoose doc) */
    findByIdExec: async (id: string) => {
        await connectToMongo();
        return AdminModel.findById(id).exec();
    },

    findFirst: async (opts: { where: { id?: string; email?: string } }) => {
        return adminRepository.findUnique(opts);
    },

    create: async (params: { data: Partial<IAdmin> & Record<string, unknown> }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IAdmin>(await AdminModel.create(params.data));
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    delete: async (opts: { where: { email: string } }) => {
        await connectToMongo();
        return normalizeDoc<IAdmin>(
            await AdminModel.findOneAndDelete({ email: opts.where.email }).exec(),
        );
    },

    update: async (opts: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IAdmin>(
                await AdminModel.findOneAndUpdate(opts.where, opts.data, {
                    new: true,
                }).exec(),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    upsert: async (opts: {
        where: Record<string, unknown>;
        update?: Record<string, unknown>;
        create?: Record<string, unknown>;
    }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IAdmin>(
                await AdminModel.findOneAndUpdate(
                    opts.where,
                    opts.update || opts.create,
                    { upsert: true, new: true },
                ).exec(),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },
};
