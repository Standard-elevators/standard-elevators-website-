"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with gentle, luxury momentum lerp
    const lenis = new Lenis({
      lerp: 0.085, // Smooth linear interpolation for consistent momentum without fast jumps
      wheelMultiplier: 0.95, // Controlled wheel travel per scroll notch
      touchMultiplier: 0.85, // Controlled mobile touch sensitivity
      smoothWheel: true,
      syncTouch: false, // Keep native 120Hz smooth touch physics on mobile/touch screens
      autoResize: true, // Use Lenis internal optimized ResizeObserver
      anchors: {
        offset: -90, // Leave clean clearance below fixed header for anchor links
      },
    });

    // Expose lenis instance globally for smooth scroll-to-top, anchor jumps, and navigation
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }
    
    lenisRef.current = lenis;

    // Handle global anchor click interception to guarantee smooth scrolling on internal hash links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      
      const href = target.getAttribute("href");
      if (!href) return;
      
      // Target hash on the current page
      if (href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        try {
          const el = document.querySelector(href);
          if (el) {
            lenis.scrollTo(href, { offset: -90 });
          }
        } catch {}
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Controlled requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  // Handle smooth scroll restoration or hash navigation on route change
  useEffect(() => {
    if (!lenisRef.current) return;

    if (window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        try {
          const target = document.querySelector(hash);
          if (target && lenisRef.current) {
            lenisRef.current.scrollTo(hash, { offset: -90 });
          }
        } catch {}
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Clean immediate scroll-to-top on route navigation so the new page starts at the top
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
