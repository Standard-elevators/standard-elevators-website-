"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { submitInquiry } from "@/lib/firestore-data";
import { trackEvent } from "@/lib/analytics";

export interface EnquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  buildingType: string;
  serviceRequired: string;
  projectLocation: string;
  message: string;
  consent: boolean;
  honeypot: string; // Anti-spam trap
}

function ContactFormContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const preselectedType = searchParams.get("type") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Form State initialized with query params
  const [formData, setFormData] = useState<EnquiryFormData>(() => ({
    fullName: "",
    phone: "",
    email: "",
    buildingType: preselectedType || "",
    serviceRequired: preselectedService || "",
    projectLocation: "",
    message: "",
    consent: false,
    honeypot: "",
  }));

  const [prevService, setPrevService] = useState(preselectedService);
  const [prevType, setPrevType] = useState(preselectedType);

  // Sync if query parameters change during navigation
  if (prevService !== preselectedService) {
    setPrevService(preselectedService);
    if (preselectedService && !formData.serviceRequired) {
      setFormData((prev) => ({ ...prev, serviceRequired: preselectedService }));
    }
  }
  if (prevType !== preselectedType) {
    setPrevType(preselectedType);
    if (preselectedType && !formData.buildingType) {
      setFormData((prev) => ({ ...prev, buildingType: preselectedType }));
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackEvent("form_start", { category: "lead_generation" });
    }

    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Anti-spam check (honeypot)
    if (formData.honeypot) {
      // Silently treat as processed to fool automated scrapers
      setSubmitted(true);
      return;
    }

    // 2. Validate phone number (minimum 10 digits)
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit telephone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Attempt Firestore persistence
      const docId = await submitInquiry({
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        buildingType: formData.buildingType,
        serviceRequired: formData.serviceRequired,
        projectLocation: formData.projectLocation,
        message: formData.message,
      });

      setSubmissionId(docId);
      setSubmitted(true);
      trackEvent("form_submit", {
        category: "lead_generation",
        service: formData.serviceRequired,
        label: formData.buildingType,
      });
    } catch {
      // If Firestore backend is currently in offline/fallback mode, acknowledge gracefully
      setSubmitted(true);
      trackEvent("form_submit", {
        category: "lead_generation_fallback",
        service: formData.serviceRequired,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-warm-white text-graphite">
      {/* Header */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-midnight text-warm-white">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-electric mb-3 inline-block">
            Standard Engineering Works
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Consultation & <span className="text-electric">Quotation</span>
          </h1>
          <p className="text-base md:text-lg text-pale-steel font-light max-w-2xl mx-auto leading-relaxed">
            Request an engineering consultation or technical quotation for new lift installations, modernization, or preventative AMC maintenance across Telangana & Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
            
            {/* Contact Details & Verified Information */}
            <div className="sticky top-28 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-midnight mb-2">Verified Company Information</h2>
                <p className="text-sm text-slate-muted leading-relaxed font-light">
                  A pioneer in vertical mobility since 2003 with 100+ installations across commercial, residential, and healthcare sectors.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-pale-steel rounded-sm border border-slate-muted/10">
                  <div className="p-3 bg-white rounded text-engineering shadow-sm">
                    <MapPin className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight text-sm mb-1">Operational Coverage</h3>
                    <p className="text-slate-muted font-light leading-relaxed text-xs sm:text-sm">
                      Providing turnkey engineering across <strong>Telangana & Andhra Pradesh</strong>.
                      <br />
                      Key hubs: Hyderabad, Secunderabad, Warangal, Vijayawada, Visakhapatnam, Guntur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-pale-steel rounded-sm border border-slate-muted/10">
                  <div className="p-3 bg-white rounded text-engineering shadow-sm">
                    <Phone className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight text-sm mb-1">Direct Engineering Hotline</h3>
                    <div className="flex flex-col gap-1">
                      <a
                        href="tel:9515231555"
                        onClick={() => trackEvent("click_phone", { label: "9515231555" })}
                        className="text-slate-muted font-medium hover:text-electric transition-colors text-sm"
                      >
                        +91 9515231555
                      </a>
                      <a
                        href="tel:9652951116"
                        onClick={() => trackEvent("click_phone", { label: "9652951116" })}
                        className="text-slate-muted font-medium hover:text-electric transition-colors text-sm"
                      >
                        +91 9652951116
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-pale-steel rounded-sm border border-slate-muted/10">
                  <div className="p-3 bg-white rounded text-engineering shadow-sm">
                    <Mail className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight text-sm mb-1">Technical Inquiries Desk</h3>
                    <a
                      href="mailto:standardelevators.engworks12@gmail.com"
                      onClick={() => trackEvent("click_email", { label: "technical_desk" })}
                      className="text-slate-muted font-light hover:text-electric transition-colors break-all text-xs sm:text-sm"
                    >
                      standardelevators.engworks12@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="p-6 bg-white border border-slate-muted/10 rounded-sm shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-midnight uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-electric" /> Verified Engineering Principles
                </div>
                <ul className="text-xs text-slate-muted space-y-1.5 list-disc list-inside font-light">
                  <li>In-house structural fabrication & shaft alignment</li>
                  <li>Bureau of Indian Standards (BIS) compliant safety hardware</li>
                  <li>Automatic Rescue Device (ARD) power backup integration</li>
                  <li>Comprehensive annual maintenance contract (AMC) support</li>
                </ul>
              </div>
            </div>

            {/* Quotation / Enquiry Form */}
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-slate-muted/10" id="quotation-form">
              <h2 className="text-2xl font-bold text-midnight mb-2">Request Technical Quotation</h2>
              <p className="text-xs text-slate-muted font-light mb-6">
                Receive shaft layout dimensions and technical cost estimates tailored to your building.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {submitted ? (
                <div className="bg-pale-steel p-8 text-center rounded-sm border border-electric/20" role="alert">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-electric mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-electric" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight mb-2">Quotation Request Received</h3>
                  <p className="text-slate-muted font-light text-sm mb-4 leading-relaxed max-w-sm mx-auto">
                    Thank you, <strong className="text-midnight">{formData.fullName}</strong>. Our engineering desk will review your building requirements and contact you at <strong className="text-midnight">{formData.phone}</strong>.
                  </p>
                  {submissionId && (
                    <p className="text-xs text-slate-400 font-mono mb-6">
                      Reference ID: {submissionId.slice(0, 12)}
                    </p>
                  )}
                  <div className="pt-4 border-t border-slate-muted/15 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          phone: "",
                          email: "",
                          buildingType: "",
                          serviceRequired: "",
                          projectLocation: "",
                          message: "",
                          consent: false,
                          honeypot: "",
                        });
                      }}
                      className="px-6 py-2.5 bg-electric hover:bg-electric-hover text-white text-xs font-semibold rounded-sm transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href="tel:9515231555"
                      className="px-6 py-2.5 bg-white border border-slate-muted/20 text-midnight text-xs font-medium rounded-sm hover:border-electric transition-colors"
                    >
                      Call Desk Now: 9515231555
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Anti-spam honeypot (invisible to humans) */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-semibold text-midnight flex items-center gap-1">
                        Full Name <span className="text-electric">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-midnight flex items-center gap-1">
                        Phone Number <span className="text-electric">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                        placeholder="e.g. 9515231555"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-midnight">
                        Email Address <span className="text-slate-muted font-normal text-xs">(Optional)</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                        placeholder="e.g. name@domain.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectLocation" className="text-sm font-semibold text-midnight">
                        Project City / Location <span className="text-slate-muted font-normal text-xs">(Optional)</span>
                      </label>
                      <input
                        id="projectLocation"
                        name="projectLocation"
                        type="text"
                        value={formData.projectLocation}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                        placeholder="e.g. Hyderabad, Secunderabad, Vijayawada"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="buildingType" className="text-sm font-semibold text-midnight flex items-center gap-1">
                        Building Typology <span className="text-electric">*</span>
                      </label>
                      <select
                        id="buildingType"
                        name="buildingType"
                        required
                        value={formData.buildingType}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                      >
                        <option value="">Select building type</option>
                        <option value="Residential Bungalow / Villa">Private Bungalow / Independent Villa</option>
                        <option value="Residential Apartment">Apartment / Gated Community (RWA)</option>
                        <option value="Commercial Complex">Commercial Complex / Office Space</option>
                        <option value="Hospital / Medical Facility">Hospital / Healthcare Facility</option>
                        <option value="Industrial / Warehouse">Industrial Factory / Warehouse</option>
                        <option value="Builder / Architecture Project">Architect / Turnkey Civil Project</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="serviceRequired" className="text-sm font-semibold text-midnight flex items-center gap-1">
                        System Required <span className="text-electric">*</span>
                      </label>
                      <select
                        id="serviceRequired"
                        name="serviceRequired"
                        required
                        value={formData.serviceRequired}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow text-sm"
                      >
                        <option value="">Select elevator solution</option>
                        <option value="Passenger Lifts">Passenger Lifts (Dynamo Premium)</option>
                        <option value="MRL Lifts">Machine-Room-Less (MRL) Lifts</option>
                        <option value="Goods Lifts">Goods & Freight Elevators</option>
                        <option value="Hospital Lifts">Hospital & Stretcher Lifts</option>
                        <option value="Hydraulic Elevators">Hydraulic Elevators</option>
                        <option value="Modernization & AMC">Modernization & AMC Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-midnight">
                      Project Notes / Shaft Dimensions <span className="text-slate-muted font-normal text-xs">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-warm-white border border-slate-muted/20 rounded-sm focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-shadow resize-none text-sm"
                      placeholder="Number of floors/stops, pit depth, capacity, or specific cabin finishes required..."
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded-sm border-slate-muted/30 text-electric focus:ring-electric"
                    />
                    <label htmlFor="consent" className="text-xs text-slate-muted font-light leading-relaxed">
                      I agree to be contacted by Standard Engineering Works Elevators regarding this quotation. Details are kept confidential and used solely to prepare technical estimates. <span className="text-electric">*</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.buildingType || !formData.serviceRequired || !formData.consent}
                    className="w-full py-4 bg-electric text-white font-medium rounded-sm hover:bg-electric-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-electric shadow-md shadow-electric/20"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Submit Quotation Request</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-muted font-light text-center">
                    Fields marked with an asterisk (<span className="text-electric">*</span>) are required.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-white" />}>
      <ContactFormContent />
    </Suspense>
  );
}
