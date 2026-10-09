import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedServices } from "@/lib/firestore-data";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";
import ServiceDetailView from "@/components/ServiceDetailView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const services = await getPublishedServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return constructMetadata({
      title: "Elevator Service | Standard Engineering Works Elevators",
      description: "Custom elevator engineering, installation, and modernization solutions.",
      path: `/services/${slug}`,
    });
  }

  return constructMetadata({
    title: `${service.title} | Standard Engineering Works Elevators`,
    description: service.description,
    path: `/services/${service.slug}`,
    image: service.imageUrl,
  });
}

export default async function DynamicServicePage({ params }: Props) {
  const { slug } = await params;
  const services = await getPublishedServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title, url: `/services/${service.slug}` },
  ]);

  const serviceSchema = getServiceSchema({
    name: service.title,
    description: service.description,
    url: `/services/${service.slug}`,
    image: service.imageUrl,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServiceDetailView initialService={service} slug={slug} />
    </>
  );
}
