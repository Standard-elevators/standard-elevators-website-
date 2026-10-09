"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, PackagePlus, Plus, Trash2, Save, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getServicesPageSettings, updateServicesPageSettings, CustomizationSetting } from "@/lib/firestore-data";
import ImageUpload from "@/components/admin/ImageUpload";

const DEFAULT_CUSTOMIZATION_DATA: CustomizationSetting[] = [
  {
    title: "Cabin Models",
    image: "/images/card_modernization.jpg",
    description: "Premium architectural cabins with customizable paneling, finishes, and handrails to match any aesthetic.",
    items: ["Standard SS", "Premium Glass", "Custom Designs"],
  },
  {
    title: "Door Options",
    image: "/images/card_installation.jpg",
    description: "High-performance automatic and manual door systems engineered for rapid, safe, and silent operation.",
    items: ["Automatic Sliding Doors", "Manual Collapsible", "Premium Glass Doors"],
  },
  {
    title: "Control & Safety",
    image: "/images/card_maintenance.jpg",
    description: "Advanced microprocessor controllers and intelligent sensors ensuring smooth, reliable, and perfectly leveled rides.",
    items: ["Microprocessor Control", "ARD (Auto Rescue Device)", "Advanced Safety Gears"],
  },
  {
    title: "Machinery",
    image: "/images/card_installation.jpg",
    description: "Heavy-duty geared, gearless, and hydraulic drive systems engineered for maximum durability and efficiency.",
    items: ["Geared Machines", "Gearless Machines", "Hydraulic Drives"],
  },
  {
    title: "Interiors",
    image: "/images/futuristic-glass-elevator-blue.png",
    description: "Elevate your space with luxurious flooring, elegant ceilings, and sophisticated custom LED lighting.",
    items: ["Custom Flooring", "Elegant Ceilings", "Integrated LED Lighting"],
  },
];

export default function CustomizationAdminPage() {
  const [items, setItems] = useState<CustomizationSetting[]>([]);
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
      const fetchedItems = data.customization || [];
      // Use default data if no data exists in Firestore
      setItems(fetchedItems.length > 0 ? fetchedItems : DEFAULT_CUSTOMIZATION_DATA);
      setIsLoading(false);
    });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { title: "", image: "", description: "", items: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof CustomizationSetting, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddSubItem = (index: number) => {
    const newItems = [...items];
    newItems[index].items.push("");
    setItems(newItems);
  };

  const handleSubItemChange = (itemIndex: number, subIndex: number, value: string) => {
    const newItems = [...items];
    newItems[itemIndex].items[subIndex] = value;
    setItems(newItems);
  };

  const handleRemoveSubItem = (itemIndex: number, subIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].items = newItems[itemIndex].items.filter((_, i) => i !== subIndex);
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateServicesPageSettings({ customization: items });
      setSuccessMessage("Customization components saved successfully! Changes are live on the website.");
    } catch (e) {
      setErrorMessage("Failed to save customization components. Please try again.");
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
            <PackagePlus className="text-purple-400" />
            Elevator Customization & Components
          </h1>
          <p className="text-sm text-slate-400">
            Manage Cabin Models, Door Options, Control Systems, Machinery, and Interiors.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#0070F3]" /></div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-[#0C1A2E] border border-white/10 rounded-2xl p-6 relative group">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-white font-semibold text-sm">Customization Category #{index + 1}</h3>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-xs font-semibold"
                    title="Remove Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Category Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => handleChange(index, "title", e.target.value)}
                        className="w-full px-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#0070F3] outline-none"
                        placeholder="e.g. Cabin Models"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Description</label>
                      <textarea
                        value={item.description}
                        onChange={e => handleChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-[#071221] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#0070F3] outline-none"
                        placeholder="Brief overview..."
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase">Bullet Points</label>
                        <button onClick={() => handleAddSubItem(index)} className="text-[#38BDF8] text-xs hover:underline flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add Point
                        </button>
                      </div>
                      <div className="space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <div key={subIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={subItem}
                              onChange={e => handleSubItemChange(index, subIndex, e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-[#071221] border border-white/10 rounded-lg text-sm text-white focus:ring-1 focus:ring-[#0070F3] outline-none"
                              placeholder="e.g. Premium Glass"
                            />
                            <button onClick={() => handleRemoveSubItem(index, subIndex)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      value={item.image}
                      onChange={(url) => handleChange(index, "image", url)}
                      folder="standard_elevators/customization"
                      label="Category Image"
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
              <span className="font-semibold text-sm">Add New Customization Category</span>
            </button>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
