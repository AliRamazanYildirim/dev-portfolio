import CustomerModel from "@/models/Customer";

export function findCustomerById(customerId: string) {
    return CustomerModel.findById(customerId).lean().exec();
}
