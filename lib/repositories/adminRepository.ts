import AdminModel from "@/models/Admin";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";

export const adminRepository = {
    findUnique: async (opts: any) => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc(
                await AdminModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.email)
            return normalizeDoc(
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

    findFirst: async (opts: any) => {
        return adminRepository.findUnique(opts);
    },

    create: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(await AdminModel.create(params.data));
    },

    delete: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await AdminModel.findOneAndDelete({ email: opts.where.email }).exec(),
        );
    },

    update: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await AdminModel.findOneAndUpdate(opts.where, opts.data, {
                new: true,
            }).exec(),
        );
    },

    upsert: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await AdminModel.findOneAndUpdate(
                opts.where,
                opts.update || opts.create,
                { upsert: true, new: true },
            ).exec(),
        );
    },
};
