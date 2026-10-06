"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1, // Reset multiplier
      syncTouch: false, // Don't intercept touch events
    });

    // Expose lenis instance globally for smooth scroll-to-top and navigation
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }
    
    lenisRef.current = lenis;

    // Auto-update Lenis bounds on any DOM / image / layout size changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const handleResize = () => {
      lenis.resize();
    };

    window.addEventListener("resize", handleResize);

    // Initial resize pass after layout stabilizes
    const timer = setTimeout(() => {
      lenis.resize();
    }, 500);

    // Handle the requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  // Handle scroll restoration on route change
  useEffect(() => {
    if (lenisRef.current) {
      // If there's a hash, let browser/Lenis handle it naturally
      if (!window.location.hash) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
