"use client";

import toast from "react-hot-toast";

type DeleteFn = (id: string) => Promise<unknown>;

interface UseConfirmDeleteOptions {
  onSuccess?: () => void;
  messages?: {
    title?: string;
    description?: string;
    loading?: string;
    success?: string;
    error?: string;
  };
}

export function useConfirmDelete(
  deleteFn: DeleteFn,
  options?: UseConfirmDeleteOptions,
) {
  const confirmDelete = async (id: string) => {
    const msgs = {
      title:
        options?.messages?.title ??
        "Are you sure you want to delete this item?",
      description:
        options?.messages?.description ?? "This action cannot be undone.",
      loading: options?.messages?.loading ?? "Deleting...",
      success: options?.messages?.success ?? "Deleted",
      error: options?.messages?.error ?? "Delete failed",
    };

    toast(
      (t) => (
        <div className="flex flex-col gap-2 w-96">
          <p className="font-semibold">{msgs.title}</p>
          <p className="text-sm text-gray-600">{msgs.description}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const promise = deleteFn(id);
                  await toast.promise(
                    promise.then(() => msgs.success),
                    {
                      loading: msgs.loading,
                      success: msgs.success,
                      error: msgs.error,
                    },
                  );
                  options?.onSuccess?.();
                } catch (err) {
                  const message =
                    err instanceof Error ? err.message : String(err);
                  toast.error(message || msgs.error);
                }
              }}
              className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  return confirmDelete;
}

export default useConfirmDelete;
