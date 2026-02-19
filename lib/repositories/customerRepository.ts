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

    /** Find a single customer with an executable query (not lean) */
    findOneExec: async (where: any) => {
        await connectToMongo();
        return CustomerModel.findOne(where).exec();
    },

    /** Find by ID returning an executable mongoose document */
    findByIdExec: async (id: string) => {
        await connectToMongo();
        return CustomerModel.findById(id).exec();
    },

    /** Find multiple customers by an array of IDs */
    findByIds: async (ids: string[]) => {
        await connectToMongo();
        return normalizeDoc(
            await CustomerModel.find({ _id: { $in: ids } }).lean().exec(),
        );
    },

    /** Build a find query with optional sort & lean */
    findWithQuery: async (query: any, sort?: any) => {
        await connectToMongo();
        const cursor = CustomerModel.find(query);
        if (sort && Object.keys(sort).length > 0) cursor.sort(sort);
        return cursor.lean().exec();
    },

    /** Update a single document matching a filter */
    updateOne: async (filter: any, data: any) => {
        await connectToMongo();
        return CustomerModel.updateOne(filter, data).exec();
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
