"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { submitInquiry } from "@/lib/firestore-data";
import { trackEvent } from "@/lib/analytics";
import Image from "next/image";

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
    <div className="flex flex-col w-full bg-[#F7F9FC] text-[#102A43]">
      
      {/* 1. PREMIUM CONTACT HERO */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#061426]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg_engineering.jpg"
            alt="Engineering Background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#061426]/80 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        </div>
        
        <div className="site-container relative z-10 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0062FF]/30 bg-[#0062FF]/10 backdrop-blur-sm mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#00E5FF]">
              Standard Engineering Works
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Consultation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0062FF]">Quotation</span>
          </h1>
          <p className="text-base md:text-lg text-[#8FA2B8] font-light leading-relaxed max-w-2xl mx-auto">
            Request an engineering consultation or technical quotation for new lift installations, modernization, or preventative AMC maintenance across Telangana & Andhra Pradesh.
          </p>
        </div>


      </section>

      {/* MAIN CONTENT AREA */}
      <section className="pb-24 pt-10 md:pt-16">
        <div className="site-container px-6">
          <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 max-w-7xl mx-auto items-start">
            
            {/* ========================================================================= */}
            {/* LEFT: INFORMATION AREA */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-black text-[#102A43] mb-3 tracking-tight">Verified Company Information</h2>
                <p className="text-[#64748B] leading-relaxed font-light text-[15px]">
                  A pioneer in vertical mobility since 2003 with 100+ installations across commercial, residential, and healthcare sectors.
                </p>
              </div>

              <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#E2E8F0] to-transparent">
                <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                  
                  {/* Item 1 */}
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] border border-[#0062FF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0062FF] group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-[#0062FF] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#102A43] text-sm tracking-wide uppercase mb-1">Operational Coverage</h3>
                      <p className="text-[#64748B] font-light leading-relaxed text-sm">
                        Providing turnkey engineering across <strong>Telangana & Andhra Pradesh</strong>.
                        <br className="hidden sm:block" />
                        <span className="text-[13px] mt-1 block">Key hubs: Hyderabad, Secunderabad, Warangal, Vijayawada, Visakhapatnam, Guntur.</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

                  {/* Item 2 */}
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] border border-[#0062FF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0062FF] group-hover:text-white transition-colors duration-300">
                      <Phone className="w-5 h-5 text-[#0062FF] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#102A43] text-sm tracking-wide uppercase mb-2">Direct Engineering Hotline</h3>
                      <div className="flex flex-col gap-1.5">
                        <a href="tel:9515231555" onClick={() => trackEvent("click_phone", { label: "9515231555" })} className="text-[#102A43] font-medium hover:text-[#0062FF] transition-colors text-[15px] flex items-center gap-2">
                          +91 9515231555
                        </a>
                        <a href="tel:9652951116" onClick={() => trackEvent("click_phone", { label: "9652951116" })} className="text-[#102A43] font-medium hover:text-[#0062FF] transition-colors text-[15px] flex items-center gap-2">
                          +91 9652951116
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

                  {/* Item 3 */}
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] border border-[#0062FF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0062FF] group-hover:text-white transition-colors duration-300">
                      <Mail className="w-5 h-5 text-[#0062FF] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#102A43] text-sm tracking-wide uppercase mb-1">Technical Inquiries Desk</h3>
                      <a href="mailto:standardelevators.engworks12@gmail.com" onClick={() => trackEvent("click_email", { label: "technical_desk" })} className="text-[#64748B] font-light hover:text-[#0062FF] transition-colors break-all text-sm">
                        standardelevators.engworks12@gmail.com
                      </a>
                    </div>
                  </div>

                </div>
              </div>


            </div>

            {/* ========================================================================= */}
            {/* RIGHT: QUOTATION FORM AREA */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7" id="quotation-form">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(6,25,45,0.06)] border border-[#E2E8F0] relative overflow-hidden">
                
                {/* Subtle blueprint grid background inside form container */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#0062FF 1px, transparent 1px), linear-gradient(90deg, #0062FF 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10 mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-[#102A43] tracking-tight mb-2">Request Technical Quotation</h2>
                  <p className="text-sm text-[#64748B] font-light leading-relaxed">
                    Receive shaft layout dimensions and technical cost estimates tailored to your building.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-3 relative z-10">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}

                {submitted ? (
                  <div className="bg-[#F8FAFC] p-10 text-center rounded-2xl border border-[#E2E8F0] relative z-10 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#0062FF] mx-auto mb-6 shadow-sm border border-[#E2E8F0]">
                      <CheckCircle2 className="w-10 h-10 text-[#0062FF]" />
                    </div>
                    <h3 className="text-2xl font-black text-[#102A43] mb-3">Quotation Request Received</h3>
                    <p className="text-[#64748B] font-light text-[15px] mb-6 leading-relaxed max-w-sm mx-auto">
                      Thank you, <strong className="text-[#102A43] font-medium">{formData.fullName}</strong>. Our engineering desk will review your building requirements and contact you at <strong className="text-[#102A43] font-medium">{formData.phone}</strong>.
                    </p>
                    {submissionId && (
                      <div className="inline-block px-4 py-2 bg-[#E2E8F0]/50 rounded-lg text-xs text-[#475569] font-mono mb-8">
                        Reference ID: {submissionId.slice(0, 12)}
                      </div>
                    )}
                    <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            fullName: "", phone: "", email: "", buildingType: "", serviceRequired: "", projectLocation: "", message: "", consent: false, honeypot: "",
                          });
                        }}
                        className="px-8 py-3.5 bg-[#0062FF] hover:bg-[#0052D6] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#0062FF]/20"
                      >
                        Submit Another Inquiry
                      </button>
                      <a
                        href="tel:9515231555"
                        className="px-8 py-3.5 bg-white border border-[#E2E8F0] text-[#102A43] text-sm font-bold rounded-xl hover:border-[#0062FF] hover:text-[#0062FF] transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" /> Call Desk Now
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                    {/* Anti-spam honeypot (invisible to humans) */}
                    <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-1">
                          Full Name <span className="text-[#0062FF]">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          required
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] placeholder-[#94A3B8]"
                          placeholder="e.g. Ramesh Kumar"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-1">
                          Phone Number <span className="text-[#0062FF]">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] placeholder-[#94A3B8]"
                          placeholder="e.g. 9515231555"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider">
                          Email Address <span className="text-[#94A3B8] font-normal normal-case ml-1">(Optional)</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] placeholder-[#94A3B8]"
                          placeholder="name@domain.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="projectLocation" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider">
                          Project City / Location <span className="text-[#94A3B8] font-normal normal-case ml-1">(Optional)</span>
                        </label>
                        <input
                          id="projectLocation"
                          name="projectLocation"
                          type="text"
                          value={formData.projectLocation}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] placeholder-[#94A3B8]"
                          placeholder="e.g. Hyderabad, Vijayawada"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="buildingType" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-1">
                          Building Typology <span className="text-[#0062FF]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="buildingType"
                            name="buildingType"
                            required
                            value={formData.buildingType}
                            onChange={handleInputChange}
                            className="w-full p-4 pr-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] appearance-none"
                          >
                            <option value="">Select building type</option>
                            <option value="Residential Bungalow / Villa">Private Bungalow / Independent Villa</option>
                            <option value="Residential Apartment">Apartment / Gated Community (RWA)</option>
                            <option value="Commercial Complex">Commercial Complex / Office Space</option>
                            <option value="Hospital / Medical Facility">Hospital / Healthcare Facility</option>
                            <option value="Industrial / Warehouse">Industrial Factory / Warehouse</option>
                            <option value="Builder / Architecture Project">Architect / Turnkey Civil Project</option>
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#64748B]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="serviceRequired" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-1">
                          System Required <span className="text-[#0062FF]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="serviceRequired"
                            name="serviceRequired"
                            required
                            value={formData.serviceRequired}
                            onChange={handleInputChange}
                            className="w-full p-4 pr-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all text-[15px] font-medium text-[#102A43] appearance-none"
                          >
                            <option value="">Select elevator solution</option>
                            <option value="Passenger Lifts">Passenger Lifts (Dynamo Premium)</option>
                            <option value="MRL Lifts">Machine-Room-Less (MRL) Lifts</option>
                            <option value="Goods Lifts">Goods & Freight Elevators</option>
                            <option value="Hospital Lifts">Hospital & Stretcher Lifts</option>
                            <option value="Hydraulic Elevators">Hydraulic Elevators</option>
                            <option value="Modernization & AMC">Modernization & AMC Maintenance</option>
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#64748B]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-[13px] font-bold text-[#102A43] uppercase tracking-wider">
                        Project Notes / Shaft Dimensions <span className="text-[#94A3B8] font-normal normal-case ml-1">(Optional)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#0062FF] focus:ring-4 focus:ring-[#0062FF]/10 transition-all resize-none text-[15px] font-medium text-[#102A43] placeholder-[#94A3B8]"
                        placeholder="Number of floors/stops, pit depth, capacity, or specific cabin finishes required..."
                      ></textarea>
                    </div>

                    <div className="flex items-start gap-3 pt-4 px-4 py-3 rounded-xl bg-[#F0F7FF] border border-[#0062FF]/10">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 rounded border-[#CBD5E1] text-[#0062FF] focus:ring-[#0062FF]"
                      />
                      <label htmlFor="consent" className="text-[13px] text-[#475569] font-light leading-relaxed">
                        I agree to be contacted by Standard Engineering Works Elevators regarding this quotation. Details are kept confidential and used solely to prepare technical estimates. <span className="text-[#0062FF] font-bold">*</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.buildingType || !formData.serviceRequired || !formData.consent}
                      className="w-full py-4.5 bg-[#102A43] hover:bg-[#061426] text-white font-bold text-[15px] tracking-wide rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0062FF]/20 shadow-[0_4px_15px_rgba(16,42,67,0.2)] mt-8"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>Submit Quotation Request</span>
                          <Send className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#94A3B8] font-light text-center uppercase tracking-wider">
                      Fields marked with an asterisk (<span className="text-[#0062FF] font-bold">*</span>) are required
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9FC]" />}>
      <ContactFormContent />
    </Suspense>
  );
}
