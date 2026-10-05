import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Industrial Goods & Freight Lifts | Standard Engineering Works",
  description:
    "Heavy-duty CARVI and CARGO1 industrial goods lifts engineered for manufacturing plants, logistics hubs, and warehouses across Telangana & Andhra Pradesh.",
  path: "/services/goods-lifts",
  image: "/images/3d_industrial.jpg",
});

export default function GoodsLiftsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Goods Lifts", url: "/services/goods-lifts" },
  ]);

  const serviceSchema = getServiceSchema({
    name: "Goods & Freight Lifts",
    description:
      "Heavy-duty CARVI and CARGO1 industrial elevators designed for rigorous factory and warehouse material handling, offering robust durability and payload capacities up to 5,000 kg.",
    url: "/services/goods-lifts",
    image: "/images/3d_industrial.jpg",
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
              Heavy Material Transport
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight mb-5 md:mb-6 leading-[1.1] break-words whitespace-normal">
              Goods & <span className="text-[#38BDF8]">Freight Lifts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-pale-steel/90 font-light leading-relaxed max-w-3xl">
              Engineered for continuous heavy lifting under demanding industrial conditions. CARVI and CARGO1 elevator systems deliver reinforced structural durability and reliable payload transport.
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
                src="/images/3d_industrial.jpg" 
                alt="Industrial Goods Elevator by Standard Engineering Works" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight mb-4">
                Heavy Structural Engineering & Payload Integrity
              </h2>
              <p className="text-slate-muted leading-relaxed font-light mb-6 text-sm sm:text-base">
                Our freight elevators are built specifically to withstand rigorous forklift loading, pallet trucks, and repetitive heavy duty duty-cycles. Equipped with reinforced floor platforms, heavy gauge steel side panels, and rugged guide rails, they safeguard both personnel and materials.
              </p>
              
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0877F9] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </h3>
                <ul className="space-y-3 text-midnight font-medium text-xs sm:text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Payload Capacity: 500 kg to 5,000 kg</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Speed: 0.3 m/s to 1.0 m/s</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Drive Systems: Heavy-duty traction or hydraulic cylinders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Doors: Multi-panel telescopic sliding or manual collapsible gates</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/contact?service=Goods+Lifts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0877F9] hover:bg-[#0666D8] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <span>Request Industrial Goods Lift Quotation</span>
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
            Industrial Performance Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Reinforced Flooring</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Heavy chequered steel plate flooring engineered to resist deformation under heavy concentrated wheel loads of forklifts and industrial hand trucks.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Overload Protection</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Electronic load cell weighing sensors prevent operation when rated capacity is exceeded, ensuring full compliance with factory safety standards.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Precision Leveling</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Accurate floor stopping eliminates tripping hazards and uneven threshold bumps, allowing pallet trucks to roll on and off smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
