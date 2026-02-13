import ContactMessageModel from "@/models/ContactMessage";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";

export const contactRepository = {
    create: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(await ContactMessageModel.create(params.data));
    },

    findMany: async (opts: any) => {
        await connectToMongo();
        const where = opts?.where || {};
        const limit = opts?.take || undefined;
        return normalizeDoc(
            await ContactMessageModel.find(where)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean()
                .exec(),
        );
    },
};
