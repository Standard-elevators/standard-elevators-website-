function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Cog, Maximize, Activity, LayoutGrid } from "lucide-react";
import { getPublishedServices } from "@/lib/firestore-data";
import { constructMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const services = await getPublishedServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return constructMetadata({
      title: "Elevator Service | Standard Engineering Works Elevators",
      description: "Custom elevator engineering, installation, and modernization solutions.",
      path: `/services/${slug}`,
    });
  }

  return constructMetadata({
    title: `${service.title} | Standard Engineering Works Elevators`,
    description: service.description,
    path: `/services/${service.slug}`,
    image: service.imageUrl,
  });
}

function getExtendedServiceContent(slug: string) {
  switch (slug) {
    case "mrl-lifts":
      return {
        applications: ["Commercial Buildings", "High Rise & Low Rise", "Residential Apartments"],
        features: [
          "No dedicated machine room required",
          "Multiple cabin and door options",
          "Automatic SS glass doors / manual telescopic / swing doors",
          "Gearless traction for superior performance",
          "Environmentally friendly and cost-effective",
        ],
        benefitTitle: "Architectural Freedom & Efficiency",
        benefitText: "MRL elevators eliminate the need for a bulky machine room, allowing architects to optimize building space. The gearless traction system ensures a remarkably smooth ride and energy efficiency.",
      };
    case "passenger-lifts":
      return {
        applications: ["Residential Apartments", "Commercial Buildings", "Old Building Retrofits"],
        features: [
          "Electric and hydraulic system options",
          "Standard or optional custom interiors",
          "Multiple cabin and door configurations",
          "Advanced safety compliance",
          "Fast, safe, and reliable travel",
        ],
        benefitTitle: "Premium Passenger Mobility",
        benefitText: "Designed for comfort and style, our passenger elevators are equipped with the latest microprocessor technology to provide seamless, safe, and rapid vertical transport in any residential or commercial setting.",
      };
    case "goods-lifts":
      return {
        applications: ["Industrial Facilities", "Warehouses", "Commercial Buildings", "Hospitals", "Restaurants"],
        features: [
          "Suitable for heavy-duty transport",
          "Electric and hydraulic operating systems",
          "Reinforced structural durability",
          "Continuous heavy lifting capability",
          "Reliable payload transport",
        ],
        benefitTitle: "Heavy Structural Engineering & Payload Integrity",
        benefitText: "Our freight elevators are built specifically to withstand rigorous loading and repetitive heavy-duty duty-cycles. Equipped with reinforced floor platforms and rugged guide rails, they safeguard both personnel and materials.",
      };
    case "hospital-lifts":
      return {
        applications: ["Hospitals", "Medical Centers", "Healthcare Facilities"],
        features: [
          "Designed for hospital beds/stretchers",
          "Smooth acceleration and deceleration",
          "Gearless & geared system options",
          "Multiple cabin and door options",
          "Mission-critical reliability",
        ],
        benefitTitle: "Precision & Patient Care",
        benefitText: "Engineered specifically for healthcare environments, these lifts ensure the smooth, precise, and safe transport of patients, medical equipment, and personnel without jarring movements.",
      };
    case "hydraulic-elevators":
      return {
        applications: ["Low-rise Residential Apartments", "Commercial Buildings", "Restaurants"],
        features: [
          "Direct landing system",
          "Automatic rescue device",
          "Reduced overhead and pit requirements",
          "Hydraulic operating system",
          "Customizable interior according to client",
        ],
        benefitTitle: "Space-Saving Hydraulic Performance",
        benefitText: "Ideal for low-rise applications where space is at a premium. The hydraulic system requires less overhead space and pit depth, offering easy maintenance and highly reliable vertical transport.",
      };
    default:
      return {
        applications: ["Commercial", "Residential", "Industrial"],
        features: [
          "Custom engineering options",
          "Premium safety features",
          "Durable construction",
        ],
        benefitTitle: "Engineered for Excellence",
        benefitText: "Built to exact architectural standards to ensure reliable and safe operation.",
      };
  }
}

