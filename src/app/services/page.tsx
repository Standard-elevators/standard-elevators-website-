import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CustomizationCarousel from "@/components/CustomizationCarousel";
import EngineeringServicesCarousel from "@/components/EngineeringServicesCarousel";
import { 
  ArrowRight, Building2, Box, Stethoscope, ArrowUpFromLine, Layers, 
  Wrench, Settings, Hammer, RotateCw, Headset, Construction,
  DoorOpen, Settings2, ShieldCheck, Component, GripHorizontal, 
  Zap, PaintRoller, Frame, Maximize
} from "lucide-react";
import { getPublishedServices } from "@/lib/firestore-data";
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

// Data for Engineering Services
const ENGINEERING_SERVICES = [
  {
    title: "New Installation",
    icon: <Construction className="w-6 h-6" />,
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
  },
  {
    title: "Modernization",
    icon: <RotateCw className="w-6 h-6" />,
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
  },
  {
    title: "Repairs",
    icon: <Wrench className="w-6 h-6" />,
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
  },
  {
    title: "Maintenance",
    icon: <Settings className="w-6 h-6" />,
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
  },
  {
    title: "Aftersales Services",
    icon: <Headset className="w-6 h-6" />,
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
  }
];

// Data for Customization & Components
const CUSTOMIZATION = [
  { title: "Cabin Models", icon: <Component className="w-5 h-5" />, items: ["Standard SS", "Premium Glass", "Custom Designs"] },
  { title: "Door Options", icon: <DoorOpen className="w-5 h-5" />, items: ["Collapsible Doors", "Imperforated Doors", "Swing Doors", "Manual Telescopic", "S.S. Auto Door", "Glass Doors"] },
  { title: "Control & Safety", icon: <ShieldCheck className="w-5 h-5" />, items: ["Micro Processor Control", "ARD (Auto Rescue)", "Safety Gears", "COPs & LOPs"] },
  { title: "Machinery", icon: <Settings2 className="w-5 h-5" />, items: ["Geared Machines", "Gearless Machines", "Hydraulic Drives"] },
  { title: "Interiors", icon: <GripHorizontal className="w-5 h-5" />, items: ["Flooring Options", "Ceiling Designs", "Custom Handles", "LED Lighting"] },
];

// Data for Other Engineering Services
const OTHER_SERVICES = [
  { title: "Structural Fabrication", icon: <Hammer className="w-5 h-5" />, desc: "Heavy-duty MS and SS structural fabrication for elevator shafts and commercial buildings." },
  { title: "Glass & ACP Sheets", icon: <Maximize className="w-5 h-5" />, desc: "Premium architectural glass and Aluminum Composite Panel exterior cladding." },
  { title: "UPVC Window & Door", icon: <Frame className="w-5 h-5" />, desc: "High-quality UPVC systems for residential and commercial spaces." },
  { title: "Renovation Works", icon: <PaintRoller className="w-5 h-5" />, desc: "Complete architectural and interior renovation services." },
  { title: "SS Railing", icon: <Layers className="w-5 h-5" />, desc: "Custom stainless steel handrails and balustrades." },
  { title: "Electrical House Wirings", icon: <Zap className="w-5 h-5" />, desc: "Complete residential and commercial electrical wiring systems." },
  { title: "Civil Works", icon: <Building2 className="w-5 h-5" />, desc: "Comprehensive civil construction and shaft preparation." },
];

export default async function ServicesPage() {
  const services = await getPublishedServices();
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
      <section className="relative w-full min-h-[68vh] md:min-h-[73vh] lg:min-h-[78vh] max-h-[900px] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#06172B]">
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
      <section className="py-24 md:py-32 bg-[#F7FAFD]">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2342] mb-6">
              Primary Elevator Solutions
            </h2>
            <p className="text-[#475569] text-base md:text-lg leading-relaxed">
              Discover our complete range of premium vertical mobility products, manufactured and installed to exact architectural standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => {
              const icon = getServiceIcon(service.slug, service.category);
              return (
                <div
                  key={service.id || service.slug}
                  id={service.slug}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-[0_4px_20px_rgba(10,35,66,0.06)] hover:shadow-[0_20px_40px_rgba(8,119,249,0.12)] hover:border-[#0877F9]/30 transition-all duration-500"
                >
                  <div className="relative w-full aspect-[16/10] bg-[#06172B] overflow-hidden">
                    <Image
                      src={service.imageUrl || "/hero-elevator.jpg"}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/90 via-[#0A2342]/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">
                        0{index + 1} &mdash; {service.category || "Lift"}
                      </span>
                      <div className="w-10 h-10 bg-[#0877F9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0877F9]/30 group-hover:scale-110 transition-transform duration-500">
                        {icon}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#0A2342] mb-3 group-hover:text-[#0877F9] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#475569] text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#F1F5F9]">
                      <Link
                        href={`/services/${service.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A2342] hover:bg-[#0877F9] text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0A2342] text-sm font-semibold rounded-lg transition-colors"
                      >
                        Quote
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: ENGINEERING SERVICES */}
      <EngineeringServicesCarousel />

      {/* SECTION 4: ELEVATOR CUSTOMIZATION & COMPONENTS */}
      <CustomizationCarousel />

      {/* SECTION 5: OTHER ENGINEERING SERVICES */}
      <section className="relative py-20 md:py-28 overflow-hidden border-t border-white/10">
        
        {/* Realistic Architectural Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg_engineering.jpg"
            alt="Engineering and Structural Background"
            fill
            className="object-cover"
            sizes="100vw"
            quality={60}
          />
          {/* Deep Corporate Blue Gradient Overlay to ensure text and cards remain visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#003A8C]/95 via-[#00225A]/95 to-[#001033]/95 mix-blend-multiply"></div>
          
          {/* Soft ambient light to make the overlay feel premium */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001033] via-transparent to-transparent opacity-80"></div>
        </div>
        


        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-16 md:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#38BDF8] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(56,189,248,0.1)]">
              Structural & Fabrication
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Other Engineering Services</h2>
            <p className="text-blue-100 text-lg md:text-xl font-light leading-relaxed">
              Our engineering expertise extends beyond elevators. We provide a range of structural and architectural services including heavy-duty fabrication, civil works, and premium exterior cladding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OTHER_SERVICES.map((srv, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-transparent hover:border-[#0062FF]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,98,255,0.4)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                {/* Card Top Highlight */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#0062FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="text-[#0062FF] mb-6 p-4 bg-slate-50 border border-slate-100 inline-block rounded-xl group-hover:scale-110 group-hover:bg-[#0062FF] group-hover:text-white transition-all duration-300">{srv.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{srv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">{srv.desc}</p>
              </div>
            ))}
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
