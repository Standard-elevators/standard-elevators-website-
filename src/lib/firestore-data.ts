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
  return {
    id: docSnap.id,
    title: data.title || "",
    category: data.category || "Installation",
    imageUrl: data.imageUrl || "/hero-elevator.jpg",
    imagePublicId: data.imagePublicId || undefined,
    altText: data.altText || data.title || "",
    orderIndex: typeof data.orderIndex === "number" ? data.orderIndex : 0,
    status: data.status === "draft" ? "draft" : "published",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy || undefined,
  };
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
export function withTimeout<T>(promise: Promise<T>, ms: number = 8000, fallbackMessage: string = "Request timed out"): Promise<T> {
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
   SERVICES CRUD MODULE
   ========================================================================= */

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
    return cachedServices;
  }

  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
      cachedServices = fallback;
      lastServicesFetchTime = now;
      return fallback;
    }

    const servicesRef = collection(db, "services");
    const q = query(
      servicesRef,
      where("status", "==", "published")
    );
    const snapshot = await withTimeout(getDocs(q), 1500);

    if (snapshot.empty) {
      const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
      cachedServices = fallback;
      lastServicesFetchTime = now;
      return fallback;
    }

    const result = snapshot.docs
      .map(snapshotToService)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    cachedServices = result;
    lastServicesFetchTime = now;
    return result;
  } catch (error) {
    console.warn("Firestore published services query timed out/failed, using verified fallback data:", error);
    const fallback = DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
    cachedServices = fallback;
    lastServicesFetchTime = now;
    return fallback;
  }
}


/**
 * Fetch all services for the admin panel (including drafts).
 */
export async function getAllServices(): Promise<ServiceItem[]> {
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      return DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
    }

    const servicesRef = collection(db, "services");
    const q = query(servicesRef, orderBy("orderIndex", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
    }

    return snapshot.docs.map(snapshotToService);
  } catch (error) {
    console.warn("Firestore admin services query failed, using verified fallback data:", error);
    return DEFAULT_SERVICES.map((s) => ({ ...s, id: s.slug }));
  }
}

/**
 * Check if a slug is already taken by another service.
 */
export async function isServiceSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  const servicesRef = collection(db, "services");
  const q = query(servicesRef, where("slug", "==", cleanSlug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return true;
  if (excludeId && snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId) {
    return true;
  }
  return false;
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

  const isUnique = await isServiceSlugUnique(cleanSlug);
  if (!isUnique) {
    throw new Error(`The slug "${cleanSlug}" is already in use by another elevator service.`);
  }

  const servicesRef = collection(db, "services");
  const docRef = await addDoc(servicesRef, {
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
  });

  return docRef.id;
}

/**
 * Update an existing service record.
 */
export async function updateService(
  id: string,
  data: Partial<Omit<ServiceItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (data.slug) {
    const cleanSlug = sanitizeSlug(data.slug);
    const isUnique = await isServiceSlugUnique(cleanSlug, id);
    if (!isUnique) {
      throw new Error(`The slug "${cleanSlug}" is already in use by another elevator service.`);
    }
    data.slug = cleanSlug;
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

  await updateDoc(docRef, updatePayload);
}

/**
 * Delete a service record.
 */
export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, "services", id);
  await deleteDoc(docRef);
}

/**
 * Seed initial services into Firestore if the collection is currently empty.
 */
export async function seedInitialServices(): Promise<number> {
  const servicesRef = collection(db, "services");
  const snapshot = await getDocs(servicesRef);

  if (!snapshot.empty) {
    return 0; // Already has data
  }

  let count = 0;
  for (const item of DEFAULT_SERVICES) {
    await addDoc(servicesRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}

/* =========================================================================
   GALLERY CRUD MODULE
   ========================================================================= */

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
    return cachedGallery;
  }

  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
      cachedGallery = fallback;
      lastGalleryFetchTime = now;
      return fallback;
    }

    const galleryRef = collection(db, "gallery");
    const q = query(
      galleryRef,
      where("status", "==", "published")
    );
    const snapshot = await withTimeout(getDocs(q), 1500);

    if (snapshot.empty) {
      const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
      cachedGallery = fallback;
      lastGalleryFetchTime = now;
      return fallback;
    }

    const result = snapshot.docs
      .map(snapshotToGallery)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    cachedGallery = result;
    lastGalleryFetchTime = now;
    return result;
  } catch (error) {
    console.warn("Firestore published gallery query timed out/failed, using verified fallback data:", error);
    const fallback = DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
    cachedGallery = fallback;
    lastGalleryFetchTime = now;
    return fallback;
  }
}


/**
 * Fetch all gallery items for the admin panel (including drafts).
 */
export async function getAllGallery(): Promise<GalleryItem[]> {
  try {
    const { validateFirebaseConfig } = await import('@/lib/firebase');
    if (!validateFirebaseConfig().isValid) {
      return DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
    }

    const galleryRef = collection(db, "gallery");
    const q = query(galleryRef, orderBy("orderIndex", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
    }

    return snapshot.docs.map(snapshotToGallery);
  } catch (error) {
    console.warn("Firestore admin gallery query failed, using verified fallback data:", error);
    return DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` }));
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

  const galleryRef = collection(db, "gallery");
  const docRef = await addDoc(galleryRef, {
    title: data.title.trim(),
    category: data.category || "Installation",
    imageUrl: data.imageUrl.trim(),
    imagePublicId: data.imagePublicId?.trim() || null,
    altText: data.altText?.trim() || data.title.trim(),
    orderIndex: Number(data.orderIndex) || 0,
    status: data.status === "draft" ? "draft" : "published",
    updatedBy: data.updatedBy || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update an existing gallery item.
 */
export async function updateGalleryItem(
  id: string,
  data: Partial<Omit<GalleryItem, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const docRef = doc(db, "gallery", id);
  const updatePayload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  Object.keys(updatePayload).forEach(
    (key) => updatePayload[key] === undefined && delete updatePayload[key]
  );

  await updateDoc(docRef, updatePayload);
}

/**
 * Delete a gallery item.
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  const docRef = doc(db, "gallery", id);
  await deleteDoc(docRef);
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

const DEFAULT_SERVICES_PAGE_SETTINGS: ServicesPageSettings = {
  engineeringServices: [],
  customization: [],
  otherServices: [],
};

export async function getServicesPageSettings(): Promise<ServicesPageSettings> {
  const docRef = doc(db, "settings", "services_page");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as ServicesPageSettings;
  }
  return DEFAULT_SERVICES_PAGE_SETTINGS;
}

export async function updateServicesPageSettings(data: Partial<ServicesPageSettings>): Promise<void> {
  const docRef = doc(db, "settings", "services_page");
  await setDoc(docRef, data, { merge: true });
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
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
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
}

export async function updateInquiryStatus(id: string, status: "new" | "in-progress" | "resolved"): Promise<void> {
  const docRef = doc(db, "inquiries", id);
  await updateDoc(docRef, { status });
}

export async function deleteInquiry(id: string): Promise<void> {
  const docRef = doc(db, "inquiries", id);
  await deleteDoc(docRef);
}
