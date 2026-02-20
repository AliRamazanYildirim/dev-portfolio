import ReferralTransactionModel, { type IReferralTransaction } from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";
import { classifyMongoError } from "./errors";

interface FindManyOpts {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 1 | -1>;
}

export const referralRepository = {
    create: async (params: { data: Partial<IReferralTransaction> & Record<string, unknown> }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IReferralTransaction>(
                await ReferralTransactionModel.create(params.data),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    findById: async (id: string) => {
        await connectToMongo();
        return normalizeDoc<IReferralTransaction>(
            await ReferralTransactionModel.findById(id).exec(),
        );
    },

    findMany: async (opts: FindManyOpts) => {
        await connectToMongo();
        const where = opts?.where || {};
        const orderBy = opts?.orderBy || {};
        return normalizeDoc<IReferralTransaction[]>(
            await ReferralTransactionModel.find(where)
                .sort(orderBy)
                .lean()
                .exec(),
        );
    },

    update: async (opts: { where: { id: string }; data: Record<string, unknown> }) => {
        await connectToMongo();
        try {
            return normalizeDoc<IReferralTransaction>(
                await ReferralTransactionModel.findByIdAndUpdate(
                    opts.where.id,
                    opts.data,
                    { new: true },
                ).exec(),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    delete: async (opts: { where: { id: string } }) => {
        await connectToMongo();
        return normalizeDoc<IReferralTransaction>(
            await ReferralTransactionModel.findByIdAndDelete(
                opts.where.id,
            )
                .lean()
                .exec(),
        );
    },

    countDocuments: async (where: Record<string, unknown>) => {
        await connectToMongo();
        return ReferralTransactionModel.countDocuments(where).exec();
    },
};
