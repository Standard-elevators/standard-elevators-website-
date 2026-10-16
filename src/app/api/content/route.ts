import { NextResponse } from "next/server";
import { readLiveContent, writeLiveContent } from "@/lib/server-content-store";
import { ServiceItem, GalleryItem } from "@/types/data";
import { ServicesPageSettings } from "@/lib/firestore-data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const store = await readLiveContent();

    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    if (type === "services") {
      return NextResponse.json({ services: store.services }, { headers });
    }
    if (type === "gallery") {
      return NextResponse.json({ gallery: store.gallery }, { headers });
    }
    if (type === "servicesPage") {
      return NextResponse.json({ servicesPage: store.servicesPage }, { headers });
    }

    return NextResponse.json(store, { headers });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to read live content." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;
    const store = await readLiveContent();

    if (action === "saveService") {
      const service = data as ServiceItem;
      if (!service.id && !service.slug) {
        return NextResponse.json({ error: "Service must have an id or slug." }, { status: 400 });
      }

      const id = service.id || service.slug;
      const existingIdx = store.services.findIndex(
        (s) => s.id === id || s.slug === service.slug || s.id === service.slug
      );

      const serviceToSave: ServiceItem = {
        ...service,
        id,
        imageUrl: (service.imageUrl || "").trim(),
        orderIndex: Number(service.orderIndex) || (existingIdx >= 0 ? store.services[existingIdx].orderIndex : store.services.length + 1),
        status: service.status === "draft" ? "draft" : "published",
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        store.services[existingIdx] = serviceToSave;
      } else {
        store.services.push(serviceToSave);
      }

      store.services.sort((a, b) => a.orderIndex - b.orderIndex);
      await writeLiveContent(store, true);
      return NextResponse.json({ success: true, service: serviceToSave });
    }

    if (action === "deleteService") {
      const { id } = data;
      if (!id) {
        return NextResponse.json({ error: "Missing service id." }, { status: 400 });
      }

      store.services = store.services.filter((s) => s.id !== id && s.slug !== id);
      await writeLiveContent(store, true);
      return NextResponse.json({ success: true, id });
    }

    if (action === "saveGallery") {
      const item = data as GalleryItem;
      const id = item.id || `gallery-${Date.now()}`;

      const existingIdx = store.gallery.findIndex((g) => g.id === id);
      const isVideo = Boolean(
        item.mediaType === "video" ||
        (item.imageUrl && (item.imageUrl.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || item.imageUrl.includes("/video/upload/")))
      );

      const itemToSave: GalleryItem = {
        ...item,
        id,
        imageUrl: (item.imageUrl || "").trim(),
        mediaType: isVideo ? "video" : "image",
        orderIndex: Number(item.orderIndex) || (existingIdx >= 0 ? store.gallery[existingIdx].orderIndex : store.gallery.length + 1),
        status: item.status === "draft" ? "draft" : "published",
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        store.gallery[existingIdx] = itemToSave;
      } else {
        store.gallery.push(itemToSave);
      }

      store.gallery.sort((a, b) => a.orderIndex - b.orderIndex);
      await writeLiveContent(store, true);
      return NextResponse.json({ success: true, galleryItem: itemToSave });
    }

    if (action === "deleteGallery") {
      const { id } = data;
      if (!id) {
        return NextResponse.json({ error: "Missing gallery item id." }, { status: 400 });
      }

      store.gallery = store.gallery.filter((g) => g.id !== id);
      await writeLiveContent(store, true);
      return NextResponse.json({ success: true, id });
    }

    if (action === "saveServicesPage") {
      const settings = data as Partial<ServicesPageSettings>;
      store.servicesPage = {
        engineeringServices: settings.engineeringServices || store.servicesPage.engineeringServices,
        customization: settings.customization || store.servicesPage.customization,
        otherServices: settings.otherServices || store.servicesPage.otherServices,
      };

      await writeLiveContent(store, true);
      return NextResponse.json({ success: true, servicesPage: store.servicesPage });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to persist content." },
      { status: 500 }
    );
  }
}
