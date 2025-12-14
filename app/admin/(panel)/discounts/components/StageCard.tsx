import { CheckCircle2, Clock3, Lock } from "lucide-react";
import { StageSlot, StageStatus } from "../types";
import { currencyFormatter, formatDate } from "../utils";

const stageStatusConfig: Record<
  StageStatus,
  {
    label: string;
    badgeClass: string;
    icon: typeof CheckCircle2;
  }
> = {
  sent: {
    label: "Sent",
    badgeClass:
      "bg-emerald-500/15 text-emerald-100 border border-emerald-500/30",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-500/15 text-amber-100 border border-amber-500/30",
    icon: Clock3,
  },
  upcoming: {
    label: "Upcoming stage",
    badgeClass: "bg-slate-500/15 text-slate-100 border border-slate-500/20",
    icon: Clock3,
  },
  locked: {
    label: "Previous stage must be completed",
    badgeClass: "bg-slate-700/20 text-slate-100 border border-slate-600/30",
    icon: Lock,
  },
};

interface StageCardProps {
  stage: StageSlot;
}

export function StageCard({ stage }: StageCardProps) {
  const statusMeta = stageStatusConfig[stage.status];
  const StatusIcon = statusMeta.icon;
  const stageCustomerName = stage.entry?.customer
    ? `${stage.entry.customer.firstname} ${stage.entry.customer.lastname}`.trim() ||
      "Unknown customer"
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner relative">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">
              Stage {stage.level}
            </p>
            <p className="text-lg font-semibold text-white">
              {stage.entry ? currencyFormatter.format(stage.amount) : "-"}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold flex-shrink-0 ${statusMeta.badgeClass}`}
          >
            <StatusIcon className="h-3 w-3" />
            <span className="hidden sm:inline">{statusMeta.label}</span>
          </span>
        </div>

        {stage.entry ? (
          <div className="space-y-2 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Discount rate</span>
              <span className="font-semibold text-white">
                %{stage.entry.discountRate.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customer using referral</span>
              <span className="text-right text-white/80">
                {stageCustomerName ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sent date</span>
              <span>{formatDate(stage.discountSentAt)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/60">
            No records for this stage yet.
          </p>
        )}
      </div>
    </div>
  );
}
