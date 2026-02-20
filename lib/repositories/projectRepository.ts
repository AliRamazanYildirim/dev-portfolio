import ProjectModel, { type IProject } from "@/models/Project";
import ProjectImageModel, { type IProjectImage } from "@/models/ProjectImage";
import ProjectTagModel, { type IProjectTag } from "@/models/ProjectTag";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";
import { classifyMongoError } from "./errors";
import type { IRepository } from "./types";

interface FindManyOpts {
    where?: Record<string, unknown>;
    orderBy?: Record<string, "asc" | "desc" | 1 | -1>;
}

export const projectRepository: IRepository<IProject> & {
    bulkUpdate: (operations: Array<{ id: string; data: Record<string, unknown> }>) => Promise<unknown>;
} = {
    findMany: async (opts: FindManyOpts): Promise<IProject[]> => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || { createdAt: "asc" };
        const query = ProjectModel.find(where).sort({
            createdAt: orderBy.createdAt === "asc" ? 1 : -1,
        });
        return normalizeDoc<IProject[]>(await query.lean().exec()) ?? [];
    },

    findUnique: async (opts: { where: { id?: string; slug?: string } }): Promise<IProject | null> => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc<IProject>(
                await ProjectModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.slug)
            return normalizeDoc<IProject>(
                await ProjectModel.findOne({ slug: opts.where.slug }).lean().exec(),
            );
        return null;
    },

    create: async (params: { data: Partial<IProject> & Record<string, unknown> }): Promise<IProject> => {
        await connectToMongo();
        try {
            const doc = normalizeDoc<IProject>(await ProjectModel.create(params.data));
            if (!doc) throw new Error("Failed to create project");
            return doc;
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    update: async (opts: { where: { id: string }; data: Record<string, unknown> }): Promise<IProject | null> => {
        await connectToMongo();
        try {
            return normalizeDoc<IProject>(
                await ProjectModel.findByIdAndUpdate(opts.where.id, opts.data, {
                    new: true,
                }).exec(),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    delete: async (opts: { where: { id: string } }): Promise<IProject | null> => {
        await connectToMongo();
        return normalizeDoc<IProject>(
            await ProjectModel.findByIdAndDelete(opts.where.id).exec(),
        );
    },

    /**
     * Bulk-Update: Aktualisiert mehrere Projekte in einem einzigen DB-Call
     * per bulkWrite (Performance-Fix für updateNavigation).
     */
    bulkUpdate: async (
        operations: Array<{ id: string; data: Record<string, unknown> }>,
    ) => {
        await connectToMongo();
        if (operations.length === 0) return;
        const bulkOps = operations.map((op) => ({
            updateOne: {
                filter: { _id: op.id },
                update: { $set: op.data },
            },
        }));
        return ProjectModel.bulkWrite(bulkOps);
    },
};

export const projectImageRepository: {
    findMany: (opts: FindManyOpts) => Promise<IProjectImage[]>;
    createMany: (params: { data: Array<Partial<IProjectImage> & Record<string, unknown>> }) => Promise<IProjectImage[]>;
    deleteMany: (opts: { where: Record<string, unknown> }) => Promise<unknown>;
} = {
    findMany: async (opts: FindManyOpts): Promise<IProjectImage[]> => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || {};
        const sort: Record<string, 1 | -1> = {};
        if (orderBy.order === "asc") sort.order = 1;
        else if (orderBy.order === "desc") sort.order = -1;
        else sort.order = 1;
        return normalizeDoc<IProjectImage[]>(
            await ProjectImageModel.find(where).sort(sort).lean().exec(),
        ) ?? [];
    },

    createMany: async (params: { data: Array<Partial<IProjectImage> & Record<string, unknown>> }): Promise<IProjectImage[]> => {
        await connectToMongo();
        const docs = await ProjectImageModel.insertMany(params.data || []);
        return normalizeDoc<IProjectImage[]>(docs as unknown as IProjectImage[]) ?? [];
    },

    deleteMany: async (opts: { where: Record<string, unknown> }) => {
        await connectToMongo();
        return ProjectImageModel.deleteMany(opts.where || {}).exec();
    },
};

export const projectTagRepository: {
    findMany: (opts: FindManyOpts) => Promise<IProjectTag[]>;
} = {
    findMany: async (opts: FindManyOpts): Promise<IProjectTag[]> => {
        await connectToMongo();
        return normalizeDoc<IProjectTag[]>(
            await ProjectTagModel.find(opts?.where || {})
                .lean()
                .exec(),
        ) ?? [];
    },
};
