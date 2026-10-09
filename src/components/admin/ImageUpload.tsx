"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { uploadImageToCloudinary, validateMediaFile } from "@/lib/cloudinary";
import {
  UploadCloud,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileImage,
  Video,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

interface ImageUploadProps {
  value: string; // Current media URL
  publicId?: string; // Current Cloudinary public ID
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  maxSizeBytes?: number; // Default 10MB
  label?: string;
  allowVideo?: boolean;
  onMediaTypeChange?: (type: "image" | "video") => void;
  onFileSelected?: (file: File) => void;
}

export default function ImageUpload({
  value,
  publicId,
  onChange,
  folder = "standard_elevators",
  maxSizeBytes = 10 * 1024 * 1024,
  label = "Visual Asset",
  allowVideo = false,
  onMediaTypeChange,
  onFileSelected,
}: ImageUploadProps) {
  const { user } = useAdminAuth();

  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [prevValue, setPrevValue] = useState<string>(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isManualUrlMode, setIsManualUrlMode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal preview if value changes externally (e.g. editing a different item)
  if (prevValue !== value) {
    setPrevValue(value);
    setPreviewUrl(value);
  }

  // Detect whether the current asset is a video
  const isVideo = Boolean(
    (selectedFile && selectedFile.type?.startsWith("video/")) ||
    (previewUrl && (previewUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || previewUrl.includes("/video/upload/")))
  );

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    const validation = validateMediaFile(file, maxSizeBytes);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file format or size.");
      return;
    }

    if (!allowVideo && validation.isVideo) {
      setUploadError("Video uploads are not allowed in this field.");
      return;
    }

    setSelectedFile(file);
    onFileSelected?.(file);
    if (validation.isVideo) {
      onMediaTypeChange?.("video");
    } else {
      onMediaTypeChange?.("image");
    }

    // Create local object URL for instant preview before upload finishes
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Automatically trigger upload
    startUpload(file);
  };

  const startUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Get Firebase Auth token for authenticated server-signed upload
      const idToken = user ? await user.getIdToken() : undefined;

      const result = await uploadImageToCloudinary(fileToUpload, {
        folder,
        idToken,
        maxFileSizeBytes: maxSizeBytes,
        onProgress: (percent) => setUploadProgress(percent),
      });

      // Upload succeeded: update preview and trigger parent onChange with new URL & publicId
      setPreviewUrl(result.secure_url);
      onChange(result.secure_url, result.public_id);
      setSelectedFile(null);
      setUploadProgress(100);
    } catch (err) {
      const msg = (err as Error).message || "Upload failed.";
      setUploadError(msg);
      // Revert preview back to original value on failure
      setPreviewUrl(value);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadError(null);
    setUploadProgress(0);
    onChange("", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      startUpload(selectedFile);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Label & URL toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsManualUrlMode(!isManualUrlMode)}
          className="inline-flex items-center gap-1 text-[11px] text-[#38BDF8] hover:underline"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{isManualUrlMode ? "Upload File (Cloudinary)" : "Enter URL Manually"}</span>
        </button>
      </div>

      {/* Manual URL Input Mode */}
      {isManualUrlMode ? (
        <div className="space-y-2">
          <input
            type="text"
            value={previewUrl}
            onChange={(e) => {
              const val = e.target.value;
              setPreviewUrl(val);
              const isVid = Boolean(val.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || val.includes("/video/upload/"));
              if (isVid) onMediaTypeChange?.("video");
              else if (val) onMediaTypeChange?.("image");
              onChange(val, undefined);
            }}
            placeholder="https://res.cloudinary.com/... or /hero-elevator.jpg"
            className="w-full px-3.5 py-2.5 bg-[#071221] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0070F3]"
          />
          <span className="text-[10px] text-slate-500 block">
            Manual paths (e.g. /videos/gallery.mp4) or full Cloudinary CDN links are accepted.
          </span>
        </div>
      ) : (
        /* Cloudinary File Upload Dropzone & Preview */
        <div>
          {previewUrl ? (
            /* Active Media Preview Card */
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#071221] p-3 shadow-lg">
              <div className="w-full h-48 sm:h-56 relative rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Asset Preview"
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-contain"
                  />
                )}

                {/* Uploading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20">
                    <Loader2 className="w-8 h-8 text-[#0070F3] animate-spin mb-3" />
                    <span className="text-xs font-semibold text-white mb-2">
                      Uploading to Cloudinary ({uploadProgress}%)
                    </span>
                    <div className="w-48 bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0070F3] h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Below Preview */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate max-w-[200px] text-slate-400">
                  {isVideo ? (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <Video className="w-3 h-3" /> VIDEO
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate font-mono text-[11px]" title={previewUrl}>
                    {publicId ? `Asset: ${publicId}` : previewUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone Container */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragging
                  ? "border-[#0070F3] bg-[#0070F3]/10"
                  : "border-white/15 bg-[#071221] hover:border-[#0070F3]/50 hover:bg-white/[0.02]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#0070F3]/10 border border-[#0070F3]/20 flex items-center justify-center text-[#38BDF8] mb-3">
                {allowVideo ? <Video className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              <span className="text-sm font-semibold text-white mb-1">
                {allowVideo ? "Click to upload an image or video" : "Click to upload or drag & drop"}
              </span>

              <span className="text-xs text-slate-400 mb-2">
                {allowVideo
                  ? "Supports JPG, PNG, WebP, AVIF, or MP4/WebM videos"
                  : "Supports JPG, PNG, WebP, AVIF"}
              </span>

              <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-emerald-400">
                Max 10 MB file size limit
              </span>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={allowVideo ? "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {/* Error Message */}
          {uploadError && (
            <div className="mt-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{uploadError}</p>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-1 text-[11px] underline hover:text-white"
                  >
                    Retry upload
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
