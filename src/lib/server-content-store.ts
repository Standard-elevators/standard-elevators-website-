import { promises as fs } from "fs";
import path from "path";
import { ServiceItem, GalleryItem } from "@/types/data";
import { ServicesPageSettings } from "@/lib/firestore-data";

export interface LiveContentStore {
  services: ServiceItem[];
  gallery: GalleryItem[];
  servicesPage: ServicesPageSettings;
}

const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "standard-engineering-wor-c28e6";
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCL_QxgFxT8hzsHltmJcrURm5EKo8xML50";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "mrl-lifts",
    slug: "mrl-lifts",
    title: "MRL Lifts (Machine Room Less)",
    description: "Highly cost-effective and environmentally-friendly. The gearless traction feature presents superior performance and great ride quality without the need for a dedicated machine room.",
    specs: [
      "Commercial & Residential",
      "3 phase, 415v, 50Hz",
      "6-20 persons (408-1380 kg)",
      "1.0 - 1.50 m/s",
      "Up to 15 stops",
    ],
    category: "Commercial & Residential",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307972/standard_elevators/services/MRL_Lifts_Machine_Room_Less.png",
    imagePublicId: "standard_elevators/services/MRL_Lifts_Machine_Room_Less",
    orderIndex: 1,
    status: "published",
  },
  {
    id: "passenger-lifts",
    slug: "passenger-lifts",
    title: "Passenger Lifts (Dynamo Premium)",
    description: "Fast, safe, and reliable. Customized passenger elevators equipped with the latest technology, complying with all safety regulations for comfort and style.",
    specs: [
      "Apartments & Commercial",
      "5-20 persons (340-1380 kg)",
      "0.65 to 1.50 m/s",
      "Electric & Hydraulic",
      "Up to 10 stops",
    ],
    category: "Residential & Commercial",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791308852/standard_elevators/services/Passenger_Lifts_Dynamo_Premium_-_Copy.png",
    imagePublicId: "standard_elevators/services/Passenger_Lifts_Dynamo_Premium_-_Copy",
    orderIndex: 2,
    status: "published",
  },
  {
    id: "goods-lifts",
    slug: "goods-lifts",
    title: "Goods Lifts (CARVI & CARGO1)",
    description: "Designed for heavy lifting all day, every day. Outstanding accuracy, smooth travel, and enormous energy savings for industrial and commercial environments.",
    specs: [
      "Industrial & Hospitals",
      "500-5000 kg",
      "0.3 to 1.0 m/s",
      "Up to 15 stops",
      "Electric & Hydraulic",
    ],
    category: "Industrial & Freight",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791308873/standard_elevators/services/Goods_Lifts_CARVI_CARGO1.png",
    imagePublicId: "standard_elevators/services/Goods_Lifts_CARVI_CARGO1",
    orderIndex: 3,
    status: "published",
  },
  {
    id: "hospital-lifts",
    slug: "hospital-lifts",
    title: "Hospital & Stretcher Lifts (HOSPITRY)",
    description: "Mission-critical equipment designed to carry hospital beds (stretchers) along with personnel safely, smoothly, and precisely.",
    specs: [
      "Hospital Stretcher & Bed Lifts",
      "8-20 Persons",
      "0.5 to 1.5 m/s",
      "Up to 15 stops",
      "Gearless & Geared",
    ],
    category: "Healthcare",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791308889/standard_elevators/services/Hospital_Stretcher_Lifts_HOSPITRY_-_Copy.png",
    imagePublicId: "standard_elevators/services/Hospital_Stretcher_Lifts_HOSPITRY_-_Copy",
    orderIndex: 4,
    status: "published",
  },
  {
    id: "hydraulic-elevators",
    slug: "hydraulic-elevators",
    title: "Hydraulic Elevators",
    description: "Ideal for low-rise applications. Features a direct landing system, automatic rescue device, and reduced overhead and pit requirements for easy maintenance.",
    specs: [
      "Commercial & Low-rise",
      "6-20 persons (408-1380 kg)",
      "1.0 / 1.25 / 1.50 m/s",
      "Up to 4 stops",
      "Hydraulic operating system",
    ],
    category: "Commercial & Residential",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791308904/standard_elevators/services/Hydraulic_Elevators_-_Copy.png",
    imagePublicId: "standard_elevators/services/Hydraulic_Elevators_-_Copy",
    orderIndex: 5,
    status: "published",
  },
  {
    id: "belt-motors-lift",
    slug: "belt-motors-lift",
    title: "Belt Motors Lift",
    description: "Designed for premium villas, duplex residences, and luxury suites, our Belt Motor Lift combines refined aesthetics with smooth, comfortable vertical transportation. Engineered for modern residential spaces, it offers an elegant lift solution that complements upscale architecture while prioritizing passenger comfort, dependable operation, and efficient use of space.",
    specs: [
      "Application: Premium villas and luxury residences",
      "Suitable for: Duplex homes and multi-storey residential suites",
      "Drive system: Belt-driven motor system",
      "Ride experience: Designed for smooth, comfortable travel",
      "Design: Premium cabin finishes and contemporary styling",
      "Configuration: Customizable to project requirements",
      "Installation: Subject to site assessment and technical feasibility",
      "Safety: Safety features as per the selected model and applicable standards",
    ],
    category: "Premium Residential Elevators",
    imageUrl: "https://res.cloudinary.com/ikgbbha9/image/upload/v1792045042/standard_elevators/services/Luxury_Glass_Elevator_Atrium.png",
    imagePublicId: "standard_elevators/services/Luxury_Glass_Elevator_Atrium",
    orderIndex: 6,
    status: "published",
  },
];

