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

  let serviceContext = "your elevator services";
  if (pathname === "/gallery") {
    const cat = searchParams.get("category");
    if (cat) serviceContext = `your ${cat} projects`;
    else serviceContext = "your elevator gallery projects";
  } else if (pathname?.startsWith("/services/")) {
    const slug = pathname.split("/").pop();
    serviceContext = `the ${slug?.replace(/-/g, ' ')} service`;
  } else if (pathname === "/services") {
    serviceContext = "your elevator services";
  }

  const waMessage = `Hello Standard Engineering Works, I am interested in ${serviceContext} and would like more information.`;
  const waLink = `https://wa.me/919515231555?text=${encodeURIComponent(waMessage)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
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
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    try {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (err) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div 
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-center w-12 md:w-14"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className={`transition-transform duration-300 transform z-10 ${isVisible ? "translate-y-[-60px] md:translate-y-[-68px]" : "translate-y-0"}`}>
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`absolute bottom-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-gray-50 text-[#087CF5] flex items-center justify-center shadow-[0_4px_15px_rgba(8,124,245,0.25)] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087CF5] ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 md:w-7 md:h-7" />
      </button>
    </div>
  );
}
