"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  seedInitialGallery,
  notifyGalleryUpdated,
} from "@/lib/firestore-data";
import { GalleryItem, GalleryCategory, PublicationStatus, MediaType } from "@/types/data";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import {
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Search,
  Filter,
} from "lucide-react";

const CATEGORIES: GalleryCategory[] = ["Passenger Lifts", "Goods Lifts", "Hospital Lifts", "MRL Lifts", "Installation", "Cabins", "Doors", "Components"];

interface GalleryFormData {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  imagePublicId?: string;
  mediaType: MediaType;
  altText: string;
  orderIndex: number;
  status: PublicationStatus;
}

const DEFAULT_GALLERY_FORM: GalleryFormData = {
  title: "",
  category: "Installation",
  imageUrl: "/hero-elevator.jpg",
  imagePublicId: undefined,
  mediaType: "image",
  altText: "",
  orderIndex: 1,
  status: "published",
};

function AdminGalleryContent() {
  const { user } = useAdminAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal & deletion states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [initialFormData, setInitialFormData] = useState<GalleryFormData>(DEFAULT_GALLERY_FORM);
  const [formData, setFormData] = useState<GalleryFormData>(DEFAULT_GALLERY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Auto-dismiss success after 4s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // Check if form has unsaved modifications
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Warn on page unload if modal has unsaved modifications
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormOpen && isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormOpen, isDirty]);

  const loadGallery = useCallback(async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await getAllGallery();
      setItems(data);
    } catch (err) {
      setActionError((err as Error).message || "Failed to load gallery from Firestore.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAllGallery()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        if (active) setActionError((err as Error).message || "Failed to load gallery from Firestore.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Lock body scroll and stop Lenis when modal is open
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (isFormOpen || deleteConfirmId !== null) {
      document.body.style.overflow = "hidden";
      if (lenis && typeof lenis.stop === "function") lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      if (lenis && typeof lenis.start === "function") lenis.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      if (lenis && typeof lenis.start === "function") lenis.start();
    };
  }, [isFormOpen, deleteConfirmId]);

  const openCreateModal = () => {
    setEditingItem(null);
    const initial: GalleryFormData = {
      title: "",
      category: "Installation",
      imageUrl: "/hero-elevator.jpg",
      imagePublicId: undefined,
      mediaType: "image",
      altText: "",
      orderIndex: items.length + 1,
      status: "published",
    };
    setInitialFormData(initial);
    setFormData(initial);
    setActionError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    const isVid = Boolean(item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || item.imageUrl?.includes("/video/upload/"));
    const initial: GalleryFormData = {
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
      mediaType: isVid ? "video" : (item.mediaType || "image"),
      altText: item.altText || item.title || "",
      orderIndex: item.orderIndex || 1,
      status: item.status,
    };
    setInitialFormData(initial);
    setFormData(initial);
    setActionError(null);
    setIsFormOpen(true);
  };

  const handleCloseModal = () => {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmed) return;
    }
    setIsFormOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = formData.title.trim() || `${formData.category} Installation Showcase`;
    if (!formData.imageUrl.trim()) {
      setActionError("Please upload an image or video before creating the project.");
      return;
    }

    setIsSaving(true);
    setActionError(null);

    const attribution = user?.email || user?.uid || "Admin";
    const altTextFinal = formData.altText.trim() || finalTitle;

    try {
      const isVid = Boolean(formData.mediaType === "video" || formData.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || formData.imageUrl.includes("/video/upload/"));

      if (editingItem?.id) {
        const previousPublicId = editingItem.imagePublicId;
        const newPublicId = formData.imagePublicId;

        const updatedItem: GalleryItem = {
          ...editingItem,
          title: finalTitle,
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          mediaType: isVid ? "video" : "image",
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        };

        // Optimistic UI update
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? updatedItem : i)).sort((a, b) => a.orderIndex - b.orderIndex)
        );
        setIsFormOpen(false);
        setSuccessMessage(`Gallery project "${finalTitle}" updated successfully! Changes are live on the website.`);

        // Background update
        await updateGalleryItem(editingItem.id, {
          title: finalTitle,
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          mediaType: isVid ? "video" : "image",
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });

        // Safe replacement: if previous image had a Cloudinary publicId and was replaced
        if (previousPublicId && newPublicId && previousPublicId !== newPublicId && user) {
          user.getIdToken().then(idToken => {
            deleteCloudinaryAsset(previousPublicId, idToken).catch(() => {});
          }).catch(() => {});
        }
      } else {
        const tempId = `gallery-${Date.now()}`;
        const newItem: GalleryItem = {
          id: tempId,
          title: finalTitle,
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          mediaType: isVid ? "video" : "image",
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        };

        // Optimistic UI create
        setItems((prev) => [...prev, newItem].sort((a, b) => a.orderIndex - b.orderIndex));
        setIsFormOpen(false);
        setSuccessMessage(`Gallery project "${finalTitle}" created successfully! Changes are live on the website.`);

        const realId = await createGalleryItem({
          title: finalTitle,
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          mediaType: isVid ? "video" : "image",
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });

        if (realId && realId !== tempId) {
          setItems((prev) => prev.map((i) => (i.id === tempId ? { ...i, id: realId } : i)));
        }
      }
    } catch (err) {
      setActionError((err as Error).message || "Save operation failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError(null);
    // Optimistic: remove from UI instantly
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteConfirmId(null);

    try {
      await deleteGalleryItem(id);

      // Clean up Cloudinary asset
      if (target?.imagePublicId && user) {
        user.getIdToken().then(idToken => {
          deleteCloudinaryAsset(target.imagePublicId!, idToken).catch(() => {});
        }).catch(() => {});
      }

      setSuccessMessage("Gallery project deleted successfully.");
      // Notify public gallery pages
      notifyGalleryUpdated();
    } catch (err) {
      // Rollback on failure
      setItems((prev) => target ? [...prev, target].sort((a, b) => a.orderIndex - b.orderIndex) : prev);
      setActionError((err as Error).message || "Failed to delete gallery item.");
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    if (!item.id) return;
    const newStatus: PublicationStatus = item.status === "published" ? "draft" : "published";
    try {
      await updateGalleryItem(item.id, {
        status: newStatus,
        updatedBy: user?.email || user?.uid || "Admin",
      });
      setSuccessMessage(`Status updated to ${newStatus} for "${item.title}".`);
      await loadGallery();
    } catch (err) {
      setActionError((err as Error).message || "Failed to toggle status.");
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    setActionError(null);
    try {
      const count = await seedInitialGallery();
      if (count > 0) {
        setSuccessMessage(`Successfully seeded ${count} default gallery projects into Firestore.`);
      } else {
        setSuccessMessage("Gallery collection already contains records.");
      }
      await loadGallery();
    } catch (err) {
      setActionError((err as Error).message || "Failed to seed default gallery.");
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" ? true : item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <Link
          href="/gallery"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline"
        >
          <span>View Public Gallery</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Project Gallery Management
          </h1>
          <p className="text-sm text-slate-400">
            Real Firestore database management for architectural installations, cabin finishes, and door systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">


          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white text-xs font-semibold rounded-xl shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Project</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Operation Error:</span>
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0C1A2E] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gallery projects by title or alt text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
              className="px-3 py-1.5 bg-[#071221] border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            {(["all", "published", "draft"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === filter
                    ? "bg-[#0070F3] text-white"
                    : "bg-[#071221] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#0070F3] animate-spin mb-3" />
          <p className="text-xs text-slate-400">Loading gallery projects from Firestore...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No gallery items found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            No projects match your filter criteria or the database is currently unpopulated.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Populate Default Gallery
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl transition-all"
            >
              Add First Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id || item.title}
              className="bg-[#0C1A2E] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Media Preview Container - No Cropping */}
                <div className="relative aspect-[16/10] bg-[#071221] overflow-hidden border-b border-white/10 flex items-center justify-center">
                  {/* Subtle blurred ambient backdrop to fill empty space without cropping main asset */}
                  {!(item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i)) && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover blur-md opacity-20 pointer-events-none"
                    />
                  )}
                  {item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i) ? (
                    <video
                      src={item.imageUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain relative z-10"
                    />
                  ) : (
                    <Image
                      src={item.imageUrl}
                      alt={item.altText || item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-1 relative z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 pointer-events-none z-10" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${
                        item.status === "published"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Category & Media Badge */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    {(item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i)) && (
                      <span className="text-[10px] font-bold bg-purple-500/30 backdrop-blur-md border border-purple-400/40 text-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                    <span className="text-[10px] font-medium bg-[#071221]/80 backdrop-blur-md border border-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#38BDF8] transition-colors">
                    {item.title}
                  </h3>
                  {item.altText && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 italic">
                      Alt: &quot;{item.altText}&quot;
                    </p>
                  )}
                  {item.updatedBy && (
                    <p className="text-[10px] text-slate-500">
                      Edited by {item.updatedBy}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-4 sm:px-5 py-3.5 bg-[#071221]/50 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="text-slate-500 text-[11px] font-medium">
                  Index #{item.orderIndex}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Eye toggle - REMOVED */}

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit project metadata"
                    className="p-1.5 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 text-[#38BDF8] rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmId(item.id || null)}
                    title="Delete project"
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          data-lenis-prevent="true"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          
          {/* Modal Container with Contained Scroll and Sticky Footer */}
          <div 
            className="bg-[#0C1A2E] border border-white/15 rounded-2xl max-w-xl w-full flex flex-col relative z-10 shadow-2xl max-h-[92vh] overflow-hidden"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* 1. STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-white/10 shrink-0 bg-[#0C1A2E]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {editingItem ? "Edit Gallery Project" : "Add Gallery Project"}
                  </h3>
                  {isDirty && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Unsaved changes
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Update installation showcase title, category, accessible alt text, and display settings.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form 
              id="gallery-modal-form"
              onSubmit={handleFormSubmit} 
              className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4"
              data-lenis-prevent="true"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="gallery-title-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Project Title *
                </label>
                <input
                  id="gallery-title-input"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. MRL Glass Elevator Installation"
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                />
              </div>

              {/* Alt Text (Accessibility & SEO) */}
              <div>
                <label
                  htmlFor="gallery-alt-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Image Alt Text (Accessibility & SEO)
                </label>
                <input
                  id="gallery-alt-input"
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, altText: e.target.value }))}
                  placeholder="e.g. Completed gearless passenger elevator inside Hyderabad apartment atrium"
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Defaults to the project title if left blank.
                </span>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="gallery-category-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Category *
                </label>
                <select
                  id="gallery-category-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as GalleryCategory,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cloudinary Visual Asset Upload (Supports Image or Video up to 10MB) */}
              <div className="pt-2">
                <ImageUpload
                  value={formData.imageUrl}
                  publicId={formData.imagePublicId}
                  allowVideo={true}
                  maxSizeBytes={10 * 1024 * 1024}
                  onFileSelected={(file) => {
                    // Auto-populate project title from clean file name if title is empty
                    setFormData((prev) => {
                      if (!prev.title.trim()) {
                        const cleanName = file.name
                          .replace(/\.[^/.]+$/, "")
                          .replace(/[-_]/g, " ")
                          .trim();
                        const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                        return { ...prev, title: capitalized || "Elevator Project Installation" };
                      }
                      return prev;
                    });
                  }}
                  onMediaTypeChange={(type) =>
                    setFormData((prev) => ({ ...prev, mediaType: type }))
                  }
                  onChange={(url, publicId) => {
                    const isVid = Boolean(url.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || url.includes('/video/upload/'));
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: url,
                      imagePublicId: publicId,
                      mediaType: isVid ? "video" : (prev.mediaType || "image"),
                    }));
                  }}
                  folder="standard_elevators/gallery"
                  label="Project Visual Asset (Image or Video - Max 10MB)"
                />
              </div>

              {/* Order Index & Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label
                    htmlFor="gallery-order-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Display Order
                  </label>
                  <input
                    id="gallery-order-input"
                    type="number"
                    min={1}
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, orderIndex: Number(e.target.value) }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gallery-status-select"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Publication Status
                  </label>
                  <select
                    id="gallery-status-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as PublicationStatus,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                  </select>
                </div>
              </div>
            </form>

            {/* 3. STICKY FOOTER - ALWAYS 100% VISIBLE ON SCREEN */}
            <div className="p-4 sm:p-5 border-t border-white/10 shrink-0 bg-[#0C1A2E] flex items-center justify-between gap-3 rounded-b-2xl z-20">
              <div className="text-[11px]">
                {!formData.imageUrl.trim() ? (
                  <span className="text-amber-400 font-medium">⚠️ Upload video or image</span>
                ) : (
                  <span className="text-emerald-400 font-medium">✓ Ready to publish</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="gallery-modal-form"
                  disabled={isSaving || !formData.imageUrl.trim()}
                  className="px-5 py-2.5 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1A2E] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Gallery Project?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this project record from Firestore? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminGalleryPage() {
  return (
    <AdminGuard>
      <AdminGalleryContent />
    </AdminGuard>
  );
}
