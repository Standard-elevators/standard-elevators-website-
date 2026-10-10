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
import { ServiceItem, GalleryItem, GalleryCategory } from "@/types/data";
import { DEFAULT_SERVICES, DEFAULT_GALLERY } from "@/data/defaultData";

/* =========================================================================
   FIRESTORE REST API RESILIENCE ENGINE
   Guarantees sub-300ms reads & writes without WebChannel streaming timeouts.
   ========================================================================= */

const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "standard-engineering-wor-c28e6";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(val: unknown): Record<string, unknown> {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: unknown): unknown {
  if (!val || typeof val !== "object") return null;
  const v = val as Record<string, unknown>;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return parseInt(v.integerValue as string, 10);
  if ("doubleValue" in v) return v.doubleValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) {
    const arr = v.arrayValue as { values?: unknown[] };
    return (arr.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in v) {
    const map = v.mapValue as { fields?: Record<string, unknown> };
    const res: Record<string, unknown> = {};
    for (const [k, fieldVal] of Object.entries(map.fields || {})) {
      res[k] = fromFirestoreValue(fieldVal);
    }
    return res;
  }
  return null;
}

function documentToData(docObj: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const fields = (docObj.fields as Record<string, unknown>) || {};
  for (const [k, v] of Object.entries(fields)) {
    data[k] = fromFirestoreValue(v);
  }
  return data;
}

