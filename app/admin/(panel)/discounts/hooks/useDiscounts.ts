"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    fetchDiscounts,
    fetchDiscountSettings,
    patchDiscount,
    deleteDiscountApi,
    sendDiscountEmailApi,
    resetEmailApi,
    updateDiscountsSetting,
} from "../services/discountApi";
import type { DiscountEntry, DiscountResponse } from "../types";

export function useDiscounts({ isAuthenticated, authLoading }: { isAuthenticated: boolean; authLoading: boolean }) {
    const [data, setData] = useState<DiscountResponse>({ pending: [], sent: [] });
    const [loading, setLoading] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [discountsEnabled, setDiscountsEnabled] = useState(true);
    const [mutatingId, setMutatingId] = useState<string | null>(null);
    const [mutationAction, setMutationAction] = useState<"status" | "delete" | "email" | "reset" | null>(null);
    const [hydrated, setHydrated] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const d = await fetchDiscounts();
            setData(d);
        } catch (error) {
            console.error(error);
            toast.error("Discounts could not be loaded");
        } finally {
            setLoading(false);
        }
    };

    const loadSettings = async () => {
        setSettingsLoading(true);
        try {
            const d = await fetchDiscountSettings();
            setDiscountsEnabled(Boolean(d?.enabled));
        } catch (error) {
            console.error(error);
            toast.error("Discount setting could not be loaded");
        } finally {
            setSettingsLoading(false);
        }
    };

    useEffect(() => {
        setHydrated(true);
        if (!authLoading && isAuthenticated) {
            loadData();
            loadSettings();
        }
    }, [authLoading, isAuthenticated]);

    const updateInvoice = async (entry: DiscountEntry, payload: Partial<Pick<DiscountEntry, "discountStatus" | "discountSentAt">>) => {
        setMutatingId(entry.id);
        setMutationAction("status");
        try {
            const requestBody: Record<string, unknown> = { id: entry.id };
            if (payload.discountStatus) requestBody.discountStatus = payload.discountStatus;
            if (Object.prototype.hasOwnProperty.call(payload, "discountSentAt")) requestBody.discountSentAt = payload.discountSentAt;

            const jsonData = await patchDiscount(requestBody);

            const { discountStatus, discountSentAt } = jsonData as {
                discountStatus: "pending" | "sent";
                discountSentAt: string | null;
            };

            setData((previous) => {
                const nextPending = previous.pending.filter((item) => item.id !== entry.id);
                const nextSent = previous.sent.filter((item) => item.id !== entry.id);

                const updatedEntry: DiscountEntry = { ...entry, discountStatus, discountSentAt };

                if (discountStatus === "sent") {
                    const updatedList = [...nextSent, updatedEntry].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    return { pending: nextPending, sent: updatedList };
                }

                const updatedList = [...nextPending, updatedEntry].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                return { pending: updatedList, sent: nextSent };
            });

            await loadData().catch((error) => console.error("Failed to reload discounts after patch", error));
            return { discountStatus };
        } finally {
            setMutatingId(null);
            setMutationAction(null);
        }
    };

    const markAsSent = async (entry: DiscountEntry) => {
        try {
            await updateInvoice(entry, { discountStatus: "sent" });
            toast.success("Discount marked as sent");
        } catch (error) {
            console.error(error);
            toast.error("Discount status could not be updated");
        }
    };

    const markAsPending = async (entry: DiscountEntry) => {
        try {
            await updateInvoice(entry, { discountStatus: "pending", discountSentAt: null });
            toast.success("Discount marked as pending");
        } catch (error) {
            console.error(error);
            toast.error("Discount status could not be updated");
        }
    };

    const deleteDiscount = async (entry: DiscountEntry) => {
        setMutatingId(entry.id);
        setMutationAction("delete");
        try {
            await deleteDiscountApi(entry.id);
            setData((previous) => ({ pending: previous.pending.filter((item) => item.id !== entry.id), sent: previous.sent.filter((item) => item.id !== entry.id) }));
            await loadData().catch((error) => console.error("Failed to reload discounts after delete", error));
        } finally {
            setMutatingId(null);
            setMutationAction(null);
        }
    };

    const sendEmail = async (entry: DiscountEntry, rate: number | "+3") => {
        setMutatingId(entry.id);
        setMutationAction("email");
        try {
            await sendDiscountEmailApi(entry.id, rate);
            const rateDisplay = rate === "+3" ? "+3% bonus" : `${rate}%`;
            toast.success(`Discount email sent successfully (${rateDisplay} discount applied)`);
            await loadData();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Email could not be sent");
        } finally {
            setMutatingId(null);
            setMutationAction(null);
        }
    };

    const resetEmail = async (entry: DiscountEntry) => {
        setMutatingId(entry.id);
        setMutationAction("reset");
        try {
            await resetEmailApi(entry.id, true);
            toast.success("Email status reset & correction email sent");
            await loadData();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to reset email status");
        } finally {
            setMutatingId(null);
            setMutationAction(null);
        }
    };

    const toggleEnabled = async (next: boolean, revert: () => void) => {
        setSettingsLoading(true);
        try {
            const data = await updateDiscountsSetting(next);
            setDiscountsEnabled(Boolean(data?.enabled));
            toast.success(data?.enabled ? "Discounts enabled" : "Discounts disabled");
        } catch (error) {
            console.error(error);
            revert();
            toast.error("Discount setting could not be updated");
        } finally {
            setSettingsLoading(false);
        }
    };

    return {
        data,
        loading,
        settingsLoading,
        discountsEnabled,
        mutatingId,
        mutationAction,
        hydrated,
        loadData,
        loadSettings,
        updateInvoice,
        deleteDiscount,
        sendEmail,
        resetEmail,
        markAsSent,
        markAsPending,
        toggleEnabled,
        setData,
        setDiscountsEnabled,
    };
}