const INITIAL_SERVICES_PAGE: ServicesPageSettings = {
  engineeringServices: [
    {
      id: "01",
      title: "New Installation",
      image: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307498/standard_elevators/engineering/New_Installation.png",
      desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
    },
    {
      id: "02",
      title: "Modernization",
      image: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307797/standard_elevators/engineering/Modernization.png",
      desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
    },
    {
      id: "03",
      title: "Repairs",
      image: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307815/standard_elevators/engineering/Repairs.png",
      desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
    },
    {
      id: "04",
      title: "Maintenance",
      image: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307825/standard_elevators/engineering/Maintenance.png",
      desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
    },
    {
      id: "05",
      title: "Aftersales Services",
      image: "https://res.cloudinary.com/ikgbbha9/image/upload/v1791307835/standard_elevators/engineering/Aftersales_Services.png",
      desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
    },
  ],
  customization: [
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
  ],
  otherServices: [
    { title: "Structural Fabrication", image: "", desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
    { title: "Glass & ACP Sheets", image: "", desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
    { title: "UPVC Window & Door", image: "", desc: "High-quality UPVC systems for residential and commercial spaces." },
    { title: "Renovation Works", image: "", desc: "Complete architectural and interior renovation services." },
    { title: "SS Railing", image: "", desc: "Custom stainless steel handrails and balustrades." },
    { title: "Electrical House Wirings", image: "", desc: "Complete residential and commercial electrical wiring systems." },
    { title: "Civil Works", image: "", desc: "Comprehensive civil construction and shaft preparation." },
  ],
};

const DEFAULT_STORE: LiveContentStore = {
  services: INITIAL_SERVICES,
  gallery: [],
  servicesPage: INITIAL_SERVICES_PAGE,
};

let inMemoryStore: LiveContentStore | null = null;
let lastStoreFetchTime = 0;
const STORE_CACHE_TTL_MS = 15 * 1000; // 15 seconds cache

function getDataPaths(): string[] {
  return [
    path.join(process.cwd(), "src", "data", "live-content.json"),
    path.join(process.cwd(), "public", "data", "live-content.json"),
  ];
}

/* =========================================================================
   FIRESTORE REST HELPERS (SERVERLESS RESILIENT)
   ========================================================================= */

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

export function toFirestoreValue(val: unknown): Record<string, unknown> {
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

export async function saveToFirestoreRest(docPath: string, data: Record<string, unknown>): Promise<void> {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  const url = `${FIRESTORE_BASE_URL}/${docPath}?key=${FIREBASE_API_KEY}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      console.warn(`Firestore save to ${docPath} returned status ${res.status}`);
    }
  } catch (err) {
    console.warn(`Firestore save to ${docPath} failed:`, err);
  }
}

export async function deleteFromFirestoreRest(docPath: string): Promise<void> {
  const url = `${FIRESTORE_BASE_URL}/${docPath}?key=${FIREBASE_API_KEY}`;
  try {
    await fetch(url, { method: "DELETE" });
  } catch (err) {
    console.warn(`Firestore delete from ${docPath} failed:`, err);
  }
}

async function fetchLiveStoreFromFirestore(): Promise<LiveContentStore | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const [servicesRes, galleryRes, settingsRes] = await Promise.allSettled([
      fetch(`${FIRESTORE_BASE_URL}/services?key=${FIREBASE_API_KEY}`, {
        cache: "no-store",
        signal: controller.signal,
      }),
      fetch(`${FIRESTORE_BASE_URL}/gallery?key=${FIREBASE_API_KEY}`, {
        cache: "no-store",
        signal: controller.signal,
      }),
      fetch(`${FIRESTORE_BASE_URL}/settings/services_page?key=${FIREBASE_API_KEY}`, {
        cache: "no-store",
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    // 1. Process Services
    let services: ServiceItem[] = [];
    if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
      const json = await servicesRes.value.json();
      const docs = (json.documents || []) as Array<{ name: string; fields?: Record<string, unknown> }>;
      services = docs.map((docObj) => {
        const id = docObj.name.split("/").pop() || "";
        const raw = documentToData(docObj as unknown as Record<string, unknown>);
        return {
          id,
          slug: (raw.slug as string) || id,
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
      });
      services.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    if (services.length === 0) {
      services = INITIAL_SERVICES;
    }

    // 2. Process Gallery
    let gallery: GalleryItem[] = [];
    if (galleryRes.status === "fulfilled" && galleryRes.value.ok) {
      const json = await galleryRes.value.json();
      const docs = (json.documents || []) as Array<{ name: string; fields?: Record<string, unknown> }>;
      gallery = docs.map((docObj) => {
        const id = docObj.name.split("/").pop() || "";
        const raw = documentToData(docObj as unknown as Record<string, unknown>);
        const isVideo = Boolean(
          raw.mediaType === "video" ||
          (typeof raw.imageUrl === "string" && (raw.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || raw.imageUrl.includes("/video/upload/")))
        );
        return {
          id,
          title: (raw.title as string) || "",
          category: (raw.category as any) || "Installation",
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
      });
      gallery.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    // 3. Process Services Page Settings
    let servicesPage = { ...INITIAL_SERVICES_PAGE };
    if (settingsRes.status === "fulfilled" && settingsRes.value.ok) {
      const json = await settingsRes.value.json();
      const raw = documentToData(json);
      if (Array.isArray(raw.engineeringServices) && raw.engineeringServices.length > 0) {
        // Merge with defaults to guarantee image fallback if image is missing
        servicesPage.engineeringServices = (raw.engineeringServices as any[]).map((eng, idx) => {
          const defaultItem = INITIAL_SERVICES_PAGE.engineeringServices[idx] || {};
          return {
            id: eng.id || defaultItem.id || `0${idx + 1}`,
            title: eng.title || defaultItem.title || "",
            desc: eng.desc || defaultItem.desc || "",
            image: (eng.image && eng.image.trim().length > 0) ? eng.image : (defaultItem.image || ""),
          };
        });
      }
      if (Array.isArray(raw.customization) && raw.customization.length > 0) {
        servicesPage.customization = raw.customization as any[];
      }
      if (Array.isArray(raw.otherServices) && raw.otherServices.length > 0) {
        servicesPage.otherServices = raw.otherServices as any[];
      }
    }

    return {
      services,
      gallery,
      servicesPage,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("fetchLiveStoreFromFirestore error:", err);
    return null;
  }
}

export async function readLiveContent(): Promise<LiveContentStore> {
  const now = Date.now();
  if (inMemoryStore && now - lastStoreFetchTime < STORE_CACHE_TTL_MS) {
    return inMemoryStore;
  }

  // 1. Try querying Cloud Firestore REST API directly
  const firestoreStore = await fetchLiveStoreFromFirestore();
  if (firestoreStore) {
    inMemoryStore = firestoreStore;
    lastStoreFetchTime = now;

    // Asynchronously update local files if writable (does not block response)
    writeDiskCache(firestoreStore).catch(() => {});
    return firestoreStore;
  }

  // 2. Fall back to reading from local files if Firestore is temporarily offline
  const paths = getDataPaths();
  for (const filePath of paths) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(content) as LiveContentStore;
      if (parsed && Array.isArray(parsed.services) && parsed.services.length > 0) {
        inMemoryStore = parsed;
        lastStoreFetchTime = now;
        return parsed;
      }
    } catch {
      // File not found or unreadable, continue
    }
  }

  // 3. Initialize with default store
  inMemoryStore = DEFAULT_STORE;
  lastStoreFetchTime = now;
  return inMemoryStore;
}

async function writeDiskCache(data: LiveContentStore): Promise<void> {
  const serialized = JSON.stringify(data, null, 2);
  const paths = getDataPaths();
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, serialized, "utf-8");
    } catch {
      // Ephemeral environments like Vercel will ignore or log
    }
  }
}

export async function writeLiveContent(data: LiveContentStore, triggerRevalidate = true): Promise<void> {
  inMemoryStore = data;
  lastStoreFetchTime = Date.now();

  await writeDiskCache(data);

  if (triggerRevalidate) {
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/services");
      revalidatePath("/gallery");
      revalidatePath("/");
      revalidatePath("/services/[slug]", "page");
    } catch {
      // revalidatePath only works in request context
    }
  }
}
