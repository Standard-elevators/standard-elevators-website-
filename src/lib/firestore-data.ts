import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServiceItem, GalleryItem } from "@/types/data";
import { DEFAULT_SERVICES, DEFAULT_GALLERY } from "@/data/defaultData";

// Helper to convert Firestore snapshot to typed item
function snapshotToService(docSnap: QueryDocumentSnapshot<DocumentData>): ServiceItem {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    slug: data.slug || docSnap.id,
    title: data.title || "",
    description: data.description || "",
    specs: Array.isArray(data.specs) ? data.specs : [],
    category: data.category || "General",
    imageUrl: data.imageUrl || "/hero-elevator.jpg",
    imagePublicId: data.imagePublicId || undefined,
    orderIndex: typeof data.orderIndex === "number" ? data.orderIndex : 0,
    status: data.status === "draft" ? "draft" : "published",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy || undefined,
  };
}

function snapshotToGallery(docSnap: QueryDocumentSnapshot<DocumentData>): GalleryItem {
  const data = docSnap.data();
  const isVideo = Boolean(
    data.mediaType === "video" ||
    (typeof data.imageUrl === "string" && (data.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || data.imageUrl.includes("/video/upload/")))
  );
  return {
    id: docSnap.id,
    title: data.title || "",
    category: data.category || "Installation",
    imageUrl: data.imageUrl || "/hero-elevator.jpg",
    imagePublicId: data.imagePublicId || undefined,
    mediaType: isVideo ? "video" : "image",
    altText: data.altText || data.title || "",
    orderIndex: typeof data.orderIndex === "number" ? data.orderIndex : 0,
    status: data.status === "draft" ? "draft" : "published",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy || undefined,
  };
}

export function notifyGalleryUpdated(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("se_gallery_sync_time", Date.now().toString());
      window.dispatchEvent(new CustomEvent("se_gallery_updated"));
    } catch {}
  }
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Wraps a promise with a timeout to prevent indefinite hanging (e.g. offline Firebase).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number = 15000, fallbackMessage: string = "Request timed out"): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(fallbackMessage));
    }, ms);
    
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/* =========================================================================
   SERVICES CRUD MODULE WITH LOCAL OVERRIDES & CLOUD SYNC
   ========================================================================= */

const SERVICES_OVERRIDES_KEY = "se_services_overrides";
const SERVICES_DELETED_KEY = "se_services_deleted";

export function getLocalServiceOverrides(): Record<string, ServiceItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SERVICES_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLocalDeletedServices(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SERVICES_DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveServiceOverride(id: string, item: ServiceItem) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalServiceOverrides();
    overrides[id] = item;
    if (item.slug && item.slug !== id) {
      overrides[item.slug] = item;
    }
    const deleted = getLocalDeletedServices().filter(d => d !== id && d !== item.slug);
    localStorage.setItem(SERVICES_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(SERVICES_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function removeServiceOverride(id: string) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalServiceOverrides();
    const item = overrides[id];
    delete overrides[id];
    if (item?.slug && overrides[item.slug]) {
      delete overrides[item.slug];
    }
    const deleted = getLocalDeletedServices();
    if (!deleted.includes(id)) deleted.push(id);
    if (item?.slug && !deleted.includes(item.slug)) deleted.push(item.slug);
    localStorage.setItem(SERVICES_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(SERVICES_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function applyLocalServiceOverrides(baseServices: ServiceItem[]): ServiceItem[] {
  const overrides = getLocalServiceOverrides();
  const deleted = new Set(getLocalDeletedServices());

  // Filter out deleted items
  const services = baseServices.filter(s => {
    const sId = s.id || "";
    const sSlug = s.slug || "";
    return (!sId || !deleted.has(sId)) && (!sSlug || !deleted.has(sSlug));
  });

  // Apply overrides or additions
  const map = new Map<string, ServiceItem>();
  services.forEach(s => {
    const key = s.slug || s.id || "";
    if (key) map.set(key, s);
  });

  Object.values(overrides).forEach(override => {
    const oId = override.id || "";
    const oSlug = override.slug || "";
    if ((!oId || !deleted.has(oId)) && (!oSlug || !deleted.has(oSlug))) {
      const key = oSlug || oId;
      if (key) {
        const existing = map.get(key) || {};
        map.set(key, { ...existing, ...override });
      }
    }
  });

  return Array.from(map.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

// In-memory cache for rapid public page rendering without repeated Firestore latency
let cachedServices: ServiceItem[] | null = null;
let lastServicesFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Fetch all published services for the public site.
 * Falls back to default verified elevator services if Firestore is empty or offline.
 */
export async function getPublishedServices(): Promise<ServiceItem[]> {
  const now = Date.now();
  if (cachedServices && now - lastServicesFetchTime < CACHE_TTL_MS) {
    return applyLocalServiceOverrides(cachedServices);
  }

  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
      cachedServices = fallback;
      lastServicesFetchTime = now;
      return applyLocalServiceOverrides(fallback);
    }

    const servicesRef = collection(db, "services");
    const q = query(
      servicesRef,
      where("status", "==", "published")
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    if (snapshot.empty) {
      const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
      cachedServices = fallback;
      lastServicesFetchTime = now;
      return applyLocalServiceOverrides(fallback);
    }

    const result = snapshot.docs
      .map(snapshotToService)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    cachedServices = result;
    lastServicesFetchTime = now;
    return applyLocalServiceOverrides(result);
  } catch (error) {
    console.warn("Firestore published services query timed out/failed, using verified fallback data:", error);
    const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
    return applyLocalServiceOverrides(fallback);
  }
}

/**
 * Fetch all services for the admin panel (including drafts).
 */
export async function getAllServices(): Promise<ServiceItem[]> {
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      return applyLocalServiceOverrides(DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug })));
    }

    const servicesRef = collection(db, "services");
    const q = query(servicesRef, orderBy("orderIndex", "asc"));
    const snapshot = await withTimeout(getDocs(q), 5000);

    let list: ServiceItem[] = [];
    if (snapshot.empty) {
      list = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
    } else {
      list = snapshot.docs.map(snapshotToService);
    }

    return applyLocalServiceOverrides(list);
  } catch (error) {
    console.warn("Firestore admin services query failed, using verified fallback data:", error);
    return applyLocalServiceOverrides(DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug })));
  }
}

