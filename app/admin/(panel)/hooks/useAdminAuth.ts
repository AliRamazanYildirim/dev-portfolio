"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseAdminSessionResponse } from "@/lib/contracts/adminSession";

// Interface für Admin-Benutzer - Interface for admin user
interface AdminUser {
    id: string;
    email: string;
    name: string;
}

// Interface für Auth-Status - Interface for auth status
interface AuthState {
    isAuthenticated: boolean;
    user: AdminUser | null;
    loading: boolean;
}

/**
 * Custom Hook für Admin-Authentifizierung - Custom hook for admin authentication
 * Automatische Session-Prüfung und Weiterleitung - Automatic session check and redirect
 */
export function useAdminAuth() {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        loading: true,
    });

    // Session prüfen - Check session
    const checkSession = async () => {
        try {
            const response = await fetch("/api/admin/session", {
                method: "GET",
                credentials: "include", // Cookies mitsenden - Include cookies
            });

            const result = await response.json();
            const parsed = parseAdminSessionResponse(result);

            if (parsed.success && parsed.authenticated) {
                // Session gültig - Session valid
                setAuthState({
                    isAuthenticated: true,
                    user: parsed.user,
                    loading: false,
                });
            } else {
                // Session ungültig - Session invalid
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                });

                // Zur Login-Seite weiterleiten - Redirect to login page
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Session check error:", error);
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
            });

            // Bei Fehler zur Login-Seite - On error go to login page
            router.push("/admin/login");
        }
    };

    // Logout-Funktion - Logout function
    const logout = async () => {
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "include",
            });

            // Auth-Status zurücksetzen - Reset auth state
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
            });

            // Zur Login-Seite weiterleiten - Redirect to login page
            router.push("/admin/login");
            router.refresh(); // Seite neu laden - Refresh page
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Session beim Component-Mount prüfen - Check session on component mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch on mount
        checkSession();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        ...authState,
        logout,
        checkSession,
    };
}
