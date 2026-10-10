import { Metadata } from "next";
import Link from "next/link";
import CustomizationCarousel from "@/components/CustomizationCarousel";
import EngineeringServicesCarousel from "@/components/EngineeringServicesCarousel";
import PrimarySolutionsCarousel from "@/components/PrimarySolutionsCarousel";
import { ArrowRight } from "lucide-react";
import { getPublishedServices, getServicesPageSettings } from "@/lib/firestore-data";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

import OtherEngineeringServices from "@/components/OtherEngineeringServices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "Elevator Solutions & Services | Standard Engineering Works Elevators",
  description:
    "Explore precision elevator solutions: Passenger Lifts, Machine-Room-Less (MRL) systems, Heavy-Duty Goods Lifts, Hospital Lifts, Hydraulic Elevators, and comprehensive engineering services.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getPublishedServices(),
    getServicesPageSettings(),
  ]);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Elevator Services", url: "/services" },
  ]);

  return (
    <div className="flex flex-col w-full bg-warm-white text-graphite min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#06172B]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ objectPosition: "center center" }}
        >
          <source src="/videos/services-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#06172B]/50 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08172B] via-transparent to-[#06172B]/60 z-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#0877F9]/10 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center w-full max-w-[1280px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#06172B]/60 backdrop-blur-md border border-[#0877F9]/40 rounded-full text-[11px] md:text-xs font-bold text-[#38BDF8] uppercase tracking-widest mb-6 shadow-md">
            Engineered Mobility
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
            Our <span className="text-[#38BDF8]">Elevator</span> Solutions
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#F1F5F9] font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            From precision MRL passenger lifts to heavy-duty industrial goods transport. Engineered for safety, comfort, and architectural integration.
          </p>
        </div>
      </section>

      {/* SECTION 2: ELEVATOR SOLUTIONS */}
      <section id="primary-solutions" className="pt-12 pb-6 md:py-32 bg-[#F7FAFD]">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2342] mb-6">
              Primary Elevator Solutions
            </h2>
            <p className="text-black font-medium text-[17px] md:text-[19px] leading-relaxed">
              Discover our complete range of premium vertical mobility products, manufactured and installed to exact architectural standards.
            </p>
          </div>

          <PrimarySolutionsCarousel services={services} />
        </div>
      </section>

      {/* SECTION 3: ENGINEERING SERVICES */}
      <div id="engineering-services">
        <EngineeringServicesCarousel initialData={settings.engineeringServices} />
      </div>

      {/* SECTION 4: ELEVATOR CUSTOMIZATION & COMPONENTS */}
      <div id="customization">
        <CustomizationCarousel initialData={settings.customization} />
      </div>

      {/* SECTION 5: OTHER ENGINEERING SERVICES */}
      <section id="other-services" className="relative py-16 md:py-24 bg-[#F8FAFC] overflow-hidden">
        
        {/* 3D Light Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* 3D Soft Light Orbs */}
          <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-white/90 to-[#E2E8F0]/40 shadow-[inset_0_0_80px_rgba(255,255,255,1)] blur-2xl"></div>
          <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#0062FF]/5 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-gradient-to-tl from-[#38BDF8]/10 to-transparent blur-3xl"></div>
          
          {/* Subtle Grid Pattern for Technical Feel */}
          <div className="absolute inset-0 opacity-[0.3]" 
               style={{ 
                 backgroundImage: `linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)`, 
                 backgroundSize: "40px 40px" 
               }}>
          </div>
        </div>

        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0062FF]/20 bg-[#0062FF]/10 text-[#0062FF] text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
              Structural & Fabrication
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0B1F38] mb-6 tracking-tight">Other Engineering Services</h2>
            <p className="text-black font-medium text-[17px] md:text-[19px] leading-relaxed">
              Our engineering expertise extends beyond elevators. We provide a range of structural and architectural services including heavy-duty fabrication, civil works, and premium exterior cladding.
            </p>
          </div>

          <OtherEngineeringServices initialData={settings.otherServices} />
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-16 md:py-20 bg-[#08172B] text-center border-t border-white/10">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Planning Your Next Vertical Journey?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 font-light">
            Our engineering team prepares turnkey shaft drawings, motor sizing, and detailed quotations based on your precise architectural requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0877F9] hover:bg-[#0666D8] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_20px_rgba(8,119,249,0.4)] active:scale-95"
          >
            <span>Request Site Survey & Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
