import React from "react";

interface Props {
  message?: string | null;
  onRetry?: () => void;
  actionLabel?: string;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
  actionLabel = "Retry",
}: Props) {
  return (
    <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="content md:text-lgContent text-red-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="button md:text-lgButton border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
