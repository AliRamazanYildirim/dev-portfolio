import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";
import ProjectTagModel from "@/models/ProjectTag";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";

export const projectRepository = {
    findMany: async (opts: any) => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || { createdAt: "asc" };
        const query = ProjectModel.find(where).sort({
            createdAt: orderBy.createdAt === "asc" ? 1 : -1,
        });
        return normalizeDoc(await query.lean().exec()) as any;
    },

    findUnique: async (opts: any) => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc(
                await ProjectModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.slug)
            return normalizeDoc(
                await ProjectModel.findOne({ slug: opts.where.slug }).lean().exec(),
            );
        return null;
    },

    create: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(await ProjectModel.create(params.data));
    },

    update: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ProjectModel.findByIdAndUpdate(opts.where.id, opts.data, {
                new: true,
            }).exec(),
        );
    },

    delete: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ProjectModel.findByIdAndDelete(opts.where.id).exec(),
        );
    },
};

export const projectImageRepository = {
    findMany: async (opts: any) => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || {};
        const sort: Record<string, 1 | -1> = {};
        if (orderBy.order === "asc") sort.order = 1;
        else if (orderBy.order === "desc") sort.order = -1;
        else sort.order = 1;
        return normalizeDoc(
            await ProjectImageModel.find(where).sort(sort).lean().exec(),
        );
    },

    createMany: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ProjectImageModel.insertMany(params.data || []),
        );
    },

    deleteMany: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ProjectImageModel.deleteMany(opts.where || {}).exec(),
        );
    },
};

export const projectTagRepository = {
    findMany: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ProjectTagModel.find(opts?.where || {})
                .lean()
                .exec(),
        );
    },
};
