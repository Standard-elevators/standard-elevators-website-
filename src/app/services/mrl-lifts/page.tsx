import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Machine Room-Less (MRL) Elevators | Standard Engineering Works",
  description:
    "Cost-effective and energy-efficient MRL elevators utilizing gearless permanent-magnet synchronous traction. Eliminates penthouse machine rooms to maximize usable building space.",
  path: "/services/mrl-lifts",
  image: "/images/3d_commercial.jpg",
});

export default function MRLLiftsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "MRL Lifts", url: "/services/mrl-lifts" },
  ]);

  const serviceSchema = getServiceSchema({
    name: "Machine-Room-Less (MRL) Elevators",
    description:
      "MANOR-C5 Machine Room-Less elevators utilizing advanced gearless traction technology for high energy savings, reduced overhead requirements, and smooth rides.",
    url: "/services/mrl-lifts",
    image: "/images/3d_commercial.jpg",
  });

  return (
    <div className="flex flex-col w-full bg-warm-white text-graphite min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-44 lg:pb-28 bg-[#08172B] text-warm-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-[12px] md:text-sm font-bold uppercase tracking-widest text-[#38BDF8] hover:text-white transition-colors mb-8 md:mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>
          <div className="max-w-[900px]">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0877F9] block mb-3 md:mb-4">
              Next-Generation Technology
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight mb-5 md:mb-6 leading-[1.1] break-words whitespace-normal">
              MRL <span className="text-[#38BDF8]">Elevators</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-pale-steel/90 font-light leading-relaxed max-w-3xl">
              Highly cost-effective and environmentally-friendly Machine Room-Less elevators utilizing advanced permanent-magnet synchronous gearless traction technology.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="order-2 md:order-1 relative aspect-[4/3] rounded-2xl overflow-hidden bg-pale-steel shadow-lg border border-slate-200">
              <Image 
                src="/images/3d_commercial.jpg" 
                alt="Machine Room Less Elevator Installation by Standard Engineering Works" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight mb-4">
                Space-Saving Hoistway Innovation
              </h2>
              <p className="text-slate-muted leading-relaxed font-light mb-6 text-sm sm:text-base">
                By eliminating the requirement for a dedicated rooftop machine room, MRL elevators maximize rentable carpet area and significantly reduce civil construction costs. The compact gearless motor is mounted directly within the hoistway shaft, delivering superior operating efficiency and whisper-quiet operation.
              </p>
              
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0877F9] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </h3>
                <ul className="space-y-3 text-midnight font-medium text-xs sm:text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Capacity: 6 to 20 persons (408 kg to 1,380 kg)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Speed: 1.0 m/s to 1.50 m/s</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Energy Efficiency: Up to 40% power reduction vs geared motors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Power: 3-phase, 415V, 50Hz with VVVF regulation</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/contact?service=MRL+Lifts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0877F9] hover:bg-[#0666D8] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <span>Request MRL Lift Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 md:py-20 bg-pale-steel border-t border-slate-muted/10">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-midnight mb-10 text-center">
            Key Architectural Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Zero Penthouse Structure</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Preserve architectural sightlines and terrace utility without constructing an unsightly concrete machine room on your building&apos;s roof.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Lower Operating Costs</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Permanent magnet synchronous motors consume substantially less electrical power and require minimal lubricant maintenance over their operational lifetime.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Smooth Ride Quality</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Advanced traction sheaves combined with precision electronic controllers deliver jerk-free starts, silent cruising, and millimeter-level floor stops.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
