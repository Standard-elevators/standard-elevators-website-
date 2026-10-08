"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import { getAllServices, getAllGallery, getAllInquiries } from "@/lib/firestore-data";
import { ServiceItem, GalleryItem, InquiryItem } from "@/types/data";
import {
  Building,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Clock,
  FileCheck,
  FileEdit,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface RecentActivityItem {
  id: string;
  title: string;
  type: "Service" | "Gallery";
  status: "published" | "draft";
  timestamp: number;
  formattedDate: string;
  updatedBy?: string;
  href: string;
}

function parseTimestamp(ts: unknown): number | null {
  if (!ts) return null;
  // Firestore Timestamp instance
  if (typeof ts === "object" && ts !== null) {
    if ("toMillis" in ts && typeof (ts as { toMillis: () => number }).toMillis === "function") {
      return (ts as { toMillis: () => number }).toMillis();
    }
    if ("toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
      return (ts as { toDate: () => Date }).toDate().getTime();
    }
    if ("seconds" in ts && typeof (ts as { seconds: number }).seconds === "number") {
      return (ts as { seconds: number }).seconds * 1000;
    }
  }
  // ISO string or number
  if (typeof ts === "string" || typeof ts === "number") {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return null;
}

function AdminDashboardContent() {
  const { user, adminProfile } = useAdminAuth();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [servicesData, galleryData, inquiriesData] = await Promise.all([
        getAllServices(),
        getAllGallery(),
        getAllInquiries(),
      ]);
      setServices(servicesData);
      setGallery(galleryData);
      setInquiries(inquiriesData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError((err as Error).message || "Failed to load dashboard metrics from Firebase.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getAllServices(), getAllGallery(), getAllInquiries()])
      .then(([servicesData, galleryData, inquiriesData]) => {
        if (active) {
          setServices(servicesData);
          setGallery(galleryData);
          setInquiries(inquiriesData);
        }
      })
      .catch((err) => {
        if (active) {
          console.error("Dashboard fetch error:", err);
          setError((err as Error).message || "Failed to load dashboard metrics from Firebase.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    loadData();
  };

  // Derive real statistics from verified Firestore data
  const totalServices = services.length;
  const publishedServices = services.filter((s) => s.status === "published").length;
  const draftServices = services.filter((s) => s.status === "draft").length;

  const totalGallery = gallery.length;
  const publishedGallery = gallery.filter((g) => g.status === "published").length;
  const draftGallery = gallery.filter((g) => g.status === "draft").length;

  const totalCatalogRecords = totalServices + totalGallery;
  const totalPublished = publishedServices + publishedGallery;
  const totalDrafts = draftServices + draftGallery;

  // Derive recent activity strictly from records that possess actual timestamps
  const recentActivities: RecentActivityItem[] = [];

  services.forEach((s) => {
    const rawTime = s.updatedAt || s.createdAt;
    const ms = parseTimestamp(rawTime);
    if (ms !== null) {
      recentActivities.push({
        id: s.id || s.slug,
        title: s.title,
        type: "Service",
        status: s.status,
        timestamp: ms,
        formattedDate: new Date(ms).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedBy: s.updatedBy,
        href: "/admin/services",
      });
    }
  });

  gallery.forEach((g) => {
    const rawTime = g.updatedAt || g.createdAt;
    const ms = parseTimestamp(rawTime);
    if (ms !== null) {
      recentActivities.push({
        id: g.id || g.title,
        title: g.title,
        type: "Gallery",
        status: g.status,
        timestamp: ms,
        formattedDate: new Date(ms).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedBy: g.updatedBy,
        href: "/admin/gallery",
      });
    }
  });

  // Sort descending by timestamp
  recentActivities.sort((a, b) => b.timestamp - a.timestamp);
  const latestActivities = recentActivities.slice(0, 6);

  return (
    <div className="flex-grow flex flex-col w-full">
      {/* Main Admin Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#0C1A2E] via-[#0E2038] to-[#0C1A2E] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0070F3]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authorized Administrator Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Elevator Management System
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Standard Engineering Works Elevators administration dashboard. Manage lift catalog offerings, project gallery imagery, and review real-time database state securely.
            </p>
          </div>
        </div>

        {/* Error Alert State */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start justify-between gap-3 text-red-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded text-xs font-medium transition-colors flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Real Data Metrics Strip */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0070F3]" />
                <span>Live Firestore Content Metrics</span>
              </h2>
              <span className="text-xs text-slate-500">
                Verified from Firebase Firestore
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 shadow-sm w-fit"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0062FF]" : ""}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#0C1A2E] border border-white/10 rounded-xl p-5 animate-pulse h-28 flex flex-col justify-between">
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-8 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Catalog Items */}
              <div className="bg-[#0C1A2E] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Records</span>
                  <Database className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {totalCatalogRecords}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">{totalPublished} Published</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">{totalDrafts} Drafts</span>
                </div>
              </div>

              {/* Service Catalog Total */}
              <Link
                href="/admin/services"
                className="bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-[#0070F3]/40 transition-all rounded-xl p-5 shadow-lg group block"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Services</span>
                  <Building className="w-4 h-4 text-[#0070F3] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-between">
                  <span>{totalServices}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#38BDF8] transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-400 font-medium">{publishedServices} active</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{draftServices} drafts</span>
                </div>
              </Link>

              {/* Gallery Items Total */}
              <Link
                href="/admin/gallery"
                className="bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-[#0070F3]/40 transition-all rounded-xl p-5 shadow-lg group block"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Gallery Projects</span>
                  <ImageIcon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-between">
                  <span>{totalGallery}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-400 font-medium">{publishedGallery} active</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{draftGallery} drafts</span>
                </div>
              </Link>

              {/* Total Inquiries Received */}
              <Link
                href="/admin/inquiries"
                className="bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-emerald-500/40 transition-all rounded-xl p-5 shadow-lg group block"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Inquiries Received</span>
                  <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-between">
                  <span>{inquiries.length}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Available in the Inbox
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Management Modules Grid */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Management Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/services"
              className="group bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-[#0070F3]/50 rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0070F3]/10 border border-[#0070F3]/20 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#0070F3] group-hover:text-white transition-all">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    Catalog
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#38BDF8] transition-colors">
                  Services
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Manage passenger, MRL, hospital, and freight lift specifications, slug routes, and publishing status.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                <span>
                  {isLoading ? "Loading..." : `${totalServices} Total (${publishedServices} Published)`}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-[#38BDF8] transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="group bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    Assets
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  Project Gallery
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Manage completed lift installations, cabin interiors, architectural doors, and Cloudinary uploads.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                <span>
                  {isLoading ? "Loading..." : `${totalGallery} Total (${publishedGallery} Published)`}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-purple-300 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/inquiries"
              className="group bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    CRM
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  Client Inquiries
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Review quotation inquiries, technical requests, and customer contact leads submitted through the website.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                <span>Real-time Inquiries</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-300 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/leadership"
              className="group bg-[#0C1A2E] hover:bg-[#10243E] border border-white/10 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    Profile
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors">
                  Leadership Photo
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Upload, replace, and visually adjust the founder image displayed on the About page.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white">
                <span>Edit Photo Profile</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-orange-300 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Updates Feed (strictly verified from Firestore timestamps) */}
        <div className="mb-12 bg-[#0C1A2E] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Recent Content Updates
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Only records with verified Firestore timestamps
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : latestActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <FileEdit className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
              <p className="text-sm font-medium text-slate-300">No timestamped updates recorded yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Edits, creations, or publications performed through the admin console will record Firestore timestamps and appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {latestActivities.map((act) => (
                <div
                  key={`${act.type}-${act.id}`}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        act.type === "Service"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                          : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                      }`}
                    >
                      {act.type}
                    </span>
                    <span className="text-sm font-medium text-white truncate max-w-sm sm:max-w-md">
                      {act.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        act.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400 flex-shrink-0">
                    <div className="text-right">
                      <div>{act.formattedDate}</div>
                      {act.updatedBy && (
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          by {act.updatedBy}
                        </div>
                      )}
                    </div>
                    <Link
                      href={act.href}
                      className="text-xs text-[#38BDF8] hover:text-white hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </main>

      {/* Admin Footer */}
      <footer className="border-t border-white/10 py-4 px-6 text-center text-xs text-slate-500">
        Standard Engineering Works Elevators • Administrative Content System
      </footer>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
