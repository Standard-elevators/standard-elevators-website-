import { Metadata } from "next";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";
import AboutView from "@/components/about/AboutView";

export const metadata: Metadata = constructMetadata({
  title: "About Us | Standard Engineering Works Elevators",
  description:
    "Learn about Standard Engineering Works Elevators, a pioneer in design, manufacturing, supplying, installation, and maintenance of elevators in Hyderabad, Telangana, and AP since 2003.",
  path: "/about",
});

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutView />
    </>
  );
}
