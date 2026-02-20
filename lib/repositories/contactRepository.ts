import ContactMessageModel, { type IContactMessage } from "@/models/ContactMessage";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";
import { classifyMongoError } from "./errors";

interface FindManyOpts {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 1 | -1>;
    take?: number;
}

export const contactRepository = {
    create: async (params: { data: Partial<IContactMessage> & Record<string, unknown> }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IContactMessage>(await ContactMessageModel.create(params.data));
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    findMany: async (opts: FindManyOpts) => {
        await connectToMongo();
        const where = opts?.where || {};
        const limit = opts?.take || undefined;
        return normalizeDoc<IContactMessage[]>(
            await ContactMessageModel.find(where)
                .sort({ createdAt: -1 })
                .limit(limit!)
                .lean()
                .exec(),
        );
    },
};
