"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdminSidebar(initial?: boolean) {
    const isClient = typeof window !== "undefined";
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        if (!isClient) return !!initial;
        return typeof initial === "boolean" ? initial : window.innerWidth >= 1024;
    });

    useEffect(() => {
        if (!isClient) return;
        const handler = (e: Event) => {
            const detail = (e as CustomEvent)?.detail;
            if (detail && typeof detail.open === "boolean") setIsOpen(detail.open);
        };
        window.addEventListener("admin-sidebar:set", handler as EventListener);
        return () =>
            window.removeEventListener("admin-sidebar:set", handler as EventListener);
    }, [isClient]);

    const setOpen = useCallback((open: boolean) => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("admin-sidebar:set", { detail: { open } }),
            );
        }
        setIsOpen(open);
    }, []);

    const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

    return { isOpen, setOpen, toggle };
}

export default useAdminSidebar;