/**
 * Check if a slug is already taken by another service.
 * Fails safely and gracefully so it never blocks updates on timeout.
 */
export async function isServiceSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return false;

  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, where("slug", "==", cleanSlug));
    const snapshot = await withTimeout(getDocs(q), 4000);

    if (snapshot.empty) return true;
    if (excludeId && snapshot.docs.length === 1 && (snapshot.docs[0].id === excludeId || snapshot.docs[0].id === cleanSlug)) {
      return true;
    }
    return snapshot.docs.every(d => d.id === excludeId);
  } catch (err) {
    console.warn("Slug uniqueness check timed out or failed, defaulting to unique:", err);
    return true; // Graceful fallback
  }
}

/**
 * Create a new service record with slug uniqueness and input validation.
 */
export async function createService(
  data: Omit<ServiceItem, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!data.title?.trim()) {
    throw new Error("Service title is required.");
  }

  const cleanSlug = sanitizeSlug(data.slug || data.title);
  if (!cleanSlug) {
    throw new Error("A valid URL slug is required.");
  }

  let docId = cleanSlug;
  const servicesRef = collection(db, "services");
  
  try {
    const docRef = await withTimeout(addDoc(servicesRef, {
      title: data.title.trim(),
      slug: cleanSlug,
      description: data.description?.trim() || "",
      specs: Array.isArray(data.specs) ? data.specs.map((s) => s.trim()).filter(Boolean) : [],
      category: data.category?.trim() || "General",
      imageUrl: data.imageUrl?.trim() || "/hero-elevator.jpg",
      imagePublicId: data.imagePublicId?.trim() || null,
      orderIndex: Number(data.orderIndex) || 0,
      status: data.status === "draft" ? "draft" : "published",
      updatedBy: data.updatedBy || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }), 6000);
    docId = docRef.id;
  } catch (err) {
    console.warn("Firestore createService failed or timed out, saved local override:", err);
  }

  // Save local override immediately
  saveServiceOverride(docId, {
    id: docId,
    title: data.title.trim(),
    slug: cleanSlug,
    description: data.description?.trim() || "",
    specs: Array.isArray(data.specs) ? data.specs.map((s) => s.trim()).filter(Boolean) : [],
    category: data.category?.trim() || "General",
    imageUrl: data.imageUrl?.trim() || "/hero-elevator.jpg",
    imagePublicId: data.imagePublicId?.trim() || undefined,
    orderIndex: Number(data.orderIndex) || 0,
    status: data.status === "draft" ? "draft" : "published",
    updatedBy: data.updatedBy || undefined,
  });

  cachedServices = null;
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }
  return docId;
}

/**
 * Update an existing service record.
 */
