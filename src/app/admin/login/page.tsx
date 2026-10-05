"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  const { login, isAuthorizedAdmin, isLoading, authError, clearError } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // If already authenticated and authorized as admin, redirect to destination
  useEffect(() => {
    if (!isLoading && isAuthorizedAdmin) {
      router.replace(returnUrl);
    }
  }, [isLoading, isAuthorizedAdmin, router, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    clearError();

    // Client-side validations
    if (!email.trim()) {
      setClientError("Please enter your administrator email address.");
      return;
    }
    if (!password) {
      setClientError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // Navigation happens automatically via useEffect or router.push
      router.replace(returnUrl);
    } catch {
      // Error is stored in authError and handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = clientError || authError;

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6 hover:opacity-95 transition-opacity">
          <Image
            src="/logo-header.png"
            alt="Standard Engineering Works Elevators Logo"
            width={240}
            height={46}
            priority
            className="h-10 sm:h-11 w-auto mx-auto object-contain"
          />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Administrator Portal
        </h1>
        <p className="text-sm text-slate-400">
          Sign in to manage elevator services, gallery assets, and project data.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#0C1A2E]/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8">
        {displayError && (
          <div 
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3 animate-in fade-in duration-200"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label 
              htmlFor="admin-email" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (clientError) setClientError(null);
                }}
                disabled={isSubmitting}
                placeholder="admin@standardengineeringworks.com"
                className="w-full pl-10 pr-4 py-3 bg-[#071221] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="admin-password" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (clientError) setClientError(null);
                }}
                disabled={isSubmitting}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#071221] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white font-semibold text-sm rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.4)] hover:shadow-[0_6px_22px_rgba(0,102,255,0.55)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#071221] focus:ring-[#0070F3]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Authorized administrative access only. Access events are logged for security auditing.
          </p>
        </div>
      </div>

      {/* Return to website */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#071221] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0070F3]/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="w-5 h-5 text-[#0070F3] animate-spin" />
            <span className="text-sm">Loading admin login...</span>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