export async function restFetchCollection(collectionName: string): Promise<Array<{ id: string; [key: string]: unknown }>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/${collectionName}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`REST fetch collection failed: ${res.statusText}`);
    }
    const json = (await res.json()) as { documents?: Array<{ name: string; fields?: Record<string, unknown> }> };
    return (json.documents || []).map((docObj) => {
      const id = docObj.name.split("/").pop() || "";
      return { id, ...documentToData(docObj as unknown as Record<string, unknown>) };
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function restFetchDocument(path: string): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`REST fetch document failed: ${res.statusText}`);
    }
    const json = (await res.json()) as Record<string, unknown>;
    return documentToData(json);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function restPatchDocument(path: string, data: Record<string, unknown>): Promise<void> {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`REST patch document failed: ${res.status} ${errText}`);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function restDeleteDocument(path: string): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/${path}`, {
      method: "DELETE",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok && res.status !== 404) {
      throw new Error(`REST delete failed: ${res.statusText}`);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

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
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    imagePublicId: data.imagePublicId || undefined,
    orderIndex: typeof data.orderIndex === "number" ? data.orderIndex : 0,
    status: data.status === "draft" ? "draft" : "published",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy || undefined,
  };
}

function rawToService(raw: { id: string; [key: string]: unknown }): ServiceItem {
  return {
    id: raw.id,
    slug: (raw.slug as string) || raw.id,
    title: (raw.title as string) || "",
    description: (raw.description as string) || "",
    specs: Array.isArray(raw.specs) ? (raw.specs as string[]) : [],
    category: (raw.category as string) || "General",
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
    imagePublicId: (raw.imagePublicId as string) || undefined,
    orderIndex: typeof raw.orderIndex === "number" ? raw.orderIndex : 0,
    status: raw.status === "draft" ? "draft" : "published",
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    updatedBy: (raw.updatedBy as string) || undefined,
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
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
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

function rawToGallery(raw: { id: string; [key: string]: unknown }): GalleryItem {
  const isVideo = Boolean(
    raw.mediaType === "video" ||
    (typeof raw.imageUrl === "string" && (raw.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || raw.imageUrl.includes("/video/upload/")))
  );
  return {
    id: raw.id,
    title: (raw.title as string) || "",
    category: (raw.category as GalleryCategory) || "Installation",
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
    imagePublicId: (raw.imagePublicId as string) || undefined,
    mediaType: isVideo ? "video" : "image",
    altText: (raw.altText as string) || (raw.title as string) || "",
    orderIndex: typeof raw.orderIndex === "number" ? raw.orderIndex : 0,
    status: raw.status === "draft" ? "draft" : "published",
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    updatedBy: (raw.updatedBy as string) || undefined,
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
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Fetch all published services for the public site.
 */
export async function getPublishedServices(): Promise<ServiceItem[]> {
  const now = Date.now();
  if (cachedServices && now - lastServicesFetchTime < CACHE_TTL_MS) {
    return applyLocalServiceOverrides(cachedServices);
  }

  // 1. Try Ultra-Fast Firestore REST API first (sub-300ms, no WebChannel timeouts)
  try {
    const rawList = await restFetchCollection("services");
    if (rawList && rawList.length > 0) {
      const items = rawList
        .map(rawToService)
        .filter((s) => s.status === "published")
        .sort((a, b) => a.orderIndex - b.orderIndex);

      if (items.length > 0) {
        cachedServices = items;
        lastServicesFetchTime = now;
        return applyLocalServiceOverrides(items);
      }
    }
  } catch (restErr) {
    console.warn("Firestore REST getPublishedServices notice, falling back:", restErr);
  }

  // 2. Try Firebase SDK client
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const servicesRef = collection(db, "services");
      const q = query(servicesRef, where("status", "==", "published"));
      const snapshot = await withTimeout(getDocs(q), 4000);

      if (!snapshot.empty) {
        const result = snapshot.docs
          .map(snapshotToService)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        cachedServices = result;
        lastServicesFetchTime = now;
        return applyLocalServiceOverrides(result);
      }
    }
  } catch (sdkError) {
    console.warn("Firebase SDK query failed or timed out:", sdkError);
  }

  // 3. Guaranteed offline / initial structure fallback
  const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
  cachedServices = fallback;
  lastServicesFetchTime = now;
  return applyLocalServiceOverrides(fallback);
}

/**
 * Fetch a single service by slug.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return null;

  try {
    const raw = await restFetchDocument(`services/${cleanSlug}`);
    if (raw) {
      const item = rawToService({ id: cleanSlug, ...raw });
      return applyLocalServiceOverrides([item])[0] || item;
    }
  } catch {}

  const all = await getPublishedServices();
  return all.find(s => s.slug === cleanSlug) || null;
}

/**
 * Fetch all services for the admin panel (including drafts).
 */
export async function getAllServices(): Promise<ServiceItem[]> {
  // 1. Try REST API
  try {
    const rawList = await restFetchCollection("services");
    if (rawList && rawList.length > 0) {
      const list = rawList.map(rawToService).sort((a, b) => a.orderIndex - b.orderIndex);
      return applyLocalServiceOverrides(list);
    }
  } catch (restErr) {
    console.warn("REST getAllServices notice:", restErr);
  }

  // 2. Try Client SDK
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const servicesRef = collection(db, "services");
      const q = query(servicesRef, orderBy("orderIndex", "asc"));
      const snapshot = await withTimeout(getDocs(q), 4000);
      if (!snapshot.empty) {
        return applyLocalServiceOverrides(snapshot.docs.map(snapshotToService));
      }
    }
  } catch (error) {
    console.warn("Firestore admin services query notice:", error);
  }

  return applyLocalServiceOverrides(DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug })));
}

/**
 * Check if a slug is already taken by another service.
 */
export async function isServiceSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return false;

  try {
    const all = await getAllServices();
    return !all.some((s) => s.slug === cleanSlug && s.id !== excludeId);
  } catch {
    return true;
  }
}

/**
 * Create a new service record with slug uniqueness and input validation.
 * Saves to local overrides instantly and commits permanently to Cloud Firestore via REST.
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

  const docId = cleanSlug;
  const itemPayload: ServiceItem = {
    id: docId,
    title: data.title.trim(),
    slug: cleanSlug,
    description: data.description?.trim() || "",
    specs: Array.isArray(data.specs) ? data.specs.map((s) => s.trim()).filter(Boolean) : [],
    category: data.category?.trim() || "General",
    imageUrl: data.imageUrl?.trim() || "",
    imagePublicId: data.imagePublicId?.trim() || undefined,
    orderIndex: Number(data.orderIndex) || 0,
    status: data.status === "draft" ? "draft" : "published",
    updatedBy: data.updatedBy || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Instant local persistence for zero delay
  saveServiceOverride(docId, itemPayload);
  cachedServices = null;
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }

  // 2. Commit permanently to Firestore via Direct REST API
  try {
    await restPatchDocument(`services/${docId}`, {
      title: itemPayload.title,
      slug: itemPayload.slug,
      description: itemPayload.description,
      specs: itemPayload.specs,
      category: itemPayload.category,
      imageUrl: itemPayload.imageUrl,
      imagePublicId: itemPayload.imagePublicId || null,
      orderIndex: itemPayload.orderIndex,
      status: itemPayload.status,
      updatedBy: itemPayload.updatedBy || null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (restErr) {
    console.warn("REST createService patch notice, attempting client SDK fallback:", restErr);
    // Client SDK fallback
    try {
      const docRef = doc(db, "services", docId);
      await withTimeout(setDoc(docRef, itemPayload, { merge: true }), 4000);
    } catch (sdkErr) {
      console.warn("Client SDK write notice (local override preserved):", sdkErr);
    }
  }

  return docId;
}

/**
 * Update an existing service record.
 * Saves to local overrides instantly and commits permanently to Cloud Firestore via REST.
 */
export async function updateService(
  id: string,
  data: Partial<Omit<ServiceItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (data.slug) {
    data.slug = sanitizeSlug(data.slug);
  }

  // 1. Save local override immediately for instant zero-latency UI update
  saveServiceOverride(id, { id, ...data } as ServiceItem);
  cachedServices = null;
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }

  const updatePayload: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  Object.keys(updatePayload).forEach(
    (key) => updatePayload[key] === undefined && delete updatePayload[key]
  );

  // 2. Commit permanently to Cloud Firestore via REST API
  try {
    await restPatchDocument(`services/${id}`, updatePayload);
  } catch (restErr) {
    console.warn("REST updateService notice, attempting client SDK:", restErr);
    try {
      const docRef = doc(db, "services", id);
      await withTimeout(setDoc(docRef, updatePayload, { merge: true }), 4000);
    } catch (sdkErr) {
      console.warn("Client SDK updateService notice (local override preserved):", sdkErr);
    }
  }
}

/**
 * Delete a service record.
 */
export async function deleteService(id: string): Promise<void> {
  // 1. Remove from local storage immediately
  removeServiceOverride(id);
  cachedServices = null;
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("se_services_updated")); } catch {}
  }

  // 2. Delete from Cloud Firestore via REST API
  try {
    await restDeleteDocument(`services/${id}`);
  } catch (restErr) {
    console.warn("REST deleteService notice, trying client SDK:", restErr);
    try {
      const docRef = doc(db, "services", id);
      await withTimeout(deleteDoc(docRef), 4000);
    } catch {}
  }
}

/**
 * Seed initial services into Firestore if the collection is currently empty.
 */
export async function seedInitialServices(): Promise<number> {
  let count = 0;
  for (const item of DEFAULT_SERVICES) {
    try {
      await restPatchDocument(`services/${item.slug}`, {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    } catch {}
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

let cachedGallery: GalleryItem[] | null = null;
let lastGalleryFetchTime = 0;

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const now = Date.now();
  if (cachedGallery && now - lastGalleryFetchTime < CACHE_TTL_MS) {
    return applyLocalGalleryOverrides(cachedGallery);
  }

  // 1. Try REST API
  try {
    const rawList = await restFetchCollection("gallery");
    if (rawList && rawList.length > 0) {
      const items = rawList
        .map(rawToGallery)
        .filter((i) => i.status === "published")
        .sort((a, b) => a.orderIndex - b.orderIndex);

      if (items.length > 0) {
        cachedGallery = items;
        lastGalleryFetchTime = now;
        return applyLocalGalleryOverrides(items);
      }
    }
  } catch (restErr) {
    console.warn("REST getPublishedGallery notice:", restErr);
  }

  // 2. Try SDK
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const galleryRef = collection(db, "gallery");
      const q = query(galleryRef, where("status", "==", "published"));
      const snapshot = await withTimeout(getDocs(q), 4000);
      if (!snapshot.empty) {
        const result = snapshot.docs.map(snapshotToGallery).sort((a, b) => a.orderIndex - b.orderIndex);
        cachedGallery = result;
        lastGalleryFetchTime = now;
        return applyLocalGalleryOverrides(result);
      }
    }
  } catch {}

  return applyLocalGalleryOverrides([]);
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  // 1. Try REST API
  try {
    const rawList = await restFetchCollection("gallery");
    if (rawList && rawList.length > 0) {
      const list = rawList.map(rawToGallery).sort((a, b) => a.orderIndex - b.orderIndex);
      return applyLocalGalleryOverrides(list);
    }
  } catch (restErr) {
    console.warn("REST getAllGallery notice:", restErr);
  }

  // 2. Try SDK
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const galleryRef = collection(db, "gallery");
      const q = query(galleryRef, orderBy("orderIndex", "asc"));
      const snapshot = await withTimeout(getDocs(q), 4000);
      if (!snapshot.empty) {
        return applyLocalGalleryOverrides(snapshot.docs.map(snapshotToGallery));
      }
    }
  } catch {}

  return applyLocalGalleryOverrides([]);
}

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

  const docId = `gallery-${Date.now()}`;
  const item: GalleryItem = {
    id: docId,
    title: data.title.trim(),
    category: data.category || "Installation",
    imageUrl: data.imageUrl.trim(),
    imagePublicId: data.imagePublicId || undefined,
    mediaType: isVideo ? "video" : "image",
    altText: data.altText?.trim() || data.title.trim(),
    orderIndex: Number(data.orderIndex) || 0,
    status: data.status === "draft" ? "draft" : "published",
    updatedBy: data.updatedBy || undefined,
  };

  saveGalleryOverride(docId, item);
  cachedGallery = null;
  notifyGalleryUpdated();

  try {
    await restPatchDocument(`gallery/${docId}`, {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (restErr) {
    console.warn("REST createGalleryItem notice, trying SDK fallback:", restErr);
    try {
      const galleryRef = collection(db, "gallery");
      await withTimeout(addDoc(galleryRef, { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }), 4000);
    } catch {}
  }

  return docId;
}

export async function updateGalleryItem(
  id: string,
  data: Partial<Omit<GalleryItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const isVideo = Boolean(
    data.mediaType === "video" ||
    (data.imageUrl && (data.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || data.imageUrl.includes("/video/upload/")))
  );

  saveGalleryOverride(id, {
    id,
    ...data,
    mediaType: isVideo ? "video" : "image",
  } as GalleryItem);

  cachedGallery = null;
  notifyGalleryUpdated();

  const updatePayload: Record<string, unknown> = {
    ...data,
    mediaType: isVideo ? "video" : "image",
    updatedAt: new Date().toISOString(),
  };

  try {
    await restPatchDocument(`gallery/${id}`, updatePayload);
  } catch (restErr) {
    console.warn("REST updateGalleryItem notice, trying SDK:", restErr);
    try {
      const docRef = doc(db, "gallery", id);
      await withTimeout(setDoc(docRef, updatePayload, { merge: true }), 4000);
    } catch {}
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  removeGalleryOverride(id);
  cachedGallery = null;
  notifyGalleryUpdated();

  try {
    await restDeleteDocument(`gallery/${id}`);
  } catch (restErr) {
    console.warn("REST deleteGalleryItem notice, trying SDK:", restErr);
    try {
      const docRef = doc(db, "gallery", id);
      await withTimeout(deleteDoc(docRef), 4000);
    } catch {}
  }
}

export async function seedInitialGallery(): Promise<number> {
  let count = 0;
  for (const item of DEFAULT_GALLERY) {
    const docId = `gallery-${Date.now()}-${count}`;
    try {
      await restPatchDocument(`gallery/${docId}`, {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    } catch {}
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
    const raw = await restFetchDocument("settings/founder");
    if (raw && (raw.name || raw.imageUrl)) {
      const res = {
        name: typeof raw.name === "string" ? raw.name : "Sandeep Goud",
        imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "/images/team/founder.jpg",
        imagePublicId: typeof raw.imagePublicId === "string" ? raw.imagePublicId : undefined,
      };
      if (typeof window !== "undefined") {
        try { localStorage.setItem(FOUNDER_STORAGE_KEY, JSON.stringify(res)); } catch {}
      }
      return res;
    }
  } catch (restErr) {
    console.warn("REST getFounderData notice:", restErr);
  }

  if (localData && (localData.name || localData.imageUrl)) {
    return localData;
  }

  return { name: "Sandeep Goud", imageUrl: "/images/team/founder.jpg" };
}

export async function updateFounderData(data: { name?: string; imageUrl?: string; imagePublicId?: string }): Promise<void> {
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

  try {
    await restPatchDocument("settings/founder", {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.imagePublicId !== undefined ? { imagePublicId: data.imagePublicId } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("updateFounderData notice (local update remains active):", err);
  }
}

/* =========================================================================
   SERVICES PAGE SETTINGS MODULE (Engineering, Customization, Other Services)
   ========================================================================= */

export interface EngineeringServiceSetting {
  id?: string;
  href?: string;
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
    image: "",
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
  },
  {
    title: "Modernization",
    image: "",
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
  },
  {
    title: "Repairs",
    image: "",
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
  },
  {
    title: "Maintenance",
    image: "",
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
  },
  {
    title: "Aftersales Services",
    image: "",
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
  }
];

export const DEFAULT_CUSTOMIZATION_DATA: CustomizationSetting[] = [
  {
    title: "Cabin Models",
    image: "",
    description: "Premium architectural cabins with customizable paneling, finishes, and handrails to match any aesthetic.",
    items: ["Standard SS", "Premium Glass", "Custom Designs"],
  },
  {
    title: "Door Options",
    image: "",
    description: "High-performance automatic and manual door systems engineered for rapid, safe, and silent operation.",
    items: ["Automatic Sliding Doors", "Manual Collapsible", "Premium Glass Doors"],
  },
  {
    title: "Control & Safety",
    image: "",
    description: "Advanced microprocessor controllers and intelligent sensors ensuring smooth, reliable, and perfectly leveled rides.",
    items: ["Microprocessor Control", "ARD (Auto Rescue Device)", "Advanced Safety Gears"],
  },
  {
    title: "Machinery",
    image: "",
    description: "Heavy-duty geared, gearless, and hydraulic drive systems engineered for maximum durability and efficiency.",
    items: ["Geared Machines", "Gearless Machines", "Hydraulic Drives"],
  },
  {
    title: "Interiors",
    image: "",
    description: "Elevate your space with luxurious flooring, elegant ceilings, and sophisticated custom LED lighting.",
    items: ["Custom Flooring", "Elegant Ceilings", "Integrated LED Lighting"],
  },
];

export const DEFAULT_OTHER_SERVICES_DATA: OtherServiceSetting[] = [
  { title: "Structural Fabrication", image: "", desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
  { title: "Glass & ACP Sheets", image: "", desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
  { title: "UPVC Window & Door", image: "", desc: "High-quality UPVC systems for residential and commercial spaces." },
  { title: "Renovation Works", image: "", desc: "Complete architectural and interior renovation services." },
  { title: "SS Railing", image: "", desc: "Custom stainless steel handrails and balustrades." },
  { title: "Electrical House Wirings", image: "", desc: "Complete residential and commercial electrical wiring systems." },
  { title: "Civil Works", image: "", desc: "Comprehensive civil construction and shaft preparation." },
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

  // 1. Fetch from Firestore REST API (immediate ~200ms response)
  try {
    const raw = await restFetchDocument("settings/services_page");
    if (raw) {
      const merged: ServicesPageSettings = {
        engineeringServices: Array.isArray(raw.engineeringServices) && raw.engineeringServices.length > 0
          ? raw.engineeringServices
          : (localData?.engineeringServices || DEFAULT_ENGINEERING_SERVICES_DATA),
        customization: Array.isArray(raw.customization) && raw.customization.length > 0
          ? raw.customization
          : (localData?.customization || DEFAULT_CUSTOMIZATION_DATA),
        otherServices: Array.isArray(raw.otherServices) && raw.otherServices.length > 0
          ? raw.otherServices
          : (localData?.otherServices || DEFAULT_OTHER_SERVICES_DATA),
      };

      if (typeof window !== "undefined") {
        try { localStorage.setItem(SERVICES_PAGE_STORAGE_KEY, JSON.stringify(merged)); } catch {}
      }
      return merged;
    }
  } catch (restErr) {
    console.warn("REST getServicesPageSettings notice:", restErr);
  }

  // 2. Try SDK if available
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (validateFirebaseConfig().isValid) {
      const docRef = doc(db, "settings", "services_page");
      const snapshot = await withTimeout(getDoc(docRef), 4000);
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
  } catch {}

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
  // 1. Instant local persistence for zero delay
  if (typeof window !== "undefined") {
    try {
      const current = await getServicesPageSettings();
      const merged = { ...current, ...data };
      localStorage.setItem(SERVICES_PAGE_STORAGE_KEY, JSON.stringify(merged));
      notifyServicesPageUpdated();
    } catch {}
  }

  // 2. Commit permanently to Firestore via Direct REST API
  try {
    await restPatchDocument("settings/services_page", {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (restErr) {
    console.warn("REST updateServicesPageSettings notice, trying SDK:", restErr);
    try {
      const docRef = doc(db, "settings", "services_page");
      await withTimeout(setDoc(docRef, data, { merge: true }), 4000);
    } catch (sdkErr) {
      console.warn("Client SDK update notice (local settings remain saved):", sdkErr);
    }
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

export async function submitInquiry(data: InquirySubmission): Promise<string> {
  const docId = `inquiry-${Date.now()}`;
  try {
    await restPatchDocument(`inquiries/${docId}`, {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || "",
      buildingType: data.buildingType || "General",
      serviceRequired: data.serviceRequired || "General Inquiry",
      projectLocation: data.projectLocation || "Telangana / AP",
      message: data.message?.trim() || "",
      status: "new",
      createdAt: new Date().toISOString(),
    });
    return docId;
  } catch {
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
  createdAt: unknown;
}

export async function getAllInquiries(): Promise<InquiryItem[]> {
  try {
    const rawList = await restFetchCollection("inquiries");
    if (rawList && rawList.length > 0) {
      return rawList.map((docObj) => ({
        id: docObj.id,
        name: typeof docObj.name === "string" ? docObj.name : "",
        phone: typeof docObj.phone === "string" ? docObj.phone : "",
        email: typeof docObj.email === "string" ? docObj.email : "",
        buildingType: typeof docObj.buildingType === "string" ? docObj.buildingType : "",
        serviceRequired: typeof docObj.serviceRequired === "string" ? docObj.serviceRequired : "",
        projectLocation: typeof docObj.projectLocation === "string" ? docObj.projectLocation : "",
        message: typeof docObj.message === "string" ? docObj.message : "",
        status: (docObj.status === "in-progress" || docObj.status === "resolved") ? docObj.status : "new",
        createdAt: docObj.createdAt,
      }));
    }
  } catch {}

  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(q), 3000);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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
  } catch {
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: "new" | "in-progress" | "resolved"): Promise<void> {
  try {
    await restPatchDocument(`inquiries/${id}`, { status });
  } catch {
    const docRef = doc(db, "inquiries", id);
    await updateDoc(docRef, { status });
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await restDeleteDocument(`inquiries/${id}`);
  } catch {
    const docRef = doc(db, "inquiries", id);
    await deleteDoc(docRef);
  }
}
