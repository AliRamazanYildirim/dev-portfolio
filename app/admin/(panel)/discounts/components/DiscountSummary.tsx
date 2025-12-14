import { currencyFormatter } from "../utils";

interface DiscountSummaryProps {
  pendingCount: number;
  sentCount: number;
  totalRecovered: number;
}

export function DiscountSummary({
  pendingCount,
  sentCount,
  totalRecovered,
}: DiscountSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <p className="text-sm text-white/80">Pending records</p>
        <p className="text-3xl font-bold text-white mt-2">{pendingCount}</p>
        <p className="mt-4 text-sm text-white/60">
          Referral transactions whose discount has not yet been sent.
        </p>
      </div>

      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <p className="text-sm text-white/80">Sent records</p>
        <p className="text-3xl font-bold text-white mt-2">{sentCount}</p>
        <p className="mt-4 text-sm text-white/60">
          Records whose discount transmission has been completed.
        </p>
      </div>

      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <p className="text-sm text-white/80">Total sent discounts</p>
        <p className="text-3xl font-bold text-white mt-2">
          {currencyFormatter.format(totalRecovered)}
        </p>
        <p className="mt-4 text-sm text-white/60">
          Total discount amount of completed stages.
        </p>
      </div>
    </div>
  );
}
