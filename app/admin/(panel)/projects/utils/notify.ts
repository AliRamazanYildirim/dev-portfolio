import toast from "react-hot-toast";

export const notify = {
  loading: (message: string) => toast.loading(message),
  success: (message: string) => {
    toast.dismiss();
    return toast.success(message);
  },
  error: (message: string) => {
    toast.dismiss();
    return toast.error(message);
  },
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((res: T) => string);
      error: string | ((err: unknown) => string);
    },
  ) =>
    toast.promise(promise, {
      loading: messages.loading,
      success: (res: T) =>
        typeof messages.success === "function"
          ? messages.success(res)
          : String(messages.success),
      error: (err: unknown) =>
        typeof messages.error === "function"
          ? messages.error(err)
          : String(messages.error),
    }),
};

export default notify;
