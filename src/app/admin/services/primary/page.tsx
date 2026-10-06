"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  seedInitialServices,
  sanitizeSlug,
} from "@/lib/firestore-data";
import { ServiceItem, PublicationStatus } from "@/types/data";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import {
  ArrowLeft,
  Building,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  Search,
} from "lucide-react";

interface ServiceFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  specsInput: string;
  imageUrl: string;
  imagePublicId?: string;
  orderIndex: number;
  status: PublicationStatus;
}

const DEFAULT_FORM_DATA: ServiceFormData = {
  title: "",
  slug: "",
  category: "Commercial & Residential",
  description: "",
  specsInput: "3 phase, 415v, 50Hz\nUp to 15 stops\nSmooth gearless travel",
  imageUrl: "/hero-elevator.jpg",
  imagePublicId: undefined,
  orderIndex: 1,
  status: "published",
};

function AdminServicesContent() {
  const { user } = useAdminAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [initialFormData, setInitialFormData] = useState<ServiceFormData>(DEFAULT_FORM_DATA);
  const [formData, setFormData] = useState<ServiceFormData>(DEFAULT_FORM_DATA);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Check if form has unsaved modifications
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Real-time duplicate slug detection
  const isSlugDuplicate = useMemo(() => {
    const clean = sanitizeSlug(formData.slug);
    if (!clean) return false;
    return services.some((s) => s.slug === clean && s.id !== editingService?.id);
  }, [formData.slug, services, editingService]);

  // Warning when changing a published service slug
  const isSlugChangedOnExisting = useMemo(() => {
    if (!editingService) return false;
    return editingService.slug !== formData.slug;
  }, [editingService, formData.slug]);

  // Warn on page unload if modal has unsaved changes
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

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      setActionError((err as Error).message || "Failed to load services from Firestore.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAllServices()
      .then((data) => {
        if (active) setServices(data);
      })
      .catch((err) => {
        if (active) setActionError((err as Error).message || "Failed to load services from Firestore.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    const initial: ServiceFormData = {
      title: "",
      slug: "",
      category: "Commercial & Residential",
      description: "",
      specsInput: "3 phase, 415v, 50Hz\nUp to 15 stops\nSmooth gearless travel",
      imageUrl: "/hero-elevator.jpg",
      imagePublicId: undefined,
      orderIndex: services.length + 1,
      status: "published",
    };
    setInitialFormData(initial);
    setFormData(initial);
    setActionError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    const initial: ServiceFormData = {
      title: service.title,
      slug: service.slug,
      category: service.category || "Commercial & Residential",
      description: service.description || "",
      specsInput: (service.specs || []).join("\n"),
      imageUrl: service.imageUrl || "/hero-elevator.jpg",
      imagePublicId: service.imagePublicId,
      orderIndex: service.orderIndex || 1,
      status: service.status,
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

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug only if creating a new service and slug hasn't been manually diverged
      slug: !editingService ? sanitizeSlug(newTitle) : prev.slug,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSlugDuplicate) {
      setActionError(`The slug "${formData.slug}" is already in use by another elevator service.`);
      return;
    }

    setIsSaving(true);
    setActionError(null);

    const specsArray = formData.specsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const attribution = user?.email || user?.uid || "Admin";

    try {
      if (editingService?.id) {
        // Safe image replacement: if image was replaced with a new one and previous had a publicId
        const previousPublicId = editingService.imagePublicId;
        const newPublicId = formData.imagePublicId;

        // Update existing service
        await updateService(editingService.id, {
          title: formData.title,
          slug: formData.slug,
          category: formData.category,
          description: formData.description,
          specs: specsArray,
          imageUrl: formData.imageUrl,
          imagePublicId: formData.imagePublicId,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });

        // If replaced and old publicId exists and changed, delete the old Cloudinary asset
        if (previousPublicId && newPublicId && previousPublicId !== newPublicId && user) {
          try {
            const idToken = await user.getIdToken();
            await deleteCloudinaryAsset(previousPublicId, idToken);
          } catch {
            // Non-blocking cleanup
          }
        }

        setSuccessMessage(`Service "${formData.title}" updated successfully.`);
      } else {
        // Create new service
        await createService({
          title: formData.title,
          slug: formData.slug,
          category: formData.category,
          description: formData.description,
          specs: specsArray,
          imageUrl: formData.imageUrl,
          imagePublicId: formData.imagePublicId,
          orderIndex: Number(formData.orderIndex),
          status: formData.status,
          updatedBy: attribution,
        });
        setSuccessMessage(`Service "${formData.title}" created successfully.`);
      }

      setIsFormOpen(false);
      await loadServices();
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
      const target = services.find((s) => s.id === id);
      await deleteService(id);

      // Clean up Cloudinary asset if an image was uploaded
      if (target?.imagePublicId && user) {
        try {
          const idToken = await user.getIdToken();
          await deleteCloudinaryAsset(target.imagePublicId, idToken);
        } catch {
          // Non-blocking cleanup
        }
      }

      setSuccessMessage("Elevator service deleted successfully.");
      setDeleteConfirmId(null);
      await loadServices();
    } catch (err) {
      setActionError((err as Error).message || "Failed to delete service.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (service: ServiceItem) => {
    if (!service.id) return;
    const newStatus: PublicationStatus = service.status === "published" ? "draft" : "published";
    try {
      await updateService(service.id, {
        status: newStatus,
        updatedBy: user?.email || user?.uid || "Admin",
      });
      setSuccessMessage(`Status updated to ${newStatus} for "${service.title}".`);
      await loadServices();
    } catch (err) {
      setActionError((err as Error).message || "Failed to toggle status.");
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    setActionError(null);
    try {
      const count = await seedInitialServices();
      if (count > 0) {
        setSuccessMessage(`Successfully seeded ${count} default elevator services into Firestore.`);
      } else {
        setSuccessMessage("Services collection already has records.");
      }
      await loadServices();
    } catch (err) {
      setActionError((err as Error).message || "Failed to seed default catalog.");
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Hub</span>
        </Link>
        <Link
          href="/services"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline"
        >
          <span>View Public Services Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Elevator Services Catalog
          </h1>
          <p className="text-sm text-slate-400">
            Real Firestore database management for elevator models, specifications, and publication visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDefaults}
            disabled={isSeeding || isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
            title="Seed verified company catalog into Firestore"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0070F3]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            )}
            <span>Sync Default Catalog</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white text-xs font-semibold rounded-xl shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Elevator Service</span>
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
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0C1A2E] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search elevator services by title, slug, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="text-slate-400 mr-1">Status:</span>
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

      {/* Services List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#0070F3] animate-spin mb-3" />
          <p className="text-xs text-slate-400">Loading elevator services from Firestore...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <Building className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No services found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            No elevator services match your filter criteria or the database is currently unpopulated.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Populate Default Catalog
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl transition-all"
            >
              Create New Service
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id || service.slug}
              className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-white/20 transition-all shadow-md"
            >
              {/* Service Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#0070F3]/10 border border-[#0070F3]/20 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <Building className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-white">{service.title}</h3>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        service.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {service.status}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      /services/{service.slug}
                    </span>

                    {service.updatedBy && (
                      <span className="text-[10px] text-slate-500">
                        by {service.updatedBy}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Specifications tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500 mr-1">Specs:</span>
                    {service.specs.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="bg-[#071221] px-2 py-0.5 rounded-md border border-white/5 text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                    {service.specs.length > 3 && (
                      <span className="text-slate-500 font-medium">
                        +{service.specs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order index & Controls */}
              <div className="flex items-center justify-between lg:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
                <div className="text-left lg:text-right pr-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                    Order Index
                  </span>
                  <span className="text-xs font-bold text-white">#{service.orderIndex}</span>
                </div>

                {/* Quick Toggle Status */}
                <button
                  onClick={() => handleToggleStatus(service)}
                  title={service.status === "published" ? "Unpublish to draft" : "Publish to live site"}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-colors text-xs flex items-center gap-1"
                >
                  {service.status === "published" ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  )}
                </button>

                {/* Public Preview Link */}
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  title="Preview service route in new tab"
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Edit */}
                <button
                  onClick={() => openEditModal(service)}
                  title="Edit service details"
                  className="p-2 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 text-[#38BDF8] rounded-xl border border-[#0070F3]/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteConfirmId(service.id || null)}
                  title="Delete service"
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-10 sm:pt-16 overflow-y-auto">
          <div className="bg-[#0C1A2E] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl mb-16 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {editingService ? "Edit Elevator Service" : "Add New Elevator Service"}
                  </h3>
                  {isDirty && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Unsaved changes
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Configure technical specifications, URL slug, and public visibility.
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
                  htmlFor="service-title-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Service Title *
                </label>
                <input
                  id="service-title-input"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Hydraulic Panoramic Lifts"
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="service-slug-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                      URL Slug * (Unique)
                    </label>
                    {editingService && (
                      <Link
                        href={`/services/${formData.slug}`}
                        target="_blank"
                        className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <input
                    id="service-slug-input"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: sanitizeSlug(e.target.value) }))
                    }
                    placeholder="e.g. hydraulic-panoramic-lifts"
                    className={`w-full px-3.5 py-2.5 bg-[#071221] border rounded-xl text-xs font-mono text-[#38BDF8] focus:outline-none focus:ring-2 ${
                      isSlugDuplicate
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:ring-[#0070F3]"
                    }`}
                  />
                  {isSlugDuplicate && (
                    <div className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>This slug is already used by another elevator service.</span>
                    </div>
                  )}
                  {isSlugChangedOnExisting && !isSlugDuplicate && (
                    <div className="mt-1.5 text-[11px] text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Note: Modifying this slug changes the live URL path.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="service-category-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Category
                  </label>
                  <input
                    id="service-category-input"
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="e.g. Commercial & Residential"
                    className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="service-description-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="service-description-input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Comprehensive overview of technical capabilities, safety mechanisms, and passenger comfort."
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                />
              </div>

              {/* Specifications */}
              <div>
                <label
                  htmlFor="service-specs-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Key Specifications (one per line)
                </label>
                <textarea
                  id="service-specs-input"
                  rows={3}
                  value={formData.specsInput}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, specsInput: e.target.value }))
                  }
                  placeholder={"Commercial & Residential\n3 phase, 415v, 50Hz\n6-20 persons (408-1380 kg)\nUp to 15 stops"}
                  className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
                />
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
                  folder="standard_elevators/services"
                  label="Service Visual Asset (Cloudinary Upload)"
                />
              </div>

              {/* Order Index & Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label
                    htmlFor="service-order-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Display Order
                  </label>
                  <input
                    id="service-order-input"
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
                    htmlFor="service-status-select"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Publication Status
                  </label>
                  <select
                    id="service-status-select"
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
                  disabled={isSaving || isSlugDuplicate || !formData.title.trim() || !formData.slug.trim()}
                  className="px-5 py-2.5 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? "Update Service" : "Create Service"}</span>
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Elevator Service?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this elevator service record from Firestore? This action cannot be undone.
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

export default function AdminServicesPage() {
  return (
    <AdminGuard>
      <AdminServicesContent />
    </AdminGuard>
  );
}
