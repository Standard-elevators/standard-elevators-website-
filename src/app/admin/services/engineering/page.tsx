"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, Settings, Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import { getServicesPageSettings, updateServicesPageSettings, EngineeringServiceSetting } from "@/lib/firestore-data";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EngineeringAdminPage() {
  const [items, setItems] = useState<EngineeringServiceSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getServicesPageSettings().then(data => {
      setItems(data.engineeringServices || []);
      setIsLoading(false);
    });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { title: "", image: "", desc: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof EngineeringServiceSetting, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateServicesPageSettings({ engineeringServices: items });
      alert("Engineering Services saved successfully!");
    } catch (e) {
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
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
            <Settings className="text-emerald-400" />
            Engineering Services
          </h1>
          <p className="text-sm text-slate-400">
            Manage the content and images for the Engineering Services carousel.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#0070F3]" /></div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-6 relative group">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => handleChange(index, "title", e.target.value)}
                      className="w-full px-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#0070F3] outline-none mb-4"
                      placeholder="e.g. New Installation"
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
                      folder="standard_elevators/engineering"
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
              <span className="font-semibold text-sm">Add New Engineering Service</span>
            </button>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
