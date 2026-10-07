"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { motion } from "framer-motion";
import FounderLeadership from "@/components/FounderLeadership";
import SafetyArchitecture from "@/components/SafetyArchitecture";
import {
  ArrowRight,
  ShieldCheck,
  Cog,
  Activity,
  Layers,
  Phone,
  Sparkles,
  Maximize2,
} from "lucide-react";

export default function AboutView() {
  const [ownerImgSrc, setOwnerImgSrc] = useState("/images/team/founder.jpg");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isPaused = false;
    let resumeTimeoutId: NodeJS.Timeout;
    
    const isMobile = () => window.innerWidth < 768;

    const handleInteractionStart = () => {
      isPaused = true;
      clearTimeout(resumeTimeoutId);
    };
    
    const handleInteractionEnd = () => {
      resumeTimeoutId = setTimeout(() => {
        isPaused = false;
      }, 3000);
    };

    container.addEventListener('touchstart', handleInteractionStart, { passive: true });
    container.addEventListener('touchend', handleInteractionEnd);
    container.addEventListener('mousedown', handleInteractionStart);
    container.addEventListener('mouseup', handleInteractionEnd);

    const scrollContinuously = () => {
      if (!isPaused && isMobile()) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          if (container.scrollLeft >= maxScroll - 1) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft += 0.5;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollContinuously);
    };

    animationFrameId = requestAnimationFrame(scrollContinuously);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resumeTimeoutId);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchend', handleInteractionEnd);
      container.removeEventListener('mousedown', handleInteractionStart);
      container.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, []);

  return (
    <div className="flex flex-col w-full text-slate-800 antialiased overflow-hidden">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — ABOUT HERO (Dark Cinematic Navy #071426)                     */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-44 lg:pb-28 bg-gradient-to-b from-[#050C17] via-[#071426] to-[#0A1A30] text-white flex flex-col justify-between overflow-hidden">
        {/* Cinematic Background Architectural Visual */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/images/bg_about_hero.jpg"
            alt="Standard Engineering Works Advanced Vertical Mobility Architecture"
            fill
            priority
            quality={100}
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle text protection gradient only on the left where text is */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent w-full md:w-[60%]" />
          
          {/* Delicate architectural coordinate grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(to right, #28B8FF 1px, transparent 1px), linear-gradient(to bottom, #28B8FF 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="site-container relative z-10 px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D213A] border border-[#26384D] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#28B8FF] shadow-[0_0_8px_#28B8FF]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#28B8FF] uppercase">
                ABOUT STANDARD ENGINEERING WORKS
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.06] text-white mb-6">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0877F9] via-[#28B8FF] to-[#38BDF8]">
                Vertical Mobility
              </span> <br />
              With Precision.
            </h1>

            {/* Supporting Statement */}
            <p className="text-base sm:text-lg lg:text-[19px] text-slate-200 font-light leading-relaxed max-w-2xl mb-8">
              Since 2003, we have pioneered custom design, manufacturing, and turnkey installation of high-reliability elevators across Telangana and Andhra Pradesh.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                className="h-[46px] px-7 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-[0_4px_18px_rgba(0,98,255,0.45)] active:scale-95"
              >
                <span>Explore Systems</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="h-[46px] px-7 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center text-sm backdrop-blur-md active:scale-95"
              >
                <span>Get a Quotation</span>
              </Link>
            </div>
          </motion.div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 — OUR HISTORY (Warm Architectural White / Steel #F7F9FC)       */}
      {/* Perfectly balanced 50/50 visual height on desktop                         */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-[#F7F9FC] border-b border-[#E2E8F0] overflow-hidden">
        {/* Subtle architectural background linework */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #0A78F5 1px, transparent 1px), linear-gradient(to bottom, #0A78F5 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* LEFT COLUMN: Architectural Elevator Visual (Equal Height Anchor) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] bg-[#0A1A30] shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between min-h-[460px] lg:min-h-[520px]"
            >
              <Image
                src="/images/credentials-architecture-bg.jpg"
                alt="Standard Engineering Works Heritage & Elevator Engineering Facility"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Subtle top & bottom dark gradients for framing */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A30]/85 via-transparent to-[#0A1A30]/40 pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-md bg-[#071426]/90 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase">
                  HYDERABAD DESIGN CENTRE
                </span>
                <span className="text-white/60 font-mono text-xs">+ 2003</span>
              </div>

              {/* Floating Bottom Card Details */}
              <div className="relative z-10 p-6 sm:p-8">
                <span className="text-xs font-mono tracking-widest text-[#38BDF8] uppercase block mb-1">
                  MANUFACTURING &amp; SHOWROOM
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Precision Engineering Headquarters
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
                  Centrally located in Hyderabad with an exclusive operational showroom showcasing fully functional passenger, MRL, and freight elevators.
                </p>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Our History Content (Equal Height Matching) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col justify-center py-6 lg:py-10 px-2 sm:px-0"
            >
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#0A78F5] uppercase">
                    OUR HISTORY
                  </span>
                  <div className="h-px w-8 bg-[#0A78F5]/40" />
                </div>

                {/* Heading */}
                <h2 className="text-[32px] sm:text-4xl lg:text-[46px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.15] mb-8 text-balance">
                  Over two decades of <span className="text-[#0A78F5]">vertical mobility</span> innovation.
                </h2>

                {/* Approved Company Narrative */}
                <div className="space-y-6">
                  <p className="text-slate-800 leading-[1.8] font-medium text-[16px] sm:text-[17px]">
                    Established in 2003, Standard Engineering Works Elevators has rapidly scaled to become a leading precision elevator company in the region. We operate a full-fledged design centre and manufacturing unit in Hyderabad, ensuring stringent quality control at every stage.
                  </p>
                  <p className="text-slate-800 leading-[1.8] font-medium text-[16px] sm:text-[17px]">
                    Our corporate headquarters features an exclusive showroom showcasing fully functional elevators, offering a wide array of premium aesthetic choices for our customers.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — LEADERSHIP / OWNER (Deep Navy #071426 / #0D213A)              */}
      {/* High-end editorial architectural presentation for future photo           */}
      {/* ========================================================================= */}
      <FounderLeadership />



      {/* ========================================================================= */}
      {/* SECTION 05 — CAPABILITIES / WHAT WE DO (Light Steel #EEF3F8)              */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-[#EEF3F8] text-[#0F172A] border-b border-[#CBD5E1] overflow-hidden">
        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold tracking-[0.22em] text-[#0A78F5] uppercase block mb-3">
              WHAT WE DO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
              Comprehensive Vertical Mobility Solutions
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              From bespoke residential villas to high-traffic commercial complexes and industrial freight elevators.
            </p>
          </div>

          {/* 3-Panel Composition - Horizontal Scroll on Mobile */}
          <div 
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible items-stretch no-scrollbar"
          >
            
            {/* Panel 1: Turnkey Installation */}
            <div className="min-w-[85vw] md:min-w-0 rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/card_installation.jpg"
                  alt="Turnkey Custom Installation by Standard Engineering Works"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-[#0A78F5] text-white text-[11px] font-bold uppercase tracking-wider">
                  TURNKEY INSTALLATION
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#0A78F5] transition-colors">
                  Custom Passenger &amp; MRL Lifts
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Space-saving Machine Room-Less technology delivering smooth, silent rides. Tailored elevator cabins crafted for modern architectural requirements.
                </p>
                <Link
                  href="/services/passenger-lifts"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A78F5] hover:text-[#0863CB] transition-colors"
                >
                  <span>Explore Passenger Elevators</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Panel 2: Modernization */}
            <div className="min-w-[85vw] md:min-w-0 rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/card_modernization.jpg"
                  alt="Elevator Modernization & System Retrofits"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-[#0A78F5] text-white text-[11px] font-bold uppercase tracking-wider">
                  SYSTEM RETROFITS
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#0A78F5] transition-colors">
                  Modernization &amp; Upgrades
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Upgrading aging infrastructure with contemporary gearless technology, smart control panels, and improved safety features.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A78F5] hover:text-[#0863CB] transition-colors"
                >
                  <span>Modernization Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Panel 3: Maintenance */}
            <div className="min-w-[85vw] md:min-w-0 rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/card_maintenance.jpg"
                  alt="Programmed Maintenance & Repairs"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-[#0A78F5] text-white text-[11px] font-bold uppercase tracking-wider">
                  24/7 AMC SERVICE
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#0A78F5] transition-colors">
                  Programmed Maintenance &amp; Repairs
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Scientific maintenance schedules ensuring long-term reliability, maximum uptime, and strict adherence to safety standards.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A78F5] hover:text-[#0863CB] transition-colors"
                >
                  <span>Maintenance Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 06 — QUALITY, SAFETY & STANDARDS (Deep Navy #071426)              */}
      {/* ========================================================================= */}
      <SafetyArchitecture />

      {/* ========================================================================= */}
      {/* SECTION 07 — WHY STANDARD ENGINEERING WORKS (Warm White #F8FAFC)           */}
      {/* "Smooth | Smart | Spacious" Lifecycle Journey                             */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.25em] text-[#0A78F5] uppercase block mb-3">
              THE STANDARD DIFFERENCE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B1F3A] tracking-tight leading-tight mb-4">
              Smooth • Smart • Spacious
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our engineering philosophy guarantees exceptional vertical mobility from initial architectural blueprint to decades of reliable daily service.
            </p>
          </div>

          {/* 3 Core Pillars in Clean Architectural Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto mb-16">
            
            {/* Card 1 */}
            <div className="group relative p-6 md:p-8 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-end min-h-[220px] md:h-auto border border-[#CBD5E1]/20 text-left">
              <div className="absolute inset-0 z-0">
                <img src="/images/card_modernization.jpg" alt="Smooth Rides" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#071426]/75 group-hover:bg-[#071426]/65 transition-colors"></div>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#28B8FF] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="relative z-10 text-[18px] md:text-xl font-bold text-white mb-2">Smooth Rides</h3>
              <p className="relative z-10 text-slate-200 text-[13px] md:text-sm leading-relaxed">
                Utilizing advanced gearless traction technology and intellectual microprocessor controls with VVVF drives to achieve perfect levelling accuracy and a seamless ride experience.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative p-6 md:p-8 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-end min-h-[220px] md:h-auto border border-[#CBD5E1]/20 text-left">
              <div className="absolute inset-0 z-0">
                <img src="/images/card_maintenance.jpg" alt="Smart Technology" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#071426]/75 group-hover:bg-[#071426]/65 transition-colors"></div>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#28B8FF] flex items-center justify-center mb-4">
                <Cog className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="relative z-10 text-[18px] md:text-xl font-bold text-white mb-2">Smart Technology</h3>
              <p className="relative z-10 text-slate-200 text-[13px] md:text-sm leading-relaxed">
                Integration of automatic rescue devices, advanced safety gears, and energy-efficient systems that guarantee high reliability and substantial energy savings.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative p-6 md:p-8 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-end min-h-[220px] md:h-auto border border-[#CBD5E1]/20 text-left">
              <div className="absolute inset-0 z-0">
                <img src="/images/card_installation.jpg" alt="Spacious Cabins" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#071426]/75 group-hover:bg-[#071426]/65 transition-colors"></div>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#28B8FF] flex items-center justify-center mb-4">
                <Maximize2 className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="relative z-10 text-[18px] md:text-xl font-bold text-white mb-2">Spacious Cabins</h3>
              <p className="relative z-10 text-slate-200 text-[13px] md:text-sm leading-relaxed">
                Aesthetically designed cabins customized to suit the interiors of commercial buildings, bungalows, and high-rise apartments, maximizing usable interior volume.
              </p>
            </div>
            
          </div>



        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — FINAL CTA (Dark Cinematic Navy #071426)                      */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-28 bg-gradient-to-r from-[#050C17] via-[#071426] to-[#0A1A30] text-white overflow-hidden text-center">
        {/* Subtle geometric line pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current text-[#28B8FF]">
            <polygon points="100,0 0,100 100,100" />
          </svg>
        </div>

        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] text-[#28B8FF] uppercase block mb-3">
            START YOUR ELEVATOR PROJECT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Let&apos;s Build Better Vertical Mobility.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Discuss your architectural specifications, shaft dimensions, and quotation with our engineering team today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="h-[50px] px-8 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2.5 text-base shadow-[0_4px_20px_rgba(0,98,255,0.45)] active:scale-95 w-full sm:w-auto"
            >
              <span>Get a Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:9515231555"
              className="h-[50px] px-8 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-base backdrop-blur-md active:scale-95 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-[#28B8FF]" />
              <span>Call 9515231555</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
