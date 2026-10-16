import { promises as fs } from "fs";
import path from "path";
import { ServiceItem, GalleryItem } from "@/types/data";
import { ServicesPageSettings } from "@/lib/firestore-data";

export interface LiveContentStore {
  services: ServiceItem[];
  gallery: GalleryItem[];
  servicesPage: ServicesPageSettings;
}

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
    orderIndex: 5,
    status: "published",
  },
];

const INITIAL_SERVICES_PAGE: ServicesPageSettings = {
  engineeringServices: [
    {
      id: "01",
      title: "New Installation",
      image: "",
      desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
    },
    {
      id: "02",
      title: "Modernization",
      image: "",
      desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
    },
    {
      id: "03",
      title: "Repairs",
      image: "",
      desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
    },
    {
      id: "04",
      title: "Maintenance",
      image: "",
      desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
    },
    {
      id: "05",
      title: "Aftersales Services",
      image: "",
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

function getDataPaths(): string[] {
  return [
    path.join(process.cwd(), "src", "data", "live-content.json"),
    path.join(process.cwd(), "public", "data", "live-content.json"),
  ];
}

export async function readLiveContent(): Promise<LiveContentStore> {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  const paths = getDataPaths();
  for (const filePath of paths) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(content) as LiveContentStore;
      if (parsed && Array.isArray(parsed.services)) {
        inMemoryStore = parsed;
        return parsed;
      }
    } catch {
      // File not found or unreadable, continue to next path
    }
  }

  // If no file exists, initialize with clean default store
  inMemoryStore = DEFAULT_STORE;
  await writeLiveContent(DEFAULT_STORE, false);
  return inMemoryStore;
}

export async function writeLiveContent(data: LiveContentStore, triggerRevalidate = true): Promise<void> {
  inMemoryStore = data;
  const serialized = JSON.stringify(data, null, 2);

  const paths = getDataPaths();
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, serialized, "utf-8");
    } catch (err) {
      console.warn(`Failed writing live-content to ${filePath}:`, err);
    }
  }

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
