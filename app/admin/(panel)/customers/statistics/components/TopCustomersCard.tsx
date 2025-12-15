import { StatsSnapshot } from "../types";
import { formatMoney } from "../utils";

interface TopCustomersCardProps {
  loading: boolean;
  stats: StatsSnapshot;
}

export function TopCustomersCard({ loading, stats }: TopCustomersCardProps) {
  return (
    <div className="bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-[#131313] mb-4">
        Top Customers
      </h3>
      {loading ? (
        <div className="py-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#131313]" />
        </div>
      ) : stats.topCustomers.length === 0 ? (
        <p className="text-sm text-[#131313]/70">
          There is no customer with fee information yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {stats.topCustomers.map((customer) => (
            <li key={customer.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#131313]">
                  {customer.firstname} {customer.lastname}
                </div>
                <div className="text-sm text-[#131313]/70">
                  {customer.companyname}
                </div>
              </div>
              <div className="font-semibold text-[#131313]">
                {formatMoney(customer.price || 0)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
