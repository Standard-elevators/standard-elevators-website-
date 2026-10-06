"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { motion } from "framer-motion";
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
              Since 2003, Standard Engineering Works Elevators has pioneered custom design, indigenous manufacturing, turnkey installation, and scientific maintenance for high-reliability vertical transport across Telangana and Andhra Pradesh.
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
              className="lg:col-span-6 flex flex-col justify-between py-1"
            >
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold tracking-[0.22em] text-[#0A78F5] uppercase">
                    OUR HISTORY
                  </span>
                  <div className="h-px w-10 bg-[#0A78F5]/40" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.12] mb-6">
                  Over two decades of <br />
                  <span className="text-[#0A78F5]">vertical mobility</span> innovation.
                </h2>

                {/* Approved Company Narrative */}
                <p className="text-slate-600 leading-relaxed font-normal text-sm sm:text-base mb-5">
                  Established in the year 2003, Standard Engineering Works Elevators has quickly scaled to become a leading elevator company in the region. We operate a full-fledged design centre and manufacturing unit in Hyderabad, ensuring strict quality control at every stage of production.
                </p>
                <p className="text-slate-600 leading-relaxed font-normal text-sm sm:text-base mb-8">
                  Our corporate office is centrally located in Hyderabad and features an exclusive showroom that showcases fully functional elevators with a wide range of aesthetic choices for our customers.
                </p>
              </div>

              {/* Architectural Stage Marker / Timeline */}
              <div className="pt-6 border-t border-slate-200">
                <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase block mb-4">
                  GROWTH MILESTONES
                </span>
                
                <div className="space-y-3.5">
                  <div className="flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded bg-[#0A78F5]/10 text-[#0A78F5] font-mono font-bold text-xs shrink-0">
                      2003
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">Foundation &amp; Initial Manufacturing</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Established in Hyderabad with focus on precision elevator engineering.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-mono font-bold text-xs shrink-0">
                      PHASE 02
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">Design Centre &amp; Commercial Showroom</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Integrated CAD modeling, full-scale testing tower, and live display facility.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-mono font-bold text-xs shrink-0">
                      PHASE 03
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">100+ Verified Installations Across TS &amp; AP</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Comprehensive turnkey erection, MRL technology, and 24/7 AMC network.</p>
                    </div>
                  </div>
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
      <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-gradient-to-b from-[#071426] via-[#0D213A] to-[#071426] text-white overflow-hidden">
        {/* Soft background illumination */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0877F9]/10 blur-[130px] pointer-events-none" />

        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT / CENTER: Large Owner Portrait Architectural Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-[400px] p-[2px] rounded-[28px] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(8,119,249,0.25)]">
                {/* Animated Glowing Border */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E2D40] to-[#0A162B] transition-opacity duration-700 group-hover:opacity-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_60%,#0062FF_80%,#38BDF8_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-700" />
                
                <div className="relative w-full h-full bg-[#050D1A]/95 backdrop-blur-3xl rounded-[26px] overflow-hidden flex flex-col items-center">
                  {/* Photo Area */}
                  <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-[#0A162B]">
                    <Image
                      src={ownerImgSrc}
                      alt="Founder of Standard Elevators"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-[center_40%] transition-transform duration-1000 group-hover:scale-110"
                      onError={() => {
                        setOwnerImgSrc("/images/owner/owner-placeholder.svg");
                      }}
                    />
                    {/* Cinematic Lighting overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-transparent opacity-90 pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-[26px] pointer-events-none" />
                  </div>

                  {/* Details Section Below Image */}
                  <div className="relative w-full px-6 py-8 flex flex-col items-center text-center -mt-8 z-10">
                    <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#28B8FF]/30 to-transparent" />
                    
                    <h4 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-2 drop-shadow-sm group-hover:text-[#38BDF8] transition-colors duration-500">
                      Founder
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#38BDF8] uppercase mb-4">
                      Standard Engineering Works
                    </span>
                    
                    <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#28B8FF]/50 to-transparent rounded-full mb-4" />
                    
                    <p className="text-[13px] text-slate-400 font-light leading-relaxed tracking-wide">
                      Leading with precision & vision
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Leadership Message & Corporate Vision */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#071426] border border-[#26384D] w-fit mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#28B8FF]" />
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#28B8FF] uppercase">
                  LEADERSHIP
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.12] mb-6">
                Building Vertical Mobility <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0877F9] via-[#28B8FF] to-[#38BDF8]">
                  With Engineering Discipline.
                </span>
              </h2>

              {/* Approved Leadership Statements */}
              <p className="text-slate-300 text-base sm:text-[17px] leading-relaxed mb-5 font-light">
                Under the strategic guidance of our founder, Standard Engineering Works Elevators was established with a singular vision: to revolutionize vertical mobility through uncompromising quality and innovative engineering. Since 2003, this vision has guided every project we undertake.
              </p>
              <p className="text-slate-300 text-base sm:text-[17px] leading-relaxed mb-8 font-light">
                Our leadership believes in fostering a culture of continuous improvement, where safety, reliability, and customer satisfaction remain the core pillars of our operational philosophy. We are dedicated to building elevator systems that stand the test of time and elevate the standard of modern infrastructure.
              </p>

              {/* Three Executive Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#26384D]">
                <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                  <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">SAFETY FIRST</div>
                  <div className="text-[12px] text-slate-400">Strict adherence to Indian safety standards at every phase.</div>
                </div>
                <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                  <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">IN-HOUSE CRAFT</div>
                  <div className="text-[12px] text-slate-400">Direct manufacturing control without third-party compromises.</div>
                </div>
                <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                  <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">LONG-TERM CARE</div>
                  <div className="text-[12px] text-slate-400">Dedicated maintenance protocols ensuring permanent uptime.</div>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>



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

          {/* 3-Panel Composition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Panel 1: Turnkey Installation */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
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
            <div className="rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
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
            <div className="rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] shadow-[0_8px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
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
      <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-[#071426] text-white overflow-hidden">
        <div className="site-container px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-[0.25em] text-[#28B8FF] uppercase block mb-3">
              SAFETY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-tight mb-4">
              Compliant With Bureau of Indian Standards (BIS)
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Every elevator system designed and manufactured by Standard Engineering Works adheres to strict national safety codes, including IS 14665 standards for electric traction elevators.
            </p>
          </div>

          {/* 4 Safety Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0D213A] border border-[#26384D] shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[#071426] border border-[#28B8FF]/40 flex items-center justify-center text-[#28B8FF] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Automatic Rescue Device (ARD)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency battery system that safely guides the car to the nearest floor and unlocks doors during utility power interruptions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D213A] border border-[#26384D] shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[#071426] border border-[#28B8FF]/40 flex items-center justify-center text-[#28B8FF] mb-4">
                <Cog className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Over-Speed Governor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantaneous and progressive mechanical safety gear that clamps firmly onto the guide rails if normal descending speed is exceeded.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D213A] border border-[#26384D] shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[#071426] border border-[#28B8FF]/40 flex items-center justify-center text-[#28B8FF] mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Infrared Door Curtain</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-height optical multi-beam sensor scanning the door entrance to prevent closure if passengers, pets, or objects cross the threshold.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D213A] border border-[#26384D] shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[#071426] border border-[#28B8FF]/40 flex items-center justify-center text-[#28B8FF] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Phase Failure &amp; Overload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intelligent electrical monitors preventing elevator operation under phase loss, reverse phasing, or rated weight capacity breach.
              </p>
            </div>
          </div>

        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="p-8 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A78F5]/10 text-[#0A78F5] flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Smooth Rides</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Utilizing advanced gearless traction technology and intellectual microprocessor controls with VVVF drives to achieve perfect levelling accuracy and a seamless ride experience.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A78F5]/10 text-[#0A78F5] flex items-center justify-center mb-5">
                  <Cog className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Smart Technology</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Integration of automatic rescue devices, advanced safety gears, and energy-efficient systems that guarantee high reliability and substantial energy savings.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A78F5]/10 text-[#0A78F5] flex items-center justify-center mb-5">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Spacious Cabins</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Aesthetically designed cabins customized to suit the interiors of commercial buildings, bungalows, and high-rise apartments, maximizing usable interior volume.
                </p>
              </div>
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
