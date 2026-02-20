import CustomerModel, { type ICustomer } from "@/models/Customer";
import { connectToMongo } from "@/lib/mongodb";
import { normalizeDoc } from "./normalize";
import { classifyMongoError } from "./errors";
import type { IRepository } from "./types";

/* ---------- Query-Typen ---------- */

interface CustomerWhere {
    id?: string;
    email?: string;
    myReferralCode?: string;
    [key: string]: unknown;
}

interface FindManyOpts {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 1 | -1 | "asc" | "desc">;
    select?: Record<string, boolean>;
}

interface FindUniqueOpts {
    where: CustomerWhere;
}

interface MutateOpts {
    where: { id: string };
    data: Partial<ICustomer> & Record<string, unknown>;
}

interface CreateOpts {
    data: Partial<ICustomer> & Record<string, unknown>;
}

/* ---------- Repository (IRepository<ICustomer> implementiert) ---------- */

export const customerRepository: IRepository<ICustomer> & {
    findOneExec: (where: Record<string, unknown>) => Promise<ICustomer | null>;
    findByIdExec: (id: string) => Promise<ICustomer | null>;
    findByIds: (ids: string[]) => Promise<ICustomer[]>;
    findWithQuery: (query: Record<string, unknown>, sort?: Record<string, 1 | -1>) => Promise<ICustomer[]>;
    updateOne: (filter: Record<string, unknown>, data: Record<string, unknown>) => Promise<unknown>;
} = {
    findMany: async (opts: FindManyOpts): Promise<ICustomer[]> => {
        await connectToMongo();
        let query = CustomerModel.find(opts?.where || {});
        if (opts?.orderBy) query = query.sort(opts.orderBy);
        if (opts?.select) {
            const projection = Object.fromEntries(
                Object.entries(opts.select).filter(([, v]) => v).map(([k]) => [k, 1]),
            );
            query = query.select(projection);
        }
        return normalizeDoc<ICustomer[]>(await query.lean().exec()) ?? [];
    },

    findUnique: async (opts: FindUniqueOpts): Promise<ICustomer | null> => {
        await connectToMongo();
        if (opts.where?.id)
            return normalizeDoc<ICustomer>(
                await CustomerModel.findById(opts.where.id).lean().exec(),
            );
        if (opts.where?.email)
            return normalizeDoc<ICustomer>(
                await CustomerModel.findOne({ email: opts.where.email }).lean().exec(),
            );
        if (opts.where?.myReferralCode)
            return normalizeDoc<ICustomer>(
                await CustomerModel.findOne({
                    myReferralCode: opts.where.myReferralCode,
                })
                    .lean()
                    .exec(),
            );
        return null;
    },

    /** Find a single customer with an executable query (not lean) */
    findOneExec: async (where: Record<string, unknown>): Promise<ICustomer | null> => {
        await connectToMongo();
        return CustomerModel.findOne(where).exec();
    },

    /** Find by ID returning an executable mongoose document */
    findByIdExec: async (id: string): Promise<ICustomer | null> => {
        await connectToMongo();
        return CustomerModel.findById(id).exec();
    },

    /** Find multiple customers by an array of IDs */
    findByIds: async (ids: string[]): Promise<ICustomer[]> => {
        await connectToMongo();
        return normalizeDoc<ICustomer[]>(
            await CustomerModel.find({ _id: { $in: ids } }).lean().exec(),
        ) ?? [];
    },

    /** Build a find query with optional sort & lean */
    findWithQuery: async (query: Record<string, unknown>, sort?: Record<string, 1 | -1>): Promise<ICustomer[]> => {
        await connectToMongo();
        const cursor = CustomerModel.find(query);
        if (sort && Object.keys(sort).length > 0) cursor.sort(sort);
        return cursor.lean().exec();
    },

    /** Update a single document matching a filter */
    updateOne: async (filter: Record<string, unknown>, data: Record<string, unknown>) => {
        await connectToMongo();
        return CustomerModel.updateOne(filter, data).exec();
    },

    create: async (params: CreateOpts): Promise<ICustomer> => {
        await connectToMongo();
        try {
            const doc = normalizeDoc<ICustomer>(await CustomerModel.create(params.data));
            if (!doc) throw new Error("Failed to create customer");
            return doc;
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    update: async (opts: MutateOpts): Promise<ICustomer | null> => {
        await connectToMongo();
        try {
            return normalizeDoc<ICustomer>(
                await CustomerModel.findByIdAndUpdate(opts.where.id, opts.data, {
                    new: true,
                }).exec(),
            );
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    delete: async (opts: { where: { id: string } }): Promise<ICustomer | null> => {
        await connectToMongo();
        return normalizeDoc<ICustomer>(
            await CustomerModel.findByIdAndDelete(opts.where.id).exec(),
        );
    },
};
