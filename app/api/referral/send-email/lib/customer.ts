import { customerRepository } from "@/lib/repositories";

export function findCustomerById(customerId: string) {
    return customerRepository.findUnique({ where: { id: customerId } });
}