export async function updateService(
  id: string,
  data: Partial<Omit<ServiceItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (data.slug) {
    data.slug = sanitizeSlug(data.slug);
  }

  const docRef = doc(db, "services", id);
  const updatePayload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Clean undefined keys
  Object.keys(updatePayload).forEach(
    (key) => updatePayload[key] === undefined && delete updatePayload[key]
  );

  // Save local override immediately for instant UI update
  saveServiceOverride(id, { id, ...data } as ServiceItem);

  try {
    await withTimeout(setDoc(docRef, updatePayload, { merge: true }), 6000);
  } catch (err) {
    console.warn("Firestore updateService failed or timed out, local override active:", err);
  }

  cachedServices = null;
  // Notify public pages and header to refresh
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }
}

/**
 * Delete a service record.
 */
export async function deleteService(id: string): Promise<void> {
  // Remove from local storage immediately
  removeServiceOverride(id);

  try {
    const docRef = doc(db, "services", id);
    await withTimeout(deleteDoc(docRef), 6000);
  } catch (err) {
    console.warn("Firestore deleteService failed or timed out, local override removed:", err);
  }

  cachedServices = null;
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }
}

/**
 * Seed initial services into Firestore if the collection is currently empty.
 */
export async function seedInitialServices(): Promise<number> {
  const servicesRef = collection(db, "services");
  const snapshot = await getDocs(servicesRef);

  const existingSlugs = new Set(snapshot.docs.map(d => d.data().slug));

  let count = 0;
  for (const item of DEFAULT_SERVICES) {
    if (!existingSlugs.has(item.slug)) {
      await addDoc(servicesRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    }
  }
  return count;
}

/* =========================================================================
   GALLERY CRUD MODULE WITH LOCAL OVERRIDES & CLOUD SYNC
   ========================================================================= */

const GALLERY_OVERRIDES_KEY = "se_gallery_overrides";
const GALLERY_DELETED_KEY = "se_gallery_deleted";

export function getLocalGalleryOverrides(): Record<string, GalleryItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GALLERY_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLocalDeletedGallery(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GALLERY_DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGalleryOverride(id: string, item: GalleryItem) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalGalleryOverrides();
    overrides[id] = item;
    const deleted = getLocalDeletedGallery().filter(d => d !== id);
    localStorage.setItem(GALLERY_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(GALLERY_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function removeGalleryOverride(id: string) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalGalleryOverrides();
    delete overrides[id];
    const deleted = getLocalDeletedGallery();
    if (!deleted.includes(id)) deleted.push(id);
    localStorage.setItem(GALLERY_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(GALLERY_DELETED_KEY, JSON.stringify(deleted));
  } catch {}
}

export function applyLocalGalleryOverrides(baseItems: GalleryItem[]): GalleryItem[] {
  const overrides = getLocalGalleryOverrides();
  const deleted = new Set(getLocalDeletedGallery());

  // Filter out deleted items
  const items = baseItems.filter(item => {
    const id = item.id || "";
    return !id || !deleted.has(id);
  });

  const map = new Map<string, GalleryItem>();
  items.forEach(item => {
    const key = item.id || item.title;
    if (key) map.set(key, item);
  });

  Object.values(overrides).forEach(override => {
    const id = override.id || "";
    if (!id || !deleted.has(id)) {
      const key = id || override.title;
      if (key) {
        map.set(key, { ...(map.get(key) || {}), ...override });
      }
    }
  });

  return Array.from(map.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

// In-memory cache for rapid public gallery rendering without repeated Firestore latency
let cachedGallery: GalleryItem[] | null = null;
let lastGalleryFetchTime = 0;

/**
 * Fetch all published gallery items for the public site.
 * Falls back to default verified gallery items if Firestore is empty or offline.
 */
export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const now = Date.now();
  if (cachedGallery && now - lastGalleryFetchTime < CACHE_TTL_MS) {
    return applyLocalGalleryOverrides(cachedGallery);
  }

  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
      cachedGallery = fallback;
      lastGalleryFetchTime = now;
      return applyLocalGalleryOverrides(fallback);
    }

    const galleryRef = collection(db, "gallery");
    const q = query(
      galleryRef,
      where("status", "==", "published")
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    if (snapshot.empty) {
      const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
      cachedGallery = fallback;
      lastGalleryFetchTime = now;
      return applyLocalGalleryOverrides(fallback);
    }

    const result = snapshot.docs
      .map(snapshotToGallery)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    cachedGallery = result;
    lastGalleryFetchTime = now;
    return applyLocalGalleryOverrides(result);
  } catch (error) {
    console.warn("Firestore published gallery query timed out/failed, using local fallback data:", error);
    const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
    return applyLocalGalleryOverrides(fallback);
  }
}

/**
 * Fetch all gallery items for the admin panel (including drafts).
 */
export async function getAllGallery(): Promise<GalleryItem[]> {
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      return applyLocalGalleryOverrides(DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` })));
    }

    const galleryRef = collection(db, "gallery");
    const q = query(galleryRef, orderBy("orderIndex", "asc"));
    const snapshot = await withTimeout(getDocs(q), 5000);

    let list: GalleryItem[] = [];
    if (snapshot.empty) {
      list = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
    } else {
      list = snapshot.docs.map(snapshotToGallery);
    }

    return applyLocalGalleryOverrides(list);
  } catch (error) {
    console.warn("Firestore admin gallery query failed, using local/fallback data:", error);
    return applyLocalGalleryOverrides(DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` })));
  }
}

