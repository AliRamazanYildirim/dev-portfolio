import toast from "react-hot-toast";

export function useOptimisticToggle() {
    return async function optimisticToggle<T extends boolean>(
        currentValue: T,
        setValue: (v: T) => void,
        persistFn: (next: T) => Promise<void>
    ) {
        const previous = currentValue;
        const next = (!previous) as T;
        setValue(next);
        try {
            await persistFn(next);
        } catch (error) {
            setValue(previous);
            toast.error("Setting could not be updated");
            throw error;
        }
    };
}
