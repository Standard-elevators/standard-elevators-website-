"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ShieldAlert, LogOut, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthorizedAdmin, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state has resolved and user is not authenticated, redirect to login
    if (!isLoading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/admin/login?returnUrl=${returnUrl}`);
    }
  }, [isLoading, user, pathname, router]);

  // 1. Initial Loading Screen — Prevents any flash of protected UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071221] flex flex-col items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="mb-8">
            <Image
              src="/logo-header.png"
              alt="Standard Engineering Works Elevators"
              width={220}
              height={43}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-3 text-slate-300 mb-2">
            <Loader2 className="w-5 h-5 text-[#0070F3] animate-spin" />
            <span className="text-sm font-medium tracking-wide">
              Verifying Administrator Access...
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Checking Firebase Authentication and Firestore Security Credentials
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated — Redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-[#071221] flex flex-col items-center justify-center p-6 text-white">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="w-5 h-5 text-[#0070F3] animate-spin" />
          <span className="text-sm">Redirecting to administrator sign in...</span>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized User Screen
  if (user && !isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#071221] flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-[#0C1A2E] border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Access Denied: Unauthorized Account
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Your account <span className="font-semibold text-white">({user.email})</span> is authenticated with Firebase, but has not been provisioned in the administrator allowlist.
          </p>

          <div className="bg-[#071221] border border-white/10 rounded-xl p-4 mb-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Your Firebase Authentication UID
            </span>
            <code className="text-xs text-[#38BDF8] break-all select-all font-mono">
              {user.uid}
            </code>
            <p className="text-[11px] text-slate-500 mt-2">
              To grant access, add a document in Firestore under the <code className="text-slate-400">admins</code> collection with this UID as the document ID and <code className="text-slate-400">isActive: true</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => logout()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0070F3] hover:bg-[#0060DF] text-white text-sm font-medium rounded-xl transition-colors"
            >
              <span>Public Site</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated & Authorized Admin
  return <>{children}</>;
}
