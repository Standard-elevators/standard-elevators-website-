import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Passenger Lifts & Elevators | Standard Engineering Works Elevators",
  description:
    "Premium passenger elevators equipped with advanced microprocessor controls for smooth, safe, and silent vertical transport in residential and commercial buildings across Telangana & AP.",
  path: "/services/passenger-lifts",
  image: "/images/3d_apartments.jpg",
});

export default function PassengerLiftsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Passenger Lifts", url: "/services/passenger-lifts" },
  ]);

  const serviceSchema = getServiceSchema({
    name: "Passenger Elevators",
    description:
      "Dynamo Premium passenger elevators equipped with the latest microprocessor technology, complying with BIS safety regulations for uncompromising comfort and style.",
    url: "/services/passenger-lifts",
    image: "/images/3d_apartments.jpg",
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
              Residential & Commercial Systems
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight mb-5 md:mb-6 leading-[1.1] break-words whitespace-normal">
              Passenger <span className="text-[#38BDF8]">Lifts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-pale-steel/90 font-light leading-relaxed max-w-3xl">
              Dynamo Premium passenger elevators equipped with the latest VVVF drive technology, complying with strict safety regulations for smooth, quiet, and reliable vertical mobility.
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
                src="/images/3d_apartments.jpg" 
                alt="Architectural Passenger Elevator by Standard Engineering Works" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight mb-4">
                Architectural Integration & Silent Motion
              </h2>
              <p className="text-slate-muted leading-relaxed font-light mb-6 text-sm sm:text-base">
                Designed primarily for residential apartments, independent bungalows, and multi-story commercial complexes, our passenger elevators are tailored to seamlessly integrate into your building&apos;s architectural specifications. With capacities ranging from 5 to 20 persons, we provide flexible car configurations to match diverse traffic requirements.
              </p>
              
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0877F9] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </h3>
                <ul className="space-y-3 text-midnight font-medium text-xs sm:text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Capacity: 5 to 20 persons (340 kg to 1,380 kg)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Speed: 0.65 m/s to 1.50 m/s with VVVF smooth levelling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Drive Mechanism: Energy-efficient gearless or geared traction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Application: Low to high-rise structures (up to 15 stops)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/contact?service=Passenger+Lifts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0877F9] hover:bg-[#0666D8] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <span>Request Passenger Lift Quotation</span>
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
            Engineering Advantages
          </h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Custom Cabins</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Aesthetically designed cabins with brushed stainless steel, panoramic glass, and customized ambient ceiling lighting to match your interior styling.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Intelligent Controls</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Advanced 32-bit microprocessor controls ensure precise leveling accuracy, smooth acceleration, and reduced waiting times during peak traffic hours.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Automatic Rescue Device (ARD)</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Emergency battery backup automatically brings the cabin to the nearest floor and opens the doors safely during sudden power interruptions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
