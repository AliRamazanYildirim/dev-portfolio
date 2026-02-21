import { CustomersService } from "../service";
import type { CustomerUpdateRequest } from "./types";

export class CustomerByIdService {
    static getById(id: string) {
        return CustomersService.getById(id);
    }

    static updateById(id: string, input: CustomerUpdateRequest) {
        return CustomersService.updateById(id, input);
    }

    static deleteById(id: string) {
        return CustomersService.deleteById(id);
    }
}
