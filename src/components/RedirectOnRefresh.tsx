"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RedirectOnRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if it's a page reload
    let isReload = false;
    
    if (typeof performance !== "undefined") {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isReload = (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      } else if (performance.navigation && performance.navigation.type === 1) {
        // Fallback for older browsers
        isReload = true;
      }
    }

    if (isReload) {
      // Prevent default browser scroll restoration so we always start fresh
      if (typeof window !== "undefined" && window.history) {
        window.history.scrollRestoration = "manual";
      }
      
      // Always scroll to top on refresh
      window.scrollTo(0, 0);

      // If it's a hard refresh on a non-home page, redirect to home
      if (pathname !== "/") {
        router.replace("/");
      }
    }
  }, [pathname, router]);

  return null;
}
