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
    imageUrl: "/images/3d_commercial.jpg",
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
    imageUrl: "/images/3d_apartments.jpg",
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
    imageUrl: "/images/3d_industrial.jpg",
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
    imageUrl: "/images/3d_healthcare_v2.jpg",
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
    imageUrl: "/images/card_installation.jpg",
    orderIndex: 5,
    status: "published",
  },
];

export const DEFAULT_GALLERY: Omit<GalleryItem, "id">[] = [
  {
    title: "MRL Passenger Lift Architectural Installation",
    category: "Installation",
    imageUrl: "/hero-elevator.jpg",
    orderIndex: 1,
    status: "published",
  },
  {
    title: "Brushed SS Cabin Interior with LED Lighting",
    category: "Cabins",
    imageUrl: "/images/card_modernization.jpg",
    orderIndex: 2,
    status: "published",
  },
  {
    title: "Automatic Center-Opening Glass Doors",
    category: "Doors",
    imageUrl: "/images/3d_apartments.jpg",
    orderIndex: 3,
    status: "published",
  },
  {
    title: "Hospital Stretcher Bed Lift System",
    category: "Installation",
    imageUrl: "/images/3d_healthcare_v2.jpg",
    orderIndex: 4,
    status: "published",
  },
  {
    title: "Microprocessor Traction Control Panel",
    category: "Components",
    imageUrl: "/images/card_maintenance.jpg",
    orderIndex: 5,
    status: "published",
  },
  {
    title: "Panoramic Glass Hydraulic Lift Enclosure",
    category: "Installation",
    imageUrl: "/images/card_installation.jpg",
    orderIndex: 6,
    status: "published",
  },
  {
    title: "Designer Elevator Ceiling & Fixtures",
    category: "Cabins",
    imageUrl: "/images/3d_residential.jpg",
    orderIndex: 7,
    status: "published",
  },
  {
    title: "Heavy Duty Freight & Goods Lift Platform",
    category: "Installation",
    imageUrl: "/images/3d_industrial.jpg",
    orderIndex: 8,
    status: "published",
  },
  {
    title: "Stainless Steel Telescopic Auto Door",
    category: "Doors",
    imageUrl: "/images/3d_commercial.jpg",
    orderIndex: 9,
    status: "published",
  },
];

export const ENGINEERING_SERVICES_DATA = [
  {
    title: "New Installation",
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
    image: "/images/card_installation.jpg",
    slug: "new-installation",
  },
  {
    title: "Modernization",
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
    image: "/images/card_modernization.jpg",
    slug: "modernization",
  },
  {
    title: "Repairs",
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
    image: "/images/3d_service.jpg",
    slug: "repairs",
  },
  {
    title: "Maintenance",
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
    image: "/images/card_maintenance.jpg",
    slug: "maintenance",
  },
  {
    title: "Aftersales Services",
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
    image: "/images/3d_apartments.jpg",
    slug: "aftersales-services",
  }
];

export const CUSTOMIZATION_DATA = [
  { title: "Cabin Models", image: "/images/card_modernization.jpg", desc: "Standard SS, Premium Glass, and Custom Designs.", slug: "cabin-models" },
  { title: "Door Options", image: "/images/3d_commercial.jpg", desc: "Collapsible, Imperforated, Swing, and Auto Doors.", slug: "door-options" },
  { title: "Control & Safety", image: "/images/card_maintenance.jpg", desc: "Micro Processor Control, ARD, and Safety Gears.", slug: "control-safety" },
  { title: "Machinery", image: "/images/card_installation.jpg", desc: "Geared, Gearless, and Hydraulic Drives.", slug: "machinery" },
  { title: "Interiors", image: "/images/3d_residential.jpg", desc: "Flooring, Ceiling Designs, Handles, and Lighting.", slug: "interiors" },
];

export const GALLERY_CATEGORIES_MENU = [
  { name: "Installation", href: "/gallery?category=Installation#gallery-grid", desc: "Site preparations and shaft structural work", image: "/hero-elevator.jpg" },
  { name: "Cabins", href: "/gallery?category=Cabins#gallery-grid", desc: "Premium elevator cabins and custom interiors", image: "/images/card_modernization.jpg" },
  { name: "Doors", href: "/gallery?category=Doors#gallery-grid", desc: "Automatic, manual, and swing door designs", image: "/images/3d_apartments.jpg" },
  { name: "Components", href: "/gallery?category=Components#gallery-grid", desc: "Microprocessor control panels and machinery", image: "/images/card_maintenance.jpg" },
];
