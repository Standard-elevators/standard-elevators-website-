"use client";

import React from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";

function AdminInquiriesContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Client Quote & Contact Inquiries
        </h1>
        <p className="text-sm text-slate-400">
          Submissions received from the public website contact and quote request forms.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
        <span>
          Firestore security rules enforce that only verified administrators can query the <code className="text-white">inquiries</code> and <code className="text-white">contacts</code> collections.
        </span>
      </div>

      <div className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">
          Inquiry Pipeline Secured
        </h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
          Customer submissions are written by public visitors through validated Firestore rules and can only be read, resolved, or deleted by authenticated administrators.
        </p>
        <Link
          href="/contact"
          target="_blank"
          className="text-xs text-[#38BDF8] hover:underline"
        >
          View Public Contact Page ↗
        </Link>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <AdminGuard>
      <AdminInquiriesContent />
    </AdminGuard>
  );
}
