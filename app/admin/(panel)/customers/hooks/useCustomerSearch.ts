"use client";

import { useState, useRef } from "react";

export function useCustomerSearch() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [liveResults, setLiveResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<number | null>(null);

    const onSearchInputChange = (v: string) => {
        setSearchQuery(v);
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(async () => {
            if (!v || v.trim() === "") {
                setLiveResults([]);
                setShowDropdown(false);
                return;
            }
            try {
                const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(v)}`);
                const json = await res.json();
                if (json?.success && Array.isArray(json.data)) {
                    setLiveResults(json.data.slice(0, 6));
                    setShowDropdown(true);
                } else {
                    setLiveResults([]);
                    setShowDropdown(false);
                }
            } catch (err) {
                setLiveResults([]);
                setShowDropdown(false);
            }
        }, 250);
    };

    return {
        searchQuery,
        setSearchQuery,
        liveResults,
        showDropdown,
        setShowDropdown,
        onSearchInputChange,
    } as const;
}
