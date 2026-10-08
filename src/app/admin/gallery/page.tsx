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
} from "@/lib/firestore-data";
import { GalleryItem, GalleryCategory, PublicationStatus } from "@/types/data";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

const CATEGORIES: GalleryCategory[] = ["Passenger Lifts", "Goods Lifts", "Hospital Lifts", "MRL Lifts", "Installation", "Cabins", "Doors", "Components"];

interface GalleryFormData {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  imagePublicId?: string;
  altText: string;
  orderIndex: number;
  status: PublicationStatus;
}

const DEFAULT_GALLERY_FORM: GalleryFormData = {
  title: "",
  category: "Installation",
  imageUrl: "/hero-elevator.jpg",
  imagePublicId: undefined,
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

  const openCreateModal = () => {
    setEditingItem(null);
    const initial: GalleryFormData = {
      title: "",
      category: "Installation",
      imageUrl: "/hero-elevator.jpg",
      imagePublicId: undefined,
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
    const initial: GalleryFormData = {
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
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
    if (!formData.title.trim()) {
      setActionError("Project title is required.");
      return;
    }
    if (!formData.imageUrl.trim()) {
      setActionError("Image URL or upload is required.");
      return;
    }

    setIsSaving(true);
    setActionError(null);

    const attribution = user?.email || user?.uid || "Admin";
    const altTextFinal = formData.altText.trim() || formData.title.trim();

    try {
      if (editingItem?.id) {
        const previousPublicId = editingItem.imagePublicId;
        const newPublicId = formData.imagePublicId;

        await updateGalleryItem(editingItem.id, {
          title: formData.title.trim(),
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });

        // Safe replacement: if previous image had a Cloudinary publicId and was replaced
        if (previousPublicId && newPublicId && previousPublicId !== newPublicId && user) {
          try {
            const idToken = await user.getIdToken();
            await deleteCloudinaryAsset(previousPublicId, idToken);
          } catch {
            // Non-blocking cleanup
          }
        }

        setSuccessMessage(`Gallery project "${formData.title}" updated successfully.`);
      } else {
        await createGalleryItem({
          title: formData.title.trim(),
          category: formData.category,
          imageUrl: formData.imageUrl.trim(),
          imagePublicId: formData.imagePublicId,
          altText: altTextFinal,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });
        setSuccessMessage(`Gallery project "${formData.title}" created successfully.`);
      }

      setIsFormOpen(false);
      await loadGallery();
    } catch (err) {
      setActionError((err as Error).message || "Save operation failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    setActionError(null);
    try {
      const target = items.find((i) => i.id === id);
      await deleteGalleryItem(id);

      // Clean up Cloudinary asset if an image was uploaded
      if (target?.imagePublicId && user) {
        try {
          const idToken = await user.getIdToken();
          await deleteCloudinaryAsset(target.imagePublicId, idToken);
        } catch {
          // Non-blocking cleanup
        }
      }

      setSuccessMessage("Gallery project deleted successfully.");
      setDeleteConfirmId(null);
      await loadGallery();
    } catch (err) {
      setActionError((err as Error).message || "Failed to delete gallery item.");
    } finally {
      setIsSaving(false);
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
                {/* Image Preview Container */}
                <div className="relative aspect-[16/10] bg-[#071221] overflow-hidden border-b border-white/10">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

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

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
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
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(item)}
                    title={item.status === "published" ? "Unpublish to draft" : "Publish to live site"}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors"
                  >
                    {item.status === "published" ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>

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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-10 sm:pt-16 overflow-y-auto">
          <div className="bg-[#0C1A2E] border border-white/15 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl mb-16 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
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
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
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

              {/* Cloudinary Image Asset Upload */}
              <div className="pt-2">
                <ImageUpload
                  value={formData.imageUrl}
                  publicId={formData.imagePublicId}
                  onChange={(url, publicId) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: url,
                      imagePublicId: publicId,
                    }))
                  }
                  folder="standard_elevators/gallery"
                  label="Project Visual Asset (Cloudinary Upload)"
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

              {/* Form Buttons */}
              <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.title.trim() || !formData.imageUrl.trim()}
                  className="px-5 py-2.5 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
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
