import CustomerModel from "@/models/Customer";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";

export const customerRepository = {
    findMany: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await CustomerModel.find(opts?.where || {})
                .sort(opts?.orderBy || {})
                .lean()
                .exec(),
        );
    },

    findUnique: async (opts: any) => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc(
                await CustomerModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.email)
            return normalizeDoc(
                await CustomerModel.findOne({ email: opts.where.email }).lean().exec(),
            );
        if (opts.where?.myReferralCode)
            return normalizeDoc(
                await CustomerModel.findOne({
                    myReferralCode: opts.where.myReferralCode,
                })
                    .lean()
                    .exec(),
            );
        return null;
    },

    create: async (params: any) => {
        await connectToMongo();
        return normalizeDoc(await CustomerModel.create(params.data));
    },

    update: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await CustomerModel.findByIdAndUpdate(opts.where.id, opts.data, {
                new: true,
            }).exec(),
        );
    },

    delete: async (opts: any) => {
        await connectToMongo();
        return normalizeDoc(
            await CustomerModel.findByIdAndDelete(opts.where.id).exec(),
        );
    },
};
