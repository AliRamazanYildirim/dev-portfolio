"use client";

import toast from "react-hot-toast";
import type { DiscountEntry } from "../types";

type Deps = {
    markAsSent: (entry: DiscountEntry) => Promise<void>;
    markAsPending: (entry: DiscountEntry) => Promise<void>;
    deleteDiscount: (entry: DiscountEntry) => Promise<void>;
    sendEmail: (entry: DiscountEntry, rate: number | "+3") => Promise<void>;
    resetEmail: (entry: DiscountEntry) => Promise<void>;
    confirmMarkPending: (entry: DiscountEntry, onConfirm: () => Promise<void>) => void;
    confirmDelete: (entry: DiscountEntry, onConfirm: () => Promise<void>) => void;
    confirmResetEmail: (entry: DiscountEntry, onConfirm: () => Promise<void>) => void;
};

export function createDiscountActions(deps: Deps) {
    const {
        markAsSent,
        markAsPending,
        deleteDiscount,
        sendEmail,
        resetEmail,
        confirmMarkPending,
        confirmDelete,
        confirmResetEmail,
    } = deps;

    async function handleMarkAsSent(entry: DiscountEntry) {
        try {
            await markAsSent(entry);
        } catch (error) {
            console.error(error);
            toast.error("Discount status could not be updated");
        }
    }

    function handleMarkAsPending(entry: DiscountEntry) {
        confirmMarkPending(entry, async () => {
            try {
                await markAsPending(entry);
            } catch (error) {
                console.error(error);
                toast.error("Discount status could not be updated");
            }
        });
    }

    function handleDeleteDiscount(entry: DiscountEntry) {
        confirmDelete(entry, async () => {
            try {
                await deleteDiscount(entry);
                toast.success("Discount record deleted");
            } catch (error) {
                console.error(error);
                toast.error("Discount could not be deleted");
            }
        });
    }

    async function handleSendEmail(entry: DiscountEntry, rate: number | "+3") {
        try {
            await sendEmail(entry, rate);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Email could not be sent");
        }
    }

    function handleResetEmail(entry: DiscountEntry) {
        confirmResetEmail(entry, async () => {
            try {
                await resetEmail(entry);
            } catch (error) {
                console.error(error);
                toast.error("Failed to reset email status");
            }
        });
    }

    return {
        handleMarkAsSent,
        handleMarkAsPending,
        handleDeleteDiscount,
        handleSendEmail,
        handleResetEmail,
    };
}
