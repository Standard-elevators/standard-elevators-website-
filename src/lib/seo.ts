import { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.standardelevatorworks.com";

export const BUSINESS_INFO = {
  name: "Standard Engineering Works Elevators",
  shortName: "Standard Elevators",
  tagline: "Smooth | Smart | Spacious",
  establishedYear: "2016",
  installedUnits: "100+",
  phones: ["+91-9515231555", "+91-9556785440", "+91-9652969996"],
  displayPhones: ["9515231555", "9556785440", "9652969996"],
  newInstallationsPhone: "+91-9515231555",
  repairsPhone1: "+91-9556785440",
  repairsPhone2: "+91-9652969996",
  email: "standardelevators.engworks12@gmail.com",
  region: "Telangana & Andhra Pradesh",
  primaryCity: "Hyderabad",
  logoUrl: `${SITE_URL}/logo-square.png`,
  ogImageUrl: `${SITE_URL}/og-image.jpg`,
};

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Constructs standardized, production-ready Next.js Metadata with canonical URLs,
 * OpenGraph, Twitter cards, and WhatsApp/Google logo previews.
 */
export function constructMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: MetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  const ogImage = image || BUSINESS_INFO.ogImageUrl;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: BUSINESS_INFO.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${title} - ${BUSINESS_INFO.name}`,
        },
        {
          url: `${SITE_URL}/whatsapp-square.jpg`,
          secureUrl: `${SITE_URL}/whatsapp-square.jpg`,
          width: 600,
          height: 600,
          type: "image/jpeg",
          alt: `${BUSINESS_INFO.name} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "og:image:secure_url": ogImage,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Generates Schema.org Organization & HomeAndConstructionBusiness structured data
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS_INFO.name,
    alternateName: [
      "Standard Elevators",
      "Standard Elevator Works",
      "Standard Engineering Works Elevators",
      "Standard Engineering Works",
      "Standard Lift Works",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-square.png`,
      caption: BUSINESS_INFO.name,
      width: "512",
      height: "512",
    },
    image: [
      `${SITE_URL}/og-image.jpg`,
      `${SITE_URL}/logo.jpg`,
      `${SITE_URL}/logo-square.png`,
    ],
    description:
      "Premier elevator design, engineering, manufacturing, installation, modernization, and maintenance of passenger, MRL, goods, and hospital elevators in Telangana and Andhra Pradesh since 2016.",
    foundingDate: BUSINESS_INFO.establishedYear,
    telephone: BUSINESS_INFO.phones,
    email: BUSINESS_INFO.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9515231555",
        contactType: "sales and new installations",
        areaServed: ["IN-TG", "IN-AP"],
        availableLanguage: ["English", "Telugu", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-9556785440",
        contactType: "customer service, repairs and inquiries",
        areaServed: ["IN-TG", "IN-AP"],
        availableLanguage: ["English", "Telugu", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-9652969996",
        contactType: "customer service, repairs and inquiries",
        areaServed: ["IN-TG", "IN-AP"],
        availableLanguage: ["English", "Telugu", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_INFO.primaryCity,
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.3850",
      longitude: "78.4867",
    },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
    ],
    knowsAbout: [
      "Standard Elevators",
      "Elevator Engineering",
      "Passenger Elevators",
      "MRL Traction Elevators",
      "Goods & Freight Lifts",
      "Hospital Lifts",
      "Elevator Repair & Maintenance",
      "Elevator Modernization",
      "Elevator AMC",
    ],
    priceRange: "$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Elevator Engineering Systems & Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Passenger Elevators",
            description: "Smooth, quiet, and reliable passenger elevators for residential and commercial complexes.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Machine-Room-Less (MRL) Elevators",
            description: "Space-saving and energy-efficient gearless traction MRL elevators.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Goods & Freight Lifts",
            description: "Heavy-duty industrial vertical freight transport for factories and warehouses.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hospital & Stretcher Lifts",
            description: "Smooth critical-care elevators with precision floor leveling for stretchers and medical beds.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Elevator Modernization & AMC",
            description: "Annual maintenance contracts, safety upgrades, and microprocessor controller modernization.",
          },
        },
      ],
    },
  };
}

/**
 * Generates Schema.org WebSite structured data with SearchAction
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_INFO.name,
    alternateName: [
      "Standard Elevators",
      "Standard Elevator Works",
      "Standard Engineering Works Elevators",
    ],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/services?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Voice Search & SVO (Search Voice Optimization) / AEO FAQ Schema
 */
export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is the best elevator company in Hyderabad for commercial and residential lifts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard Engineering Works Elevators is one of the premier elevator manufacturers and engineering companies in Hyderabad, established in 2016. With over 100+ verified installations across Telangana and Andhra Pradesh, they specialize in passenger lifts, machine-room-less (MRL) elevators, goods freight lifts, and hospital stretcher lifts built to strict Bureau of Indian Standards (BIS) safety norms.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Standard Elevators for new elevator installations and repair services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For new elevator design and installation inquiries, call +91 9515231555. For elevator repairs, emergency breakdown services, maintenance, and inquiries, call +91 95567 85440 or +91 96529 69996. You can also reach out via email at standardelevators.engworks12@gmail.com.",
        },
      },
      {
        "@type": "Question",
        name: "What types of elevator systems does Standard Engineering Works Elevators manufacture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard Engineering Works Elevators designs, manufactures, and installs Passenger Elevators, Machine-Room-Less (MRL) gearless lifts, Heavy-Duty Freight and Goods Lifts, Hospital Bed and Stretcher Elevators, Hydraulic Lifts, as well as custom cabin interiors, automated doors, and microprocessor control systems.",
        },
      },
      {
        "@type": "Question",
        name: "Does Standard Elevators provide Elevator AMC and modernization across Telangana and Andhra Pradesh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Standard Engineering Works Elevators provides comprehensive Annual Maintenance Contracts (AMC), emergency repair dispatch, preventive maintenance protocols, and complete controller modernization across Hyderabad, Secunderabad, Cyberabad, Warangal, Vijayawada, Visakhapatnam, and throughout Telangana and Andhra Pradesh.",
        },
      },
      {
        "@type": "Question",
        name: "Are Standard Elevators compliant with Indian safety regulations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every elevator system manufactured by Standard Engineering Works Elevators complies rigorously with the Bureau of Indian Standards (BIS) and National Building Code (NBC) safety standards, featuring automatic rescue devices (ARD), overload detection, full-height infra-red light curtains, and certified governor safety gears.",
        },
      },
    ],
  };
}

/**
 * Local Business Schema with Geo-targeting & multi-city service areas
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS_INFO.name,
    alternateName: [
      "Standard Elevators",
      "Standard Elevator Works",
      "Standard Engineering Works Elevators",
      "Standard Engineering Works",
      "Standard Lift Works",
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/logo-square.png`,
    image: [
      `${SITE_URL}/og-image.jpg`,
      `${SITE_URL}/logo.jpg`,
      `${SITE_URL}/logo-square.png`,
    ],
    telephone: BUSINESS_INFO.phones,
    email: BUSINESS_INFO.email,
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, UPI, Cheque",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hyderabad Engineering & Manufacturing Headquarters",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.3850",
      longitude: "78.4867",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:30",
        closes: "20:30",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Hyderabad" },
      { "@type": "City", name: "Secunderabad" },
      { "@type": "City", name: "Cyberabad" },
      { "@type": "City", name: "Warangal" },
      { "@type": "City", name: "Karimnagar" },
      { "@type": "City", name: "Nizamabad" },
      { "@type": "City", name: "Khammam" },
      { "@type": "City", name: "Vijayawada" },
      { "@type": "City", name: "Visakhapatnam" },
      { "@type": "City", name: "Guntur" },
      { "@type": "City", name: "Tirupati" },
      { "@type": "City", name: "Rajahmundry" },
      { "@type": "City", name: "Nellore" },
      { "@type": "City", name: "Kurnool" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
    ],
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

/**
 * Generates Schema.org Service structured data
 */
export function getServiceSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
    ],
    serviceType: "Elevator Engineering & Installation",
    url: url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`,
    ...(image ? { image } : {}),
  };
}