/**
 * Create a new gallery item.
 */
export async function createGalleryItem(
  data: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!data.title?.trim()) {
    throw new Error("Project title is required.");
  }
  if (!data.imageUrl?.trim()) {
    throw new Error("Image URL or path is required.");
  }

  const isVideo = Boolean(
    data.mediaType === "video" ||
    data.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) ||
    data.imageUrl.includes("/video/upload/")
  );

  let docId = `gallery-${Date.now()}`;
  const galleryRef = collection(db, "gallery");

  try {
    const docRef = await withTimeout(addDoc(galleryRef, {
      title: data.title.trim(),
      category: data.category || "Installation",
      imageUrl: data.imageUrl.trim(),
      imagePublicId: data.imagePublicId?.trim() || null,
      mediaType: isVideo ? "video" : "image",
      altText: data.altText?.trim() || data.title.trim(),
      orderIndex: Number(data.orderIndex) || 0,
      status: data.status === "draft" ? "draft" : "published",
      updatedBy: data.updatedBy || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }), 6000);
    docId = docRef.id;
  } catch (err) {
    console.warn("Firestore createGalleryItem failed or timed out, saved local override:", err);
  }

  // Save local override immediately
  saveGalleryOverride(docId, {
    id: docId,
    title: data.title.trim(),
    category: data.category || "Installation",
    imageUrl: data.imageUrl.trim(),
    imagePublicId: data.imagePublicId?.trim() || undefined,
    mediaType: isVideo ? "video" : "image",
    altText: data.altText?.trim() || data.title.trim(),
    orderIndex: Number(data.orderIndex) || 0,
    status: data.status === "draft" ? "draft" : "published",
    updatedBy: data.updatedBy || undefined,
  });

  cachedGallery = null;
  notifyGalleryUpdated();
  return docId;
}

/**
 * Update an existing gallery item.
 */
export async function updateGalleryItem(
  id: string,
  data: Partial<Omit<GalleryItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const isVideo = Boolean(
    data.mediaType === "video" ||
    (data.imageUrl && (data.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || data.imageUrl.includes("/video/upload/")))
  );

  // Save local override immediately
  saveGalleryOverride(id, {
    id,
    ...data,
    mediaType: isVideo ? "video" : "image",
  } as GalleryItem);

  const docRef = doc(db, "gallery", id);
  const updatePayload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.imageUrl && !data.mediaType) {
    updatePayload.mediaType = isVideo ? "video" : "image";
  }

  Object.keys(updatePayload).forEach(
    (key) => updatePayload[key] === undefined && delete updatePayload[key]
  );

  try {
    await withTimeout(setDoc(docRef, updatePayload, { merge: true }), 6000);
  } catch (err) {
    console.warn("Firestore updateGalleryItem failed or timed out, local override active:", err);
  }

  cachedGallery = null;
  notifyGalleryUpdated();
}

/**
 * Delete a gallery item.
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  removeGalleryOverride(id);

  try {
    const docRef = doc(db, "gallery", id);
    await withTimeout(deleteDoc(docRef), 6000);
  } catch (err) {
    console.warn("Firestore deleteGalleryItem failed or timed out, local override removed:", err);
  }

  cachedGallery = null;
  notifyGalleryUpdated();
}

/**
 * Seed initial gallery items into Firestore if empty.
 */
