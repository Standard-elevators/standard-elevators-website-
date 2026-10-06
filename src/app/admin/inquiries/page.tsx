"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, MessageSquare, AlertCircle, CheckCircle2, X, Loader2, Trash2, Mail, Phone, MapPin, Building, Briefcase } from "lucide-react";
import { getAllInquiries, updateInquiryStatus, deleteInquiry, InquiryItem } from "@/lib/firestore-data";

function formatTimestamp(ts: any) {
  if (!ts) return "Unknown Date";
  if (ts.toDate) {
    return ts.toDate().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return new Date(ts).toLocaleString("en-IN");
}

function AdminInquiriesContent() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch inquiries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id: string, status: "new" | "in-progress" | "resolved") => {
    try {
      await updateInquiryStatus(id, status);
      setSuccess(`Inquiry marked as ${status}`);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    try {
      await deleteInquiry(id);
      setSuccess("Inquiry deleted permanently");
      setDeleteId(null);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err) {
      setError("Failed to delete inquiry");
    } finally {
      setIsProcessing(false);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Client Quote & Contact Inquiries
        </h1>
        <p className="text-sm text-slate-400">
          Manage all incoming customer inquiries and quotation requests from the public website.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#0070F3] animate-spin mb-3" />
          <p className="text-xs text-slate-400">Loading inquiries from Firestore...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No Inquiries Yet</h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
            When customers submit a quote request or contact form from the public website, it will appear here securely.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col hover:border-white/20 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    {inq.name}
                    {inq.status === "new" && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0070F3]/20 text-[#38BDF8] text-[10px] uppercase font-bold tracking-wide border border-[#0070F3]/30">
                        New
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3">{formatTimestamp(inq.createdAt)}</div>
                  
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> {inq.phone}</div>
                    {inq.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {inq.email}</div>}
                    {inq.projectLocation && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {inq.projectLocation}</div>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 self-start">
                  <select 
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none ${
                      inq.status === 'new' ? 'bg-[#0070F3]/10 border-[#0070F3]/30 text-[#38BDF8]' :
                      inq.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <option value="new" className="bg-[#0C1A2E] text-white">New</option>
                    <option value="in-progress" className="bg-[#0C1A2E] text-white">In Progress</option>
                    <option value="resolved" className="bg-[#0C1A2E] text-white">Resolved</option>
                  </select>
                  <button 
                    onClick={() => setDeleteId(inq.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#071221] rounded-xl p-4 border border-white/5 mb-4 text-sm text-slate-300 leading-relaxed">
                {inq.message || <span className="text-slate-500 italic">No additional message provided.</span>}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" /> {inq.serviceRequired || "General Inquiry"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300">
                  <Building className="w-3.5 h-3.5 text-[#38BDF8]" /> {inq.buildingType || "Not Specified"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1A2E] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Inquiry?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this inquiry? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
