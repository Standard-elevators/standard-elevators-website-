import { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://standardelevators.in";

export const BUSINESS_INFO = {
  name: "Standard Engineering Works Elevators",
  shortName: "Standard Elevators",
  tagline: "Smooth | Smart | Spacious",
  establishedYear: "2003",
  installedUnits: "100+",
  phones: ["+91-9515231555", "+91-9652951116"],
  displayPhones: ["9515231555", "9652951116"],
  email: "standardelevators.engworks12@gmail.com",
  region: "Telangana & Andhra Pradesh",
  primaryCity: "Hyderabad",
  logoUrl: `${SITE_URL}/logo.jpg`,
  ogImageUrl: `${SITE_URL}/images/hero-video-poster.jpg`,
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
 * OpenGraph, and Twitter cards.
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
    alternates: {
      canonical: canonicalUrl,
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
          width: 1200,
          height: 630,
          alt: `${title} - ${BUSINESS_INFO.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
    alternateName: BUSINESS_INFO.shortName,
    url: SITE_URL,
    logo: BUSINESS_INFO.logoUrl,
    image: BUSINESS_INFO.ogImageUrl,
    description:
      "Design, engineering, manufacturing, installation, modernization, and maintenance of premium passenger, MRL, goods, and hospital elevators in Telangana and Andhra Pradesh since 2003.",
    foundingDate: BUSINESS_INFO.establishedYear,
    telephone: BUSINESS_INFO.phones,
    email: BUSINESS_INFO.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_INFO.primaryCity,
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
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
 * Generates Schema.org WebSite structured data
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.shortName,
    url: SITE_URL,
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
