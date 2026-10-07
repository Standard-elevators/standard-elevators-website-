import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CustomizationCarousel from "@/components/CustomizationCarousel";
import EngineeringServicesCarousel from "@/components/EngineeringServicesCarousel";
import PrimarySolutionsCarousel from "@/components/PrimarySolutionsCarousel";
import { 
  ArrowRight, Building2, Box, Stethoscope, ArrowUpFromLine, Layers, 
  Hammer, Zap, PaintRoller, Frame, Maximize
} from "lucide-react";
import { getPublishedServices, getServicesPageSettings } from "@/lib/firestore-data";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Elevator Solutions & Services | Standard Engineering Works Elevators",
  description:
    "Explore precision elevator solutions: Passenger Lifts, Machine-Room-Less (MRL) systems, Heavy-Duty Goods Lifts, Hospital Lifts, Hydraulic Elevators, and comprehensive engineering services.",
  path: "/services",
});

function getServiceIcon(slug: string, category?: string) {
  const cat = (category || "").toLowerCase();
  if (slug.includes("mrl") || cat.includes("mrl")) return <Building2 className="w-6 h-6" />;
  if (slug.includes("passenger") || cat.includes("passenger")) return <ArrowUpFromLine className="w-6 h-6" />;
  if (slug.includes("goods") || slug.includes("freight") || cat.includes("goods")) return <Box className="w-6 h-6" />;
  if (slug.includes("hospital") || slug.includes("stretcher") || cat.includes("hospital")) return <Stethoscope className="w-6 h-6" />;
  if (slug.includes("hydraulic") || cat.includes("hydraulic")) return <Layers className="w-6 h-6" />;
  return <Layers className="w-6 h-6" />;
}

// Data for Other Engineering Services
const OTHER_SERVICES = [
  { title: "Structural Fabrication", icon: <Hammer className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1541888086225-f641713cb094?q=80&w=800&auto=format&fit=crop", desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
  { title: "Glass & ACP Sheets", icon: <Maximize className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?q=80&w=800&auto=format&fit=crop", desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
  { title: "UPVC Window & Door", icon: <Frame className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", desc: "High-quality UPVC systems for residential and commercial spaces." },
  { title: "Renovation Works", icon: <PaintRoller className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop", desc: "Complete architectural and interior renovation services." },
  { title: "SS Railing", icon: <Layers className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=800&auto=format&fit=crop", desc: "Custom stainless steel handrails and balustrades." },
  { title: "Electrical House Wirings", icon: <Zap className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop", desc: "Complete residential and commercial electrical wiring systems." },
  { title: "Civil Works", icon: <Building2 className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop", desc: "Comprehensive civil construction and shaft preparation." },
];

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
      <section id="primary-solutions" className="py-24 md:py-32 bg-[#F7FAFD]">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {(settings.otherServices?.length > 0 ? settings.otherServices : OTHER_SERVICES).map((srv, idx) => {
              const bgImage = (srv as any).image || OTHER_SERVICES[idx % OTHER_SERVICES.length].image;
              const IconComp = (srv as any).icon || OTHER_SERVICES[idx % OTHER_SERVICES.length].icon;
              
              return (
                <div key={idx} className="group relative h-[140px] md:h-[280px] rounded-2xl md:rounded-2xl bg-white md:bg-transparent overflow-hidden border border-[#CBD5E1] md:border-none shadow-xs md:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,98,255,0.25)] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center md:block">
                  
                  {/* MOBILE VIEW: White Card Style */}
                  <div className="md:hidden flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#E5F3FF] flex items-center justify-center text-[#0A78F5] mb-3">
                      {IconComp}
                    </div>
                    <h3 className="text-[13px] font-bold text-[#0B1F3A] leading-tight">
                      {srv.title}
                    </h3>
                  </div>

                  {/* DESKTOP VIEW: Image Background Style */}
                  <div className="hidden md:block absolute inset-0">
                    <Image 
                      src={bgImage} 
                      alt={srv.title} 
                      fill 
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F38]/95 via-[#0B1F38]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white mb-4 group-hover:-translate-y-1.5 group-hover:bg-[#0062FF] group-hover:border-[#0062FF] transition-all duration-300 shadow-md">
                        {IconComp}
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:-translate-y-1.5 transition-transform duration-300 delay-[50ms]">
                        {srv.title}
                      </h3>
                      
                      <p className="text-[13px] text-slate-300 leading-relaxed font-light line-clamp-2 group-hover:-translate-y-1.5 transition-transform duration-300 delay-100">
                        {srv.desc}
                      </p>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0062FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
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
