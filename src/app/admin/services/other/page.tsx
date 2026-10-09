"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, Wrench, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { getServicesPageSettings, updateServicesPageSettings, OtherServiceSetting } from "@/lib/firestore-data";
import ImageUpload from "@/components/admin/ImageUpload";

const DEFAULT_OTHER_SERVICES: OtherServiceSetting[] = [
  { title: "Structural Fabrication", image: "/images/card_installation.jpg", desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
  { title: "Glass & ACP Sheets", image: "/images/card_modernization.jpg", desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
  { title: "UPVC Window & Door", image: "/images/card_installation.jpg", desc: "High-quality UPVC systems for residential and commercial spaces." },
  { title: "Renovation Works", image: "/images/card_modernization.jpg", desc: "Complete architectural and interior renovation services." },
  { title: "SS Railing", image: "/images/card_maintenance.jpg", desc: "Custom stainless steel handrails and balustrades." },
  { title: "Electrical House Wirings", image: "/images/card_maintenance.jpg", desc: "Complete residential and commercial electrical wiring systems." },
  { title: "Civil Works", image: "/images/card_installation.jpg", desc: "Comprehensive civil construction and shaft preparation." },
];

export default function OtherServicesAdminPage() {
  const [items, setItems] = useState<OtherServiceSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto dismiss toast after 4s
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    getServicesPageSettings().then(data => {
      const fetchedItems = data.otherServices || [];
      // Use default data if no data exists in Firestore
      setItems(fetchedItems.length > 0 ? fetchedItems : DEFAULT_OTHER_SERVICES);
      setIsLoading(false);
    });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { title: "", image: "", desc: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof OtherServiceSetting, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateServicesPageSettings({ otherServices: items });
      setSuccessMessage("Other Engineering Services saved successfully! Changes are live on the website.");
    } catch (e) {
      setErrorMessage("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Floating In-App Toast Notifications */}
        {successMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-[#051E14] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-400/60 hover:text-emerald-300 p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-[#240C0C] border border-rose-500/40 text-rose-300 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {errorMessage}
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400/60 hover:text-rose-300 p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin/services" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services Hub</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-4 py-2 bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wrench className="text-amber-400" />
            Other Engineering Services
          </h1>
          <p className="text-sm text-slate-400">
            Manage Structural Fabrication, Glass & ACP Sheets, Civil Works, and more.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#0070F3]" /></div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-6 relative group">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-white font-semibold text-sm">Other Service #{index + 1}</h3>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-xs font-semibold"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => handleChange(index, "title", e.target.value)}
                      className="w-full px-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#0070F3] outline-none mb-4"
                      placeholder="e.g. Structural Fabrication"
                    />
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Description</label>
                    <textarea
                      value={item.desc}
                      onChange={e => handleChange(index, "desc", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#0070F3] outline-none"
                      placeholder="Brief description of the service..."
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={item.image}
                      onChange={(url) => handleChange(index, "image", url)}
                      folder="standard_elevators/other"
                      label="Service Image"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleAddItem}
              className="w-full py-4 border-2 border-dashed border-white/20 hover:border-[#0070F3] rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold text-sm">Add New Service</span>
            </button>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
