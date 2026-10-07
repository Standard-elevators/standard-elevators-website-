"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  UploadCloud,
  Save,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Crop,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function LeadershipAdminPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>("/images/team/founder.jpg");
  const [founderName, setFounderName] = useState("Founder");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Force cache bust to show latest image on load
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    fetch("/data/founder.json?" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) setFounderName(data.name);
      })
      .catch(() => console.log("No existing founder name found, using default."));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      setSelectedImage(URL.createObjectURL(file));
      setStatus({ type: null, msg: "" });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage("/images/owner/owner-placeholder.svg");
    setFileToUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus({ type: null, msg: "" });
  };

  const handleSave = async () => {
    setIsUploading(true);
    setStatus({ type: null, msg: "" });
    
    try {
      const formData = new FormData();
      if (fileToUpload) formData.append("image", fileToUpload);
      formData.append("name", founderName);

      const res = await fetch("/api/upload-leadership", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      setStatus({ type: "success", msg: "Leadership profile image updated successfully!" });
      setImageKey(Date.now()); // refresh cache
      setFileToUpload(null);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to upload image. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050C17] text-white p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-[#0062FF]" />
              Leadership Profile Management
            </h1>
            <p className="text-slate-400">
              Upload, replace, and preview the founder image and name exactly as it appears on the live website.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Control Panel */}
            <div className="lg:col-span-5 bg-[#0C1A2E] rounded-2xl border border-white/10 p-6 flex flex-col h-fit shadow-xl">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Crop className="w-5 h-5 text-[#38BDF8]" />
                Image Controls
              </h2>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-4 font-semibold transition-all active:scale-[0.98]"
                >
                  <UploadCloud className="w-5 h-5" />
                  {selectedImage && selectedImage !== "/images/owner/owner-placeholder.svg" ? "Replace Image" : "Upload Image"}
                </button>

                <button
                  onClick={handleRemoveImage}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-3 font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Current Image
                </button>
              </div>

              <div className="mb-8">
                <label htmlFor="founderName" className="block text-sm font-bold text-slate-300 mb-2">
                  Founder Name
                </label>
                <input
                  id="founderName"
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="e.g. Founder"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                />
              </div>

              {/* Status Message */}
              {status.type && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p className="text-sm font-medium">{status.msg}</p>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={isUploading || (!fileToUpload && !founderName)}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all shadow-lg ${
                    isUploading || (!fileToUpload && !founderName)
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white hover:shadow-[0_0_20px_rgba(0,98,255,0.4)] active:scale-95"
                  }`}
                >
                  {isUploading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isUploading ? "Publishing to Live Site..." : "Save & Publish"}
                </button>
              </div>
            </div>

            {/* Live Preview Pane */}
            <div className="lg:col-span-7 bg-[#050D1A] rounded-2xl border border-white/10 p-8 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 text-xs px-3 py-1.5 rounded-full text-slate-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Website Preview
              </div>

              {/* EXACT SAME UI FROM AboutView.tsx */}
              <div className="relative w-full max-w-[400px] p-[2px] rounded-[28px] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(8,119,249,0.25)] mt-6">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E2D40] to-[#0A162B] transition-opacity duration-700 group-hover:opacity-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_60%,#0062FF_80%,#38BDF8_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-700" />
                
                <div className="relative w-full h-full bg-[#050D1A]/95 backdrop-blur-3xl rounded-[26px] overflow-hidden flex flex-col items-center">
                  <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-[#0A162B]">
                    {selectedImage && (
                      <Image
                        src={`${selectedImage}?key=${imageKey}`}
                        alt="Founder Preview"
                        fill
                        unoptimized={true}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-[center_40%] transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-transparent opacity-90 pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-[26px] pointer-events-none" />
                  </div>

                  <div className="relative w-full px-6 py-8 flex flex-col items-center text-center -mt-8 z-10">
                    <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#28B8FF]/30 to-transparent" />
                    <h4 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-2 drop-shadow-sm group-hover:text-[#38BDF8] transition-colors duration-500">
                      {founderName || "Founder"}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#38BDF8] uppercase mb-4">
                      Standard Engineering Works
                    </span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#28B8FF]/50 to-transparent rounded-full mb-4" />
                    <p className="text-[13px] text-slate-400 font-light leading-relaxed tracking-wide">
                      Leading with precision & vision
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-8 text-center max-w-sm">
                This preview precisely shows how the uploaded image will be cropped and displayed within the luxury frame on the main About page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
