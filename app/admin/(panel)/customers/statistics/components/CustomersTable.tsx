import Pagination from "@/components/ui/Pagination";
import { Customer } from "../types";
import { formatMoney } from "../utils";
import { usePagination } from "@/hooks/usePagination";

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
}

export function CustomersTable({ customers, loading }: CustomersTableProps) {
  const pagination = usePagination({
    totalItems: customers.length,
    itemsPerPage: 10,
    initialPage: 1,
  });

  const paginatedCustomers = pagination.paginatedData(customers);

  return (
    <div className="mt-8 bg-transparent">
      <div className="bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#131313]">
            Customer data
          </h3>
          <p className="text-sm text-[#131313]/70">Last records</p>
        </div>
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#131313]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-[#131313]/70">
            There are no customers yet.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-[#131313]/70 border-b border-white/10">
                    <th className="py-3">Name</th>
                    <th className="py-3">Company</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="odd:bg-white/60">
                      <td className="py-3 text-sm text-[#131313] font-medium">
                        {customer.firstname} {customer.lastname}
                      </td>
                      <td className="py-3 text-sm text-[#131313]/80">
                        {customer.companyname}
                      </td>
                      <td className="py-3 text-sm text-[#131313]/80">
                        {customer.email}
                      </td>
                      <td className="py-3 text-sm text-[#131313]/80">
                        {customer.price != null
                          ? formatMoney(customer.price)
                          : "-"}
                      </td>
                      <td className="py-3 text-sm text-[#131313]/80">
                        {customer.createdAt || customer.created_at
                          ? (customer.createdAt || customer.created_at)!.slice(
                              0,
                              10
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={pagination.goToPage}
              onNextPage={pagination.nextPage}
              onPrevPage={pagination.prevPage}
              getPageNumbers={pagination.getPageNumbers}
              getCurrentRange={pagination.getCurrentRange}
              theme="admin"
              showInfo
              size="sm"
              className="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