export default async function DynamicServicePage({ params }: Props) {
  const { slug } = await params;
  const services = await getPublishedServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const extendedContent = getExtendedServiceContent(slug);

  // Technical Specs from defaultData.ts (fallback if array is empty)
  const allSpecs = service.specs || [];
  const technicalSpecs = allSpecs.length > 0 ? allSpecs.slice(1) : [];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title, url: `/services/${service.slug}` },
  ]);

    const waMessage = `Hello Standard Engineering Works, I have visited your website and would like to inquire about ${service.title}. Please provide more information and a quote.`;
  const waLink = `https://wa.me/919515231555?text=${encodeURIComponent(waMessage)}`;
  const serviceSchema = getServiceSchema({
    name: service.title,
    description: service.description,
    url: `/services/${service.slug}`,
    image: service.imageUrl,
  });

  return (
    <div className="flex flex-col w-full bg-white text-[#0A2342] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-44 lg:pb-28 bg-[#06172B] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.imageUrl || "/hero-elevator.jpg"}
            alt={service.title}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06172B] via-[#06172B]/80 to-transparent" />
        </div>
        
        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[12px] md:text-sm font-bold uppercase tracking-widest text-[#38BDF8] hover:text-white transition-colors mb-8 md:mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>
          
          <div className="max-w-[900px]">
            <span className="block text-xs md:text-sm font-bold uppercase tracking-widest text-[#0877F9] mb-3 md:mb-4">
              {service.category || "Elevator Solution"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white mb-5 md:mb-6 leading-[1.1] break-words whitespace-normal">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] font-light leading-relaxed max-w-3xl mb-8">
              {service.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#0877F9] hover:bg-[#0666D8] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_16px_rgba(8,119,249,0.4)] active:scale-95"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_16px_rgba(37,211,102,0.35)] active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SERVICE VISUAL + INTRODUCTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#0A2342] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E2E8F0]">
              <Image
                src={service.imageUrl || "/hero-elevator.jpg"}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A2342] mb-6">
                {extendedContent.benefitTitle}
              </h2>
              <div className="prose prose-lg text-[#475569] leading-relaxed">
                <p>{extendedContent.benefitText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-[#0A2342] mb-4 flex items-center gap-3">
              <Activity className="w-7 h-7 text-[#0877F9]" />
              Key Features
            </h2>
            <p className="text-[#64748B] text-lg">
              Engineered with precision to deliver optimal performance and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedContent.features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#0877F9]" />
                </div>
                <p className="text-[#0A2342] font-semibold">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS & USES + TECHNICAL SPECS */}
      <section className="py-16 md:py-24 bg-white border-t border-[#E2E8F0]">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Applications & Uses */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A2342] mb-8 flex items-center gap-3">
                <Maximize className="w-6 h-6 text-[#0877F9]" />
                Applications & Uses
              </h2>
              <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0]">
                <ul className="space-y-4">
                  {extendedContent.applications.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#0877F9]" />
                      <span className="text-[#475569] font-medium text-lg">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A2342] mb-8 flex items-center gap-3">
                <Cog className="w-6 h-6 text-[#0877F9]" />
                Technical Specifications
              </h2>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                {technicalSpecs.length > 0 ? (
                  <div className="divide-y divide-[#E2E8F0]">
                    {technicalSpecs.map((spec, i) => {
                      // Attempt to split spec string into Key: Value if possible, otherwise just show it.
                      // Examples: "500-5000 kg", "0.3 to 1.0 m/s", "Up to 15 stops", "Electric & Hydraulic"
                      // Since they don't have colons, we'll just render them beautifully.
                      return (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white hover:bg-[#F8FAFC] transition-colors">
                          <LayoutGrid className="w-5 h-5 text-[#94A3B8] shrink-0" />
                          <span className="text-[#0A2342] font-semibold">{spec}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-sm text-[#64748B]">Standard engineering factory specifications apply. Contact us for custom dimensions.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REQUEST QUOTE CTA */}
      <section className="py-20 md:py-24 bg-[#0A2342] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0877F9]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to integrate this solution?
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto mb-10">
            Contact our engineering team for full specifications, architectural integration details, and an accurate quotation for {service.title}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0877F9] hover:bg-[#38BDF8] text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(8,119,249,0.4)] active:scale-95"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(37,211,102,0.4)] active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
