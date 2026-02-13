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
};
