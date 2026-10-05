import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Hospital & Stretcher Lifts | Standard Engineering Works Elevators",
  description:
    "HOSPITRY series hospital and stretcher elevators engineered with deep cabins, ultra-smooth acceleration, and precision levelling for healthcare facilities in Telangana and AP.",
  path: "/services/hospital-lifts",
  image: "/images/3d_healthcare_v2.jpg",
});

export default function HospitalLiftsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Hospital Lifts", url: "/services/hospital-lifts" },
  ]);

  const serviceSchema = getServiceSchema({
    name: "Hospital & Stretcher Lifts",
    description:
      "Mission-critical HOSPITRY hospital elevators designed for the smooth, precise, and jerk-free transport of patients, stretcher beds, and medical teams.",
    url: "/services/hospital-lifts",
    image: "/images/3d_healthcare_v2.jpg",
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
              Critical Care Mobility
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight mb-5 md:mb-6 leading-[1.1] break-words whitespace-normal">
              Hospital & <span className="text-[#38BDF8]">Stretcher Lifts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-pale-steel/90 font-light leading-relaxed max-w-3xl">
              Mission-critical vertical mobility designed to transport hospital beds, stretchers, and critical medical equipment safely, smoothly, and with millimeter floor precision.
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
                src="/images/3d_healthcare_v2.jpg" 
                alt="Hospital Bed and Stretcher Elevator by Standard Engineering Works" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight mb-4">
                Jerk-Free Transit for Critical Healthcare
              </h2>
              <p className="text-slate-muted leading-relaxed font-light mb-6 text-sm sm:text-base">
                In clinical environments, elevator performance directly affects patient comfort and emergency response. Our HOSPITRY series provides deep, elongated cabin dimensions with stainless-steel bumper rails, easy-clean antibacterial surfaces, and micro-levelling to roll stretchers smoothly over thresholds.
              </p>
              
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0877F9] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Technical Specifications</span>
                </h3>
                <ul className="space-y-3 text-midnight font-medium text-xs sm:text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Capacity: 8 to 26 Persons (1,000 kg to 2,000 kg)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Speed: 0.5 m/s to 1.5 m/s with gentle start and stop curves</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Cabin Dimensions: Extended depth accommodating standard hospital beds</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#0877F9] shrink-0" />
                    <span>Emergency Priority: Key-operated Code Blue medical priority control</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/contact?service=Hospital+Lifts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0877F9] hover:bg-[#0666D8] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <span>Request Healthcare Lift Quotation</span>
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
            Specialized Healthcare Engineering
          </h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Millimeter Levelling</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Advanced floor sensors ensure zero vertical step gap when stopping, protecting sensitive post-operative patients and wheels from sudden bumps.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Emergency Power Backup</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Integrated automatic rescue device connects with hospital generator supply to ensure critical transit is never stranded between floors.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-midnight mb-2">Protective Bumpers</h3>
              <p className="text-slate-muted text-xs sm:text-sm font-light leading-relaxed">
                Dual-height stainless steel wall bumper rails protect cabin finishes and prevent equipment jolts during stretcher boarding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
