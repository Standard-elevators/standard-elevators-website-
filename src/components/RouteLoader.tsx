"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Navigation completed
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      
      const href = target.getAttribute("href");
      if (!href) return;
      
      // Ignore external links or blank targets
      if (target.getAttribute("target") === "_blank") return;
      if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
      
      try {
        const targetUrl = new URL(target.href, window.location.origin);
        // Only show loader if we're actually navigating to a new path
        if (targetUrl.pathname !== window.location.pathname) {
          setIsLoading(true);
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 z-[99999] w-full h-[3px] overflow-hidden bg-white/5">
      <div className="h-full bg-[#0070F3] relative shadow-[0_0_10px_#0070F3] animate-[routing_1s_ease-in-out_infinite]"></div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes routing {
          0% { width: 0%; left: 0%; }
          50% { width: 50%; left: 25%; }
          100% { width: 100%; left: 100%; }
        }
      `}} />
    </div>
  );
}
