"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

// Official WhatsApp SVG icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

function FloatingWhatsApp() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let serviceContext = "your elevator services and turnkey solutions";
  if (pathname === "/gallery") {
    const cat = searchParams.get("category");
    if (cat) serviceContext = `your ${cat} projects`;
    else serviceContext = "your elevator gallery projects";
  } else if (pathname?.startsWith("/services/")) {
    const slug = pathname.split("/").pop();
    serviceContext = `the ${slug?.replace(/-/g, ' ')} elevator service`;
  } else if (pathname === "/services") {
    serviceContext = "your primary elevator solutions";
  } else if (pathname === "/about") {
    serviceContext = "your company background and engineering capabilities";
  } else if (pathname === "/contact") {
    serviceContext = "getting a customized quote and site survey";
  }

  const waMessage = `Hello Standard Engineering Works, I have visited your website and would like to inquire about ${serviceContext}. Please provide more information and a quote.`;
  const waLink = `https://wa.me/919515231555?text=${encodeURIComponent(waMessage)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-[0_4px_18px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7" />
    </a>
  );
}

export default function FloatingActions() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    // Also attach to Lenis scroll if present
    let lenisHandler: any = null;
    const bindLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.on === "function" && !lenisHandler) {
        lenisHandler = () => toggleVisibility();
        lenis.on("scroll", lenisHandler);
      }
    };
    bindLenis();
    const lenisTimer = setTimeout(bindLenis, 600);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      clearTimeout(lenisTimer);
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.off === "function" && lenisHandler) {
        lenis.off("scroll", lenisHandler);
      }
    };
  }, []);

  const scrollToTop = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // 1. Lenis scroll to top immediately
    try {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { immediate: true });
      }
    } catch {}

    // 2. Immediate window and document scroll to 0,0
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    } catch {
      window.scrollTo(0, 0);
    }

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  return (
    <div 
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[99] flex flex-col items-center w-12 md:w-14"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Scroll to Top (Elevator Push Button) - Positioned in the TOP slot */}
      <button
        onClick={scrollToTop}
        className={`relative shrink-0 flex items-center justify-center transition-all duration-500 rounded-full focus:outline-none group ${
          isVisible ? "opacity-100 translate-y-0 scale-100 pointer-events-auto h-12 w-12 md:h-[56px] md:w-[56px] mb-4 md:mb-5" : "opacity-0 translate-y-4 scale-90 pointer-events-none h-0 w-12 md:w-[56px] mb-0 overflow-hidden"
        }`}
        aria-label="Scroll to top"
      >
        {/* 1. OUTER MOUNTING RING (Machined Steel) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e8e8e8] via-[#a3a3a3] to-[#5a5a5a] shadow-[0_6px_15px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.5)]"></div>
        
        {/* 2. INNER RECESS (Dark shadow gap) */}
        <div className="absolute inset-[3px] md:inset-[4px] rounded-full bg-gradient-to-b from-[#111111] to-[#333333] shadow-[inset_0_3px_5px_rgba(0,0,0,0.9)]"></div>
        
        {/* 3. PHYSICAL BUTTON SURFACE (Raised Brushed Steel) */}
        <div className="absolute inset-[4px] md:inset-[5px] rounded-full bg-gradient-to-b from-[#fdfdfd] via-[#d4d4d4] to-[#9a9a9a] flex items-center justify-center transition-all duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-active:scale-[0.96] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.7)] group-active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.5)] group-hover:brightness-105">
          
          {/* Radial brushed metal sheen */}
          <div className="absolute inset-0 rounded-full opacity-[0.25] mix-blend-overlay pointer-events-none" 
               style={{ background: 'conic-gradient(from 0deg at 50% 50%, #fff 0deg, #333 45deg, #fff 90deg, #333 135deg, #fff 180deg, #333 225deg, #fff 270deg, #333 315deg, #fff 360deg)' }}>
          </div>
          
          {/* 4. CENTER ARROW (Engraved symbol with subtle hover illumination) */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="relative z-10 w-5 h-5 md:w-[22px] md:h-[22px] text-[#1a1a1a] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:text-[#0877F9] group-hover:drop-shadow-[0_0_8px_rgba(8,119,249,0.7)] group-active:drop-shadow-[0_0_4px_rgba(8,119,249,0.5)]"
          >
            <polyline points="18 15 12 8 6 15"></polyline>
          </svg>
        </div>
      </button>

      {/* WhatsApp Button - Positioned in the BOTTOM slot */}
      <div className="z-10 shrink-0">
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>
      </div>
    </div>
  );
}
