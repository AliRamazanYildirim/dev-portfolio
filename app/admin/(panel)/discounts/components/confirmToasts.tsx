"use client";

import toast from "react-hot-toast";
import type { DiscountEntry } from "../types";

export function confirmMarkPending(
  entry: DiscountEntry,
  onConfirm: () => Promise<void>,
) {
  toast.custom(
    (t) => (
      <div className="max-w-md w-full rounded-lg border border-white/10 bg-[#0f1724]/95 p-3 text-sm text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            Are you sure you want to mark this discount as pending again?
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await onConfirm();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="rounded-md bg-amber-500/70 px-3 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-500/50"
            >
              Confirm
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
    { duration: 8000 },
  );
}

export function confirmDelete(
  entry: DiscountEntry,
  onConfirm: () => Promise<void>,
) {
  toast.custom(
    (t) => (
      <div className="max-w-md w-full rounded-lg border border-white/10 bg-[#0f1724]/95 p-3 text-sm text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            Permanently delete the discount for code{" "}
            <span className="font-semibold text-amber-200">
              {entry.referrerCode}
            </span>
            ? This action cannot be undone.
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await onConfirm();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="rounded-md bg-red-500/70 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/50"
            >
              Delete
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
    { duration: 8000 },
  );
}

export function confirmResetEmail(
  entry: DiscountEntry,
  onConfirm: () => Promise<void>,
) {
  toast.custom(
    (t) => (
      <div className="max-w-md w-full rounded-lg border border-white/10 bg-[#0f1724]/95 p-3 text-sm text-white">
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold text-orange-300">
              🔄 Reset Email Status
            </p>
            <p className="mt-1 text-white/70">
              This will reset the email status for{" "}
              <span className="font-semibold text-amber-200">
                {entry.referrerCode}
              </span>{" "}
              and send a correction email to the customer.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await onConfirm();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="flex-1 rounded-md bg-orange-500/70 px-3 py-1.5 text-xs font-semibold text-orange-100 hover:bg-orange-500/50"
            >
              Reset & Send Correction
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-md bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
    { duration: 10000 },
  );
}
