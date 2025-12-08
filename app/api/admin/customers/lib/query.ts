import CustomerModel from "@/models/Customer";
import { connectToMongo } from "@/lib/mongodb";

interface CustomerQueryOptions {
    sort?: string | null;
    from?: string | null;
    to?: string | null;
    q?: string | null;
}

function buildDateRangeFilter(from?: string | null, to?: string | null) {
    if (!from || !to) {
        return undefined;
    }

    const fromIso = from.length === 10 ? `${from}T00:00:00.000Z` : from;
    const toIso = to.length === 10 ? `${to}T23:59:59.999Z` : to;

    return { $gte: new Date(fromIso), $lte: new Date(toIso) };
}

function buildSearchFilter(q?: string | null) {
    if (!q) {
        return undefined;
    }

    const qClean = q.replace(/%/g, "");
    const fields = [
        "firstname",
        "lastname",
        "companyname",
        "address",
        "reference",
        "myReferralCode",
    ];

    return {
        $or: fields.map((field) => ({ [field]: { $regex: qClean, $options: "i" } })),
    };
}

function buildSortObject(sortParam?: string | null) {
    if (!sortParam) {
        return {};
    }

    const [field, dir] = sortParam.split(".");
    const ascending = dir === "asc";
    const sort: Record<string, 1 | -1> = {};

    if (field === "price") {
        sort.price = ascending ? 1 : -1;
    } else if (field === "name") {
        sort.firstname = ascending ? 1 : -1;
        sort.lastname = ascending ? 1 : -1;
    } else if (field === "created") {
        sort.createdAt = ascending ? 1 : -1;
    }

    return sort;
}

export async function fetchCustomers(options: CustomerQueryOptions) {
    await connectToMongo();

    const query: Record<string, unknown> = {};
    const dateFilter = buildDateRangeFilter(options.from, options.to);
    if (dateFilter) {
        query.createdAt = dateFilter;
    }

    const searchFilter = buildSearchFilter(options.q);
    if (searchFilter) {
        Object.assign(query, searchFilter);
    }

    const sortObj = buildSortObject(options.sort);
    const cursor = CustomerModel.find(query);
    if (Object.keys(sortObj).length > 0) {
        cursor.sort(sortObj);
    }

    const raw = await cursor.lean().exec();
    return Array.isArray(raw)
        ? raw.map((doc: any) => ({ ...doc, id: doc._id ? String(doc._id) : doc.id }))
        : raw;
}