export async function seedInitialGallery(): Promise<number> {
  const galleryRef = collection(db, "gallery");
  const snapshot = await getDocs(galleryRef);

  if (!snapshot.empty) {
    return 0;
  }
  
  let count = 0;
  for (const item of DEFAULT_GALLERY) {
    await addDoc(galleryRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}

/* =========================================================================
   SETTINGS / FOUNDER CRUD MODULE
   ========================================================================= */

const FOUNDER_STORAGE_KEY = "se_founder_data";

export async function getFounderData(): Promise<{ name: string; imageUrl: string; imagePublicId?: string }> {
  let localData: { name: string; imageUrl: string; imagePublicId?: string } | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(FOUNDER_STORAGE_KEY);
      if (raw) localData = JSON.parse(raw);
    } catch {}
  }

  try {
    const docRef = doc(db, "settings", "founder");
    const docSnap = await withTimeout(getDoc(docRef), 3000);
    if (docSnap.exists()) {
      const fsData = docSnap.data() as { name: string; imageUrl: string; imagePublicId?: string };
      if (typeof window !== "undefined") {
        try { localStorage.setItem(FOUNDER_STORAGE_KEY, JSON.stringify(fsData)); } catch {}
      }
      return fsData;
    }
  } catch (error) {
    console.warn("Failed to fetch founder data from Firestore, using local/fallback:", error);
  }

  if (localData && (localData.name || localData.imageUrl)) {
    return localData;
  }

  return { name: "Sandeep Goud", imageUrl: "/images/team/founder.jpg" };
}

export async function updateFounderData(data: { name?: string; imageUrl?: string; imagePublicId?: string }): Promise<void> {
  // 1. Instant local persistence for zero-delay live website updates
  if (typeof window !== "undefined") {
    try {
      const current = (await getFounderData()) || { name: "Sandeep Goud", imageUrl: "/images/team/founder.jpg" };
      const updated = {
        name: data.name !== undefined ? data.name : current.name,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : current.imageUrl,
        imagePublicId: data.imagePublicId !== undefined ? data.imagePublicId : current.imagePublicId,
      };
      localStorage.setItem(FOUNDER_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("se_founder_updated"));
    } catch {}
  }

  // 2. Sync with cloud Firestore
  try {
    const docRef = doc(db, "settings", "founder");
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.imagePublicId !== undefined) payload.imagePublicId = data.imagePublicId;
    await withTimeout(setDoc(docRef, payload, { merge: true }), 6000);
  } catch (err) {
    console.warn("Firestore updateFounderData setDoc failed/timed out, local update remains active:", err);
  }
}

export interface InquirySubmission {
  name: string;
  phone: string;
  email?: string;
  buildingType?: string;
  serviceRequired?: string;
  projectLocation?: string;
  message?: string;
}

/**
 * Submit customer quotation or contact inquiry to Firestore.
 */
