import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | Standard Engineering Works Elevators",
  description:
    "Terms of service and engineering engagement conditions for Standard Engineering Works Elevators across Telangana and Andhra Pradesh.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="bg-warm-white py-16 sm:py-24">
      <div className="site-container px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-blue hover:text-accent-blue-hover mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-deep-navy mb-4 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-text uppercase tracking-widest mb-10">
          Last Updated: October 2026
        </p>

        <div className="space-y-8 text-body-text leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">1. Scope of Technical Services</h2>
            <p>
              Standard Engineering Works Elevators provides vertical transport design, structural lift shaft consultations, installation, modernization, and programmed annual maintenance contracts (AMC) for passenger, MRL, hospital, and goods elevators.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">2. Quotations & Technical Feasibility</h2>
            <p>
              Initial estimates provided through the online quotation estimator are provisional and subject to structural site surveys, civil shaft verification, electrical load clearance, and municipal regulatory compliance approvals.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">3. Safety Standards & Compliance</h2>
            <p>
              All manufacturing, installation, and modernization operations adhere to applicable Bureau of Indian Standards (BIS) and regional electrical safety regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">4. Jurisdiction & Governance</h2>
            <p>
              These terms and all commercial engineering agreements are governed by the laws of India and subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
