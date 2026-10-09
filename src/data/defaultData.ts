import { ServiceItem, GalleryItem } from "@/types/data";

export const DEFAULT_SERVICES: Omit<ServiceItem, "id">[] = [
  {
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
    imageUrl: "",
    orderIndex: 1,
    status: "published",
  },
  {
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
    imageUrl: "",
    orderIndex: 2,
    status: "published",
  },
  {
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
    imageUrl: "",
    orderIndex: 3,
    status: "published",
  },
  {
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
    imageUrl: "",
    orderIndex: 4,
    status: "published",
  },
  {
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
    imageUrl: "",
    orderIndex: 5,
    status: "published",
  },
];

export const DEFAULT_GALLERY: Omit<GalleryItem, "id">[] = [];

export const ENGINEERING_SERVICES_DATA = [
  {
    title: "New Installation",
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
    image: "",
    slug: "new-installation",
  },
  {
    title: "Modernization",
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
    image: "",
    slug: "modernization",
  },
  {
    title: "Repairs",
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
    image: "",
    slug: "repairs",
  },
  {
    title: "Maintenance",
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
    image: "",
    slug: "maintenance",
  },
  {
    title: "Aftersales Services",
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
    image: "",
    slug: "aftersales-services",
  }
];

export const CUSTOMIZATION_DATA = [
  { title: "Cabin Models", image: "", desc: "Standard SS, Premium Glass, and Custom Designs.", slug: "cabin-models" },
  { title: "Door Options", image: "", desc: "Collapsible, Imperforated, Swing, and Auto Doors.", slug: "door-options" },
  { title: "Control & Safety", image: "", desc: "Micro Processor Control, ARD, and Safety Gears.", slug: "control-safety" },
  { title: "Machinery", image: "", desc: "Geared, Gearless, and Hydraulic Drives.", slug: "machinery" },
  { title: "Interiors", image: "", desc: "Flooring, Ceiling Designs, Handles, and Lighting.", slug: "interiors" },
];

export const GALLERY_CATEGORIES_MENU = [
  { name: "Installation", href: "/gallery?category=Installation#gallery-grid", desc: "Site preparations and shaft structural work", image: "" },
  { name: "Cabins", href: "/gallery?category=Cabins#gallery-grid", desc: "Premium elevator cabins and custom interiors", image: "" },
  { name: "Doors", href: "/gallery?category=Doors#gallery-grid", desc: "Automatic, manual, and swing door designs", image: "" },
  { name: "Components", href: "/gallery?category=Components#gallery-grid", desc: "Microprocessor control panels and machinery", image: "" },
];
