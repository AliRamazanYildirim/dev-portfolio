import type { DiscountEntry } from "../types";

export function mergeAndSortInvoices(data: {
  pending: DiscountEntry[];
  sent: DiscountEntry[];
}) {
  return [
    ...data.pending.map((e) => ({ ...e, discountStatus: "pending" as const })),
    ...data.sent.map((e) => ({ ...e, discountStatus: "sent" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function filterInvoices(
  invoices: Array<DiscountEntry & { discountStatus: "pending" | "sent" }>,
  statusFilter: "all" | "pending" | "sent",
  searchTerm: string,
) {
  const term = searchTerm.trim().toLowerCase();
  return invoices.filter((entry) => {
    const matchesStatus =
      statusFilter === "all" || entry.discountStatus === statusFilter;
    if (!matchesStatus) return false;
    if (!term) return true;
    const customerName = entry.customer
      ? `${entry.customer.firstname} ${entry.customer.lastname}`.toLowerCase()
      : "";
    const customerEmail = entry.customer?.email?.toLowerCase() ?? "";
    return (
      customerName.includes(term) ||
      customerEmail.includes(term) ||
      entry.referrerCode.toLowerCase().includes(term)
    );
  });
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const startIndex = (page - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
}
