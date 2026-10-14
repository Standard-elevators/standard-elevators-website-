import { Metadata } from "next";

import Hero from "@/components/Hero";
import EngineeringCredentials from "@/components/EngineeringCredentials";
import ElevatorSystems from "@/components/ElevatorSystems";
import EngineeringServicesCarousel from "@/components/EngineeringServicesCarousel";
import FounderLeadership from "@/components/FounderLeadership";
import StandardDifference from "@/components/StandardDifference";

import ProjectPortfolio from "@/components/ProjectPortfolio";
import FinalCTA from "@/components/FinalCTA";
import { constructMetadata, getWebSiteSchema, getLocalBusinessSchema, getFaqSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "Standard Engineering Works Elevators | Top Elevator Company in Hyderabad & TS, AP",
  description:
    "Standard Engineering Works Elevators - Pioneer in elevator design, manufacturing, new installation, repairs, modernization, and maintenance in Hyderabad, Telangana, and Andhra Pradesh since 2016. Passenger, MRL, goods, and hospital lifts.",
  path: "/",
});

export default function Home() {
  const webSiteSchema = getWebSiteSchema();
  const localBusinessSchema = getLocalBusinessSchema();
  const faqSchema = getFaqSchema();

  return (
    <div className="flex flex-col w-full bg-warm-white text-graphite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* SECTION A — HERO */}
      <Hero />

      {/* SECTION B — ENGINEERING CREDENTIALS (EXACT REFERENCE REDESIGN) */}
      <EngineeringCredentials />


      {/* SECTION C — ELEVATOR SOLUTIONS */}
      <ElevatorSystems />

      {/* SECTION D — ENGINEERING SERVICES */}
      <EngineeringServicesCarousel showViewAllButton={true} />

      {/* SECTION E — LEADERSHIP & VISION */}
      <FounderLeadership />

      {/* SECTION F — WHY STANDARD ENGINEERING WORKS */}
      <StandardDifference />

      {/* SECTION F — DYNAMIC REAL-DATA PROJECT PORTFOLIO */}
      <ProjectPortfolio />

      {/* SECTION G — CONTACT CONVERSION */}
      <FinalCTA />
      
    </div>
  );
}