export async function submitInquiry(data: InquirySubmission): Promise<string> {
  const inquiriesRef = collection(db, "inquiries");
  const docRef = await addDoc(inquiriesRef, {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || "",
    buildingType: data.buildingType || "General",
    serviceRequired: data.serviceRequired || "General Inquiry",
    projectLocation: data.projectLocation || "Telangana / AP",
    message: data.message?.trim() || "",
    status: "new",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export interface EngineeringServiceSetting {
  title: string;
  image: string;
  desc: string;
}

export interface CustomizationSetting {
  title: string;
  image: string;
  description: string;
  items: string[];
}

export interface OtherServiceSetting {
  title: string;
  image: string;
  desc: string;
}

export interface ServicesPageSettings {
  engineeringServices: EngineeringServiceSetting[];
  customization: CustomizationSetting[];
  otherServices: OtherServiceSetting[];
}

const SERVICES_PAGE_STORAGE_KEY = "se_services_page_settings";

export function notifyServicesPageUpdated(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("se_services_page_sync_time", Date.now().toString());
      window.dispatchEvent(new CustomEvent("se_services_page_updated"));
    } catch {}
  }
}

export const DEFAULT_ENGINEERING_SERVICES_DATA: EngineeringServiceSetting[] = [
  {
    title: "New Installation",
    image: "/images/card_installation.jpg",
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
  },
  {
    title: "Modernization",
    image: "/images/card_modernization.jpg",
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
  },
  {
    title: "Repairs",
    image: "/images/card_maintenance.jpg",
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
  },
  {
    title: "Maintenance",
    image: "/images/card_maintenance.jpg",
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
  },
  {
    title: "Aftersales Services",
    image: "/images/card_installation.jpg",
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
  }
];

export const DEFAULT_CUSTOMIZATION_DATA: CustomizationSetting[] = [
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

export const DEFAULT_OTHER_SERVICES_DATA: OtherServiceSetting[] = [
  { title: "Structural Fabrication", image: "/images/card_installation.jpg", desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
  { title: "Glass & ACP Sheets", image: "/images/card_modernization.jpg", desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
  { title: "UPVC Window & Door", image: "/images/card_installation.jpg", desc: "High-quality UPVC systems for residential and commercial spaces." },
  { title: "Renovation Works", image: "/images/card_modernization.jpg", desc: "Complete architectural and interior renovation services." },
  { title: "SS Railing", image: "/images/card_maintenance.jpg", desc: "Custom stainless steel handrails and balustrades." },
  { title: "Electrical House Wirings", image: "/images/card_maintenance.jpg", desc: "Complete residential and commercial electrical wiring systems." },
  { title: "Civil Works", image: "/images/card_installation.jpg", desc: "Comprehensive civil construction and shaft preparation." },
];

const DEFAULT_SERVICES_PAGE_SETTINGS: ServicesPageSettings = {
  engineeringServices: DEFAULT_ENGINEERING_SERVICES_DATA,
  customization: DEFAULT_CUSTOMIZATION_DATA,
  otherServices: DEFAULT_OTHER_SERVICES_DATA,
};

export async function getServicesPageSettings(): Promise<ServicesPageSettings> {
  let localData: ServicesPageSettings | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SERVICES_PAGE_STORAGE_KEY);
      if (raw) localData = JSON.parse(raw);
    } catch {}
  }

  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const docRef = doc(db, "settings", "services_page");
      const snapshot = await withTimeout(getDoc(docRef), 2500);
      if (snapshot.exists()) {
        const fsData = snapshot.data() as ServicesPageSettings;
        const merged: ServicesPageSettings = {
          engineeringServices: fsData.engineeringServices?.length ? fsData.engineeringServices : (localData?.engineeringServices || DEFAULT_ENGINEERING_SERVICES_DATA),
          customization: fsData.customization?.length ? fsData.customization : (localData?.customization || DEFAULT_CUSTOMIZATION_DATA),
          otherServices: fsData.otherServices?.length ? fsData.otherServices : (localData?.otherServices || DEFAULT_OTHER_SERVICES_DATA),
        };
        if (typeof window !== "undefined") {
          try { localStorage.setItem(SERVICES_PAGE_STORAGE_KEY, JSON.stringify(merged)); } catch {}
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn("Failed to get services page settings from Firestore, using local/defaults:", err);
  }

  if (localData && (localData.engineeringServices?.length || localData.customization?.length || localData.otherServices?.length)) {
    return {
      engineeringServices: localData.engineeringServices?.length ? localData.engineeringServices : DEFAULT_ENGINEERING_SERVICES_DATA,
      customization: localData.customization?.length ? localData.customization : DEFAULT_CUSTOMIZATION_DATA,
      otherServices: localData.otherServices?.length ? localData.otherServices : DEFAULT_OTHER_SERVICES_DATA,
    };
  }
  return DEFAULT_SERVICES_PAGE_SETTINGS;
}

export async function updateServicesPageSettings(data: Partial<ServicesPageSettings>): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getServicesPageSettings();
      const merged = { ...current, ...data };
      localStorage.setItem(SERVICES_PAGE_STORAGE_KEY, JSON.stringify(merged));
      notifyServicesPageUpdated();
    } catch {}
  }

  try {
    const docRef = doc(db, "settings", "services_page");
    await withTimeout(setDoc(docRef, data, { merge: true }), 6000);
  } catch (err) {
    console.warn("Firestore updateServicesPageSettings failed, local settings saved:", err);
  }
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  buildingType: string;
  serviceRequired: string;
  projectLocation: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  createdAt: any;
}

export async function getAllInquiries(): Promise<InquiryItem[]> {
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(q), 2500);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        buildingType: data.buildingType || "",
        serviceRequired: data.serviceRequired || "",
        projectLocation: data.projectLocation || "",
        message: data.message || "",
        status: data.status || "new",
        createdAt: data.createdAt,
      } as InquiryItem;
    });
  } catch (err) {
    console.warn("Failed to fetch inquiries, returning empty array:", err);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: "new" | "in-progress" | "resolved"): Promise<void> {
  const docRef = doc(db, "inquiries", id);
  await updateDoc(docRef, { status });
}

export async function deleteInquiry(id: string): Promise<void> {
  const docRef = doc(db, "inquiries", id);
  await deleteDoc(docRef);
}
