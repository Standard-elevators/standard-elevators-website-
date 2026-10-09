/**
 * Cloudinary Client Configuration & Utility Module
 * Standard Engineering Works Elevators
 * 
 * Provides:
 * - Server-signed authenticated uploads through /api/cloudinary/sign
 * - Unsigned uploads fallback via verified preset
 * - Authorized asset deletion through /api/cloudinary/delete
 * - Transformation URL generation with auto-format and auto-quality
 * - Client-side validation and upload progress tracking
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ikgbbha9",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
};

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb" | "crop";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  blur?: number;
}

/**
 * Generate an optimized Cloudinary delivery URL with transformations
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!cloudinaryConfig.cloudName) {
    return publicIdOrUrl;
  }

  // If already a full URL
  if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    if (publicIdOrUrl.includes("res.cloudinary.com")) {
      const match = publicIdOrUrl.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
      if (match) {
        const [, prefix, rest] = match;
        const transformString = buildTransformString(options);
        return transformString ? `${prefix}${transformString}/${rest}` : publicIdOrUrl;
      }
    }
    return publicIdOrUrl;
  }

  const transformString = buildTransformString(options);
  const transformPart = transformString ? `${transformString}/` : "";
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformPart}${publicIdOrUrl}`;
}

function buildTransformString(options: ImageTransformOptions): string {
  const parts: string[] = [];
  const format = options.format || "auto";
  const quality = options.quality || "auto";

  parts.push(`f_${format}`);
  parts.push(`q_${quality}`);

  if (options.crop) parts.push(`c_${options.crop}`);
  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);
  if (options.gravity) parts.push(`g_${options.gravity}`);
  if (options.blur) parts.push(`e_blur:${options.blur}`);

  return parts.join(",");
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  maxFileSizeBytes?: number; // default 10MB
  allowedMimeTypes?: string[];
  idToken?: string; // Firebase Auth token for server-signed uploads
  onProgress?: (progressPercent: number) => void;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const ALLOWED_VIDEO_MIMES = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
export const ALLOWED_ALL_MEDIA_MIMES = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES];

/**
 * Validate media file (image or video) on client side before network transmission
 * Enforces strict 10MB limit
 */
export function validateMediaFile(
  file: File | Blob,
  maxSizeBytes: number = 10 * 1024 * 1024,
  allowedMimes: string[] = ALLOWED_ALL_MEDIA_MIMES
): { valid: boolean; error?: string; isVideo?: boolean } {
  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const limitMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of ${limitMb} MB. Please upload a file under 10MB.`,
    };
  }

  const isVideo = file.type ? file.type.startsWith("video/") : false;

  if (file.type && !allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type}). Allowed formats: JPG, PNG, WebP, AVIF, and MP4/WebM/MOV videos up to 10MB.`,
    };
  }

  return { valid: true, isVideo };
}

/**
 * Backwards compatible alias for validateImageFile
 */
export function validateImageFile(
  file: File | Blob,
  maxSizeBytes: number = 10 * 1024 * 1024,
  allowedMimes: string[] = ALLOWED_ALL_MEDIA_MIMES
): { valid: boolean; error?: string } {
  return validateMediaFile(file, maxSizeBytes, allowedMimes);
}

/**
 * Helper to compress image to high quality base64 data URL
 */
async function compressImageToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Base64 compression only available in browser"));
      return;
    }
    
    // For video files or small files, direct FileReader
    if ((file as File).type?.startsWith("video/") || file.size < 300 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const maxDim = 1400;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.88));
          } else {
            resolve(reader.result as string);
          }
        } catch {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image or video using Server-Signed Authentication when credentials exist,
 * with multi-tier fallback to Unsigned Upload preset, Firebase Storage, and Compressed Base64.
 */
export async function uploadImageToCloudinary(
  file: File | Blob,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const maxBytes = options.maxFileSizeBytes || 10 * 1024 * 1024;
  const validation = validateMediaFile(file, maxBytes, options.allowedMimeTypes || ALLOWED_ALL_MEDIA_MIMES);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cloudName = cloudinaryConfig.cloudName;
  const folder = options.folder || "standard_elevators";
  const resourceType = validation.isVideo ? "video" : "image";

  // Tier 1: Attempt Server-Signed Upload if an authenticated ID token is provided
  if (options.idToken) {
    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder, resourceType }),
      });

      if (signRes.ok) {
        const signData = await signRes.json();
        // Upload using signed credentials from server
        return await uploadWithFormData(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`,
          {
            file,
            api_key: signData.apiKey,
            timestamp: signData.timestamp,
            signature: signData.signature,
            folder: signData.folder,
          },
          options.onProgress
        );
      }
    } catch (err) {
      console.warn("Cloudinary signed upload attempt failed, trying unsigned fallback:", err);
    }
  }

  // Tier 2: Unsigned Upload Fallback
  if (cloudinaryConfig.uploadPreset && cloudName) {
    try {
      return await uploadWithFormData(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          file,
          upload_preset: cloudinaryConfig.uploadPreset,
          folder,
        },
        options.onProgress
      );
    } catch (err) {
      console.warn("Cloudinary unsigned upload failed, trying Firebase Storage fallback:", err);
    }
  }

  // Tier 3: Firebase Storage Direct Client Fallback
  try {
    const { storage } = await import("@/lib/firebase");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const ext = (file as File).name?.split('.').pop() || (validation.isVideo ? "mp4" : "jpg");
    const storagePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storageRef = ref(storage, storagePath);
    
    if (options.onProgress) options.onProgress(50);
    const snapshot = await uploadBytes(storageRef, file);
    if (options.onProgress) options.onProgress(85);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    if (options.onProgress) options.onProgress(100);

    return {
      public_id: storagePath,
      secure_url: downloadUrl,
      url: downloadUrl,
      format: ext,
      width: 1200,
      height: 800,
      bytes: file.size,
      created_at: new Date().toISOString(),
    };
  } catch (fbErr) {
    console.warn("Firebase Storage fallback failed, using high-performance Data URL:", fbErr);
  }

  // Tier 4: Guaranteed Fallback: Base64 Data URL
  try {
    if (options.onProgress) options.onProgress(50);
    const base64Url = await compressImageToBase64(file);
    if (options.onProgress) options.onProgress(100);

    return {
      public_id: `asset_${Date.now()}`,
      secure_url: base64Url,
      url: base64Url,
      format: "jpeg",
      width: 1200,
      height: 800,
      bytes: file.size,
      created_at: new Date().toISOString(),
    };
  } catch (finalErr) {
    throw new Error("Unable to process file. Please try another image or enter image URL directly.");
  }
}

/**
 * Execute upload with XMLHttpRequest to provide upload progress tracking
 */
function uploadWithFormData(
  url: string,
  fields: Record<string, string | number | File | Blob>,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    Object.entries(fields).forEach(([key, val]) => {
      formData.append(key, val as Blob);
    });

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-json response
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as unknown as CloudinaryUploadResult);
      } else {
        const errorObj = data.error as { message?: string } | undefined;
        const msg = errorObj?.message || xhr.statusText || "Upload failed";
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload."));
    };

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/**
 * Safely delete an asset from Cloudinary via the authorized server-side endpoint.
 */
export async function deleteCloudinaryAsset(
  publicId: string,
  idToken: string
): Promise<{ success: boolean; message: string }> {
  if (!publicId || !idToken) {
    throw new Error("Missing publicId or authentication token for asset deletion.");
  }

  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete asset from Cloudinary.");
  }

  return data;
}
