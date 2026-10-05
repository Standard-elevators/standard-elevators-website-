import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | Standard Engineering Works Elevators",
  description:
    "Privacy Policy for Standard Engineering Works Elevators, detailing how we collect, handle, and safeguard customer and client data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-text uppercase tracking-widest mb-10">
          Last Updated: October 2026
        </p>

        <div className="space-y-8 text-body-text leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">1. Information Collection</h2>
            <p>
              Standard Engineering Works Elevators collects information you voluntarily provide through our website consultation forms, quotation requests, and direct communications. This typically includes your full name, telephone number, email address, building typology, and project requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">2. Purpose of Processing</h2>
            <p>
              Information gathered is strictly utilized to prepare engineering quotations, schedule technical site surveys, coordinate elevator maintenance schedules, and provide professional customer assistance throughout Telangana and Andhra Pradesh.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">3. Data Security & Retention</h2>
            <p>
              We implement stringent technical security measures to protect customer communications against unauthorized access, loss, or disclosure. We never sell, lease, or monetize your contact or project information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-deep-navy mb-3">4. Contact Inquiries</h2>
            <p>
              If you have any questions or requests concerning your personal information, please contact our administrative desk at standardelevators.engworks12@gmail.com or call +91 9515231555.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
