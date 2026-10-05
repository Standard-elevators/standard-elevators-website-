"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function MobileStickyBar() {
  const pathname = usePathname();

  // Hide on admin routes and contact page itself to prevent redundant sticky UI
  if (pathname?.startsWith("/admin") || pathname === "/contact") {
    return null;
  }

  return (
    <aside
      aria-label="Quick mobile action bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#051326]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 shadow-2xl transition-all"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* Call Direct */}
        <a
          href="tel:9515231555"
          onClick={() => trackEvent("click_phone", { label: "mobile_sticky_call" })}
          aria-label="Call Standard Engineering Works at 9515231555"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/15 active:scale-[0.98] transition-all"
        >
          <Phone className="w-3.5 h-3.5 text-[#0070F3]" />
          <span>Call 9515231555</span>
        </a>

        {/* Quote Request */}
        <Link
          href="/contact"
          onClick={() => trackEvent("cta_click", { label: "mobile_sticky_quote" })}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-semibold tracking-wide shadow-md shadow-[#0070F3]/30 active:scale-[0.98] transition-all"
        >
          <span>Get a Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
