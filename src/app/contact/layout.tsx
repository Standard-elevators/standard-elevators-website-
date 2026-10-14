import { Metadata } from "next";
import { constructMetadata, getBreadcrumbSchema, getLocalBusinessSchema, getFaqSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us & Request a Quote | Standard Engineering Works Elevators",
  description:
    "Request an elevator quotation, site survey, or maintenance consultation. Contact our Hyderabad engineering team at +91 9515231555 (New Installations) or 9556785440 / 9652969996 (Repairs & Inquiries).",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact & Quotation", url: "/contact" },
  ]);
  const localBusinessSchema = getLocalBusinessSchema();
  const faqSchema = getFaqSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
