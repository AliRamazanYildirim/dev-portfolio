"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "../services/adminAuth.service";

export function useAdminSessionRedirect() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const result = await checkSession();
        if (mounted && result?.success && result?.authenticated) {
          router.push("/admin");
          return;
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setCheckingSession(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [router]);

  return { checkingSession };
}
