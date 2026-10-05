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

/**
 * Validate image file on client side before network transmission
 */
export function validateImageFile(
  file: File | Blob,
  maxSizeBytes: number = 10 * 1024 * 1024,
  allowedMimes: string[] = ["image/jpeg", "image/png", "image/webp", "image/avif"]
): { valid: boolean; error?: string } {
  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const limitMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of ${limitMb} MB.`,
    };
  }

  if (file.type && !allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type}). Allowed formats: JPG, PNG, WebP, AVIF.`,
    };
  }

  return { valid: true };
}

/**
 * Upload an image using Server-Signed Authentication when credentials exist,
 * with fallback to Unsigned Upload preset.
 */
export async function uploadImageToCloudinary(
  file: File | Blob,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const maxBytes = options.maxFileSizeBytes || 10 * 1024 * 1024;
  const validation = validateImageFile(file, maxBytes, options.allowedMimeTypes);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cloudName = cloudinaryConfig.cloudName;
  const folder = options.folder || "standard_elevators";

  // 1. Attempt Server-Signed Upload if an authenticated ID token is provided
  if (options.idToken) {
    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder }),
      });

      if (signRes.ok) {
        const signData = await signRes.json();
        // Upload using signed credentials from server
        return await uploadWithFormData(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
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
    } catch {
      // If server signing call fails, proceed to test unsigned upload
    }
  }

  // 2. Unsigned Upload Fallback
  if (!cloudinaryConfig.uploadPreset) {
    throw new Error(
      "Cloudinary upload preset is not configured in NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, and server signing credentials (CLOUDINARY_API_SECRET) are not set."
    );
  }

  try {
    return await uploadWithFormData(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        file,
        upload_preset: cloudinaryConfig.uploadPreset,
        folder,
      },
      options.onProgress
    );
  } catch (err) {
    const errorMsg = (err as Error).message || "";
    if (errorMsg.includes("must be whitelisted for unsigned uploads")) {
      throw new Error(
        `Cloudinary Preset "${cloudinaryConfig.uploadPreset}" is not configured for unsigned uploads. Either provide CLOUDINARY_API_SECRET in .env.local for server-signed uploads, or enable unsigned uploads in the Cloudinary Console.`
      );
    }
    throw err;
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
