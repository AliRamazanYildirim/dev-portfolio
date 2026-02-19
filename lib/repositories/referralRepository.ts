import ReferralTransactionModel from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";

export const referralRepository = {
    create: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ReferralTransactionModel.create(params.data),
        );
    },

    findById: async (id: string) => {
        await connectToMongo();
        return normalizeDoc(
            await ReferralTransactionModel.findById(id).exec(),
        );
    },

    findMany: async (opts: any) => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || {};
        return normalizeDoc(
            await ReferralTransactionModel.find(where)
                .sort(orderBy)
                .lean()
                .exec(),
        );
    },

    update: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ReferralTransactionModel.findByIdAndUpdate(
                opts.where.id,
                opts.data,
                { new: true },
            ).exec(),
        );
    },

    delete: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await ReferralTransactionModel.findByIdAndDelete(
                opts.where.id,
            )
                .lean()
                .exec(),
        );
    },

    countDocuments: async (where: any) => {
        await connectToMongo();
        return ReferralTransactionModel.countDocuments(where).exec();
    },
};
