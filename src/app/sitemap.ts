import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublishedServices } from "@/lib/firestore-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core public static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services/passenger-lifts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/services/mrl-lifts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/services/goods-lifts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/services/hospital-lifts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

function parseDate(val: unknown): Date {
  if (!val) return new Date();
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === "object" && val !== null) {
    if ("toDate" in val && typeof (val as { toDate: () => unknown }).toDate === "function") {
      try {
        const d = (val as { toDate: () => unknown }).toDate();
        if (d instanceof Date && !isNaN(d.getTime())) return d;
      } catch {}
    }
    if ("seconds" in val && typeof (val as { seconds: unknown }).seconds === "number") {
      const d = new Date((val as { seconds: number }).seconds * 1000);
      if (!isNaN(d.getTime())) return d;
    }
  }
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

  // Dynamically include any published services from Firestore
  try {
    const services = await getPublishedServices();
    const coreSlugs = new Set(["passenger-lifts", "mrl-lifts", "goods-lifts", "hospital-lifts"]);
    
    const dynamicServiceRoutes: MetadataRoute.Sitemap = services
      .filter((s) => s.slug && !coreSlugs.has(s.slug))
      .map((s) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        lastModified: parseDate(s.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    return [...staticRoutes, ...dynamicServiceRoutes];
  } catch (err) {
    console.warn("Failed to fetch dynamic services for sitemap:", err);
    return staticRoutes;
  }
}
