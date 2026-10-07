"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { LogOut, ExternalLink, Loader2 } from "lucide-react";

export default function AdminHeader() {
  const { user, adminProfile, logout } = useAdminAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  let liveUrl = "/";
  if (pathname.startsWith("/admin/services")) {
    liveUrl = "/services";
  } else if (pathname.startsWith("/admin/gallery")) {
    liveUrl = "/gallery";
  } else if (pathname.startsWith("/admin/leadership")) {
    liveUrl = "/about"; // Leadership is on the About page
  } else if (pathname.startsWith("/admin/inquiries")) {
    liveUrl = "/contact";
  }

  // We only show the header on actual admin authenticated routes
  // (We don't want this on /admin/login)
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#071221]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Left Side: Logo & Badge */}
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center group">
          <div className="relative h-10 sm:h-12 w-[180px] sm:w-[220px] transition-transform duration-300 group-hover:scale-[1.02]">
            <Image
              src="/logo-header.png"
              alt="Standard Engineering Works Elevators Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#0062FF]/10 border border-[#0062FF]/20 rounded-lg shadow-inner">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#38BDF8]">
            Admin Control
          </span>
        </div>
      </div>

      {/* Right Side: Controls & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Link
            href={liveUrl}
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-white bg-[#0062FF] hover:bg-[#007AE6] px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,98,255,0.4)] hover:shadow-[0_0_20px_rgba(0,98,255,0.6)]"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end justify-center">
            <div className="text-[13px] font-semibold text-white tracking-wide">
              {user?.email?.split('@')[0] || "Administrator"}
            </div>
            <div className="text-[10px] text-[#0062FF] font-bold uppercase tracking-wider">
              {adminProfile?.role || "ADMIN"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sign Out"
            title="Sign Out"
            className="p-2 sm:px-4 sm:py-2 bg-[#0C1A2E] hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
