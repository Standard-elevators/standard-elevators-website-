import { Metadata } from "next";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Project Portfolio & Gallery | Standard Engineering Works Elevators",
  description:
    "Explore our completed elevator installations across Hyderabad, Telangana, and Andhra Pradesh. Featuring MRL systems, luxury cabin interiors, and architectural glass lifts.",
  path: "/gallery",
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Project Gallery", url: "/gallery" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
