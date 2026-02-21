import { CustomersService } from "../service";

export class RecalcFinalPriceService {
    static execute(customerId: string) {
        return CustomersService.recalcFinalPrice(customerId);
    }
}
