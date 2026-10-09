"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";

interface ElevatorCategory {
  id: string;
  step: string;
  level: string;
  title: string;
  description: string;
  href: string;
  badgeBg: string;
  buttonBg: string;
  accentColor: string;
  numberColor: string;
  lineColor: string;
  dotColor: string;
  dotGlow: string;
  icon: React.ReactNode;
}

const CATEGORIES: ElevatorCategory[] = [
  {
    id: "passenger",
    step: "01",
    level: "Floor 3 • Premium Vertical Living",
    title: "Passenger & MRL Lifts",
    description:
      "Space-saving Machine Room-Less technology delivering smooth, silent, and energy-efficient rides for residential and commercial spaces.",
    href: "/services/passenger-lifts",
    badgeBg: "bg-[#0A78F5]",
    buttonBg: "bg-[#0A78F5] hover:bg-[#0863CB]",
    accentColor: "#0A78F5",
    numberColor: "text-[#0A78F5]/20",
    lineColor: "bg-[#0A78F5]/90",
    dotColor: "bg-[#38BDF8]",
    dotGlow: "shadow-[0_0_14px_#38BDF8]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-white"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="3" x2="12" strokeDasharray="2 2" />
        <polyline points="7 9 9 7 11 9" />
        <polyline points="13 15 15 17 17 15" />
      </svg>
    ),
  },
  {
    id: "goods",
    step: "02",
    level: "Floor 2 • Industrial Freight Logistics",
    title: "Goods Lifts",
    description:
      "Heavy-duty vertical transport for industrial applications.",
    href: "/services/goods-lifts",
    badgeBg: "bg-[#9C5D1F]",
    buttonBg: "bg-[#9C5D1F] hover:bg-[#824B17]",
    accentColor: "#D99B4B",
    numberColor: "text-[#9C5D1F]/20",
    lineColor: "bg-[#D99B4B]/90",
    dotColor: "bg-[#FDE68A]",
    dotGlow: "shadow-[0_0_14px_#FDE68A]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-white"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    id: "hospital",
    step: "03",
    level: "Floor 1 • Emergency Healthcare Stretcher",
    title: "Hospital Lifts",
    description:
      "Smooth, reliable stretcher-compatible elevators for critical care.",
    href: "/services/hospital-lifts",
    badgeBg: "bg-[#006A6A]",
    buttonBg: "bg-[#006A6A] hover:bg-[#005252]",
    accentColor: "#00A896",
    numberColor: "text-[#006A6A]/20",
    lineColor: "bg-[#00A896]/90",
    dotColor: "bg-[#2DD4BF]",
    dotGlow: "shadow-[0_0_14px_#2DD4BF]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-white"
      >
        <path d="M9 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-4V4a1 1 0 0 0-1-1H9z" />
      </svg>
    ),
  },
];

export default function ElevatorSystems() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#EBF2FA] overflow-hidden">
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (Architectural 3D Cutaway with Overlaid Precision Cards)     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full h-[780px] xl:h-[860px] 2xl:h-[910px]">
        {/* Full-width 3D Cutaway Architectural Building Background (Preserve 100% Quality) */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/images/elevator-systems-bg.jpg"
            alt="Standard Engineering Works 3D Elevator Cutaway Architectural Solutions"
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="object-cover object-[78%_center] xl:object-center"
          />
          {/* Subtle soft gradient fade on left for ultra-clean contrast and readability */}
          <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#EBF2FA] via-[#EBF2FA]/85 via-45% to-transparent pointer-events-none" />
        </div>

        {/* Floating Content Container */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-8 xl:px-12 flex flex-col justify-between py-10 xl:py-14">
          
          {/* Top Header Row: Title & Subtitle on Left, 'View all specifications' on Right */}
          <div className="flex items-start justify-between gap-8 pt-2">
            <div className="max-w-2xl">
              {/* Interactive prompt pill to encourage exploration */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#0A78F5]/30 shadow-sm backdrop-blur-md mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A78F5] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A78F5]"></span>
                </span>
                <span className="text-[11px] xl:text-[12px] font-bold tracking-[0.16em] text-[#0A78F5] uppercase">
                  Interactive Architectural Model &bull; Tap Cards to Explore
                </span>
              </div>

              <h2 className="text-4xl xl:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-none">
                Engineered <span className="text-[#0A78F5]">Solutions.</span>
              </h2>
              <p className="mt-3 text-black font-medium text-[15px] xl:text-[17px] leading-relaxed max-w-xl">
                Select your building category to discover tailored shaft dimensions, motor specifications, and turnkey quotation workflows.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 text-white bg-[#0A78F5] hover:bg-[#0863CB] py-2.5 px-6 rounded-full font-bold text-sm shadow-md shadow-[#0A78F5]/25 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span>View all specifications</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Precision Aligned Cards (Levels 3, 2, 1) */}
          <div className="relative flex-1 w-full mt-4">
            
            {/* LEVEL 1: Floor 3 — Passenger & MRL Lifts */}
            <div
              className="absolute top-[8%] left-0 w-[460px] xl:w-[510px]"
              onMouseEnter={() => setHoveredCard("passenger")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link
                href="/services/passenger-lifts"
                className={`group block rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 p-5 hover:-translate-y-1 active:scale-[0.99] ${
                  hoveredCard === "passenger"
                    ? "border-[#0A78F5] shadow-[0_20px_50px_rgba(10,120,245,0.22)] ring-2 ring-[#0A78F5]/30"
                    : "border-white/90 shadow-[0_12px_36px_rgba(11,31,58,0.07)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold text-[#0A78F5]/20 tracking-tighter shrink-0 select-none w-14">
                    01
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#0A78F5] flex items-center justify-center shrink-0 shadow-md shadow-[#0A78F5]/30 group-hover:scale-105 transition-transform">
                    {CATEGORIES[0].icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[17px] font-bold text-[#0B1F3A] leading-tight group-hover:text-[#0A78F5] transition-colors">
                        Passenger & MRL Lifts
                      </h3>
                    </div>
                    <p className="text-[12.5px] xl:text-[13px] text-slate-600 leading-relaxed font-normal mb-2.5">
                      Space-saving Machine Room-Less technology delivering smooth, silent, and energy-efficient rides for residential and commercial spaces.
                    </p>
                    {/* Interactive Touch/Click Invitation */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0A78F5] group-hover:underline">
                      <span>Explore passenger specs & model</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0A78F5] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#0863CB] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Indicator connector line to top-floor elevator */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center w-[120px] xl:w-[170px] pointer-events-none">
                <div
                  className={`h-[3px] w-full transition-all duration-300 ${
                    hoveredCard === "passenger"
                      ? "bg-[#0A78F5] shadow-[0_0_12px_#0A78F5] scale-y-125"
                      : "bg-[#0A78F5]/90"
                  }`}
                />
                <div
                  className={`shrink-0 -ml-1 transition-all duration-300 ${
                    hoveredCard === "passenger"
                      ? "text-[#0A78F5] scale-125 drop-shadow-[0_0_10px_#0A78F5]"
                      : "text-[#0A78F5]/90"
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* LEVEL 2: Floor 2 — Goods Lifts */}
            <div
              className="absolute top-[42%] left-0 w-[460px] xl:w-[510px]"
              onMouseEnter={() => setHoveredCard("goods")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link
                href="/services/goods-lifts"
                className={`group block rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 p-5 hover:-translate-y-1 active:scale-[0.99] ${
                  hoveredCard === "goods"
                    ? "border-[#D99B4B] shadow-[0_20px_50px_rgba(217,155,75,0.22)] ring-2 ring-[#D99B4B]/30"
                    : "border-white/90 shadow-[0_12px_36px_rgba(11,31,58,0.07)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold text-[#9C5D1F]/20 tracking-tighter shrink-0 select-none w-14">
                    02
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#9C5D1F] flex items-center justify-center shrink-0 shadow-md shadow-[#9C5D1F]/30 group-hover:scale-105 transition-transform">
                    {CATEGORIES[1].icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[17px] font-bold text-[#0B1F3A] leading-tight group-hover:text-[#9C5D1F] transition-colors">
                        Goods Lifts
                      </h3>
                    </div>
                    <p className="text-[12.5px] xl:text-[13px] text-slate-600 leading-relaxed font-normal mb-2.5">
                      Heavy-duty vertical transport for industrial applications.
                    </p>
                    {/* Interactive Touch/Click Invitation */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9C5D1F] group-hover:underline">
                      <span>Explore goods capacity & specs</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#9C5D1F] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#824B17] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Indicator connector line to middle-floor elevator */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center w-[120px] xl:w-[170px] pointer-events-none">
                <div
                  className={`h-[3px] w-full transition-all duration-300 ${
                    hoveredCard === "goods"
                      ? "bg-[#D99B4B] shadow-[0_0_12px_#D99B4B] scale-y-125"
                      : "bg-[#D99B4B]/90"
                  }`}
                />
                <div
                  className={`shrink-0 -ml-1 transition-all duration-300 ${
                    hoveredCard === "goods"
                      ? "text-[#D99B4B] scale-125 drop-shadow-[0_0_10px_#D99B4B]"
                      : "text-[#D99B4B]/90"
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* LEVEL 3: Floor 1 — Hospital Lifts */}
            <div
              className="absolute top-[75%] left-0 w-[460px] xl:w-[510px]"
              onMouseEnter={() => setHoveredCard("hospital")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link
                href="/services/hospital-lifts"
                className={`group block rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 p-5 hover:-translate-y-1 active:scale-[0.99] ${
                  hoveredCard === "hospital"
                    ? "border-[#00A896] shadow-[0_20px_50px_rgba(0,168,150,0.22)] ring-2 ring-[#00A896]/30"
                    : "border-white/90 shadow-[0_12px_36px_rgba(11,31,58,0.07)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold text-[#006A6A]/20 tracking-tighter shrink-0 select-none w-14">
                    03
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#006A6A] flex items-center justify-center shrink-0 shadow-md shadow-[#006A6A]/30 group-hover:scale-105 transition-transform">
                    {CATEGORIES[2].icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[17px] font-bold text-[#0B1F3A] leading-tight group-hover:text-[#006A6A] transition-colors">
                        Hospital Lifts
                      </h3>
                    </div>
                    <p className="text-[12.5px] xl:text-[13px] text-slate-600 leading-relaxed font-normal mb-2.5">
                      Smooth, reliable stretcher-compatible elevators for critical care.
                    </p>
                    {/* Interactive Touch/Click Invitation */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006A6A] group-hover:underline">
                      <span>Explore stretcher & care specs</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#006A6A] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#005252] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Indicator connector line to bottom-floor elevator */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center w-[120px] xl:w-[170px] pointer-events-none">
                <div
                  className={`h-[3px] w-full transition-all duration-300 ${
                    hoveredCard === "hospital"
                      ? "bg-[#00A896] shadow-[0_0_12px_#00A896] scale-y-125"
                      : "bg-[#00A896]/90"
                  }`}
                />
                <div
                  className={`shrink-0 -ml-1 transition-all duration-300 ${
                    hoveredCard === "hospital"
                      ? "text-[#00A896] scale-125 drop-shadow-[0_0_10px_#00A896]"
                      : "text-[#00A896]/90"
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET LAYOUT (Clean Vertical Stack, Zero Layout Shift)         */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col px-5 py-14 max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-[#0A78F5]/30 shadow-xs mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#0A78F5] animate-ping" />
            <span className="text-[11px] font-bold tracking-[0.16em] text-[#0A78F5] uppercase">
              Interactive Elevator Model
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
            Engineered <span className="text-[#0A78F5]">Solutions.</span>
          </h2>
          <p className="mt-2.5 text-black font-medium text-[15px] sm:text-base leading-relaxed">
            Select your building category to discover tailored shaft dimensions, motor specifications, and turnkey quotation workflows.
          </p>
        </div>

        {/* 3D Cutaway Architectural Visual Preview on Mobile (Preserve 100% Quality) */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md mb-6 border border-white/60">
          <Image
            src="/images/elevator-systems-bg.jpg"
            alt="Standard Engineering Works 3D Elevator Cutaway Architectural Solutions"
            fill
            unoptimized
            quality={100}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Cards Stack */}
        <div className="flex flex-col gap-3.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group block rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_6px_20px_rgba(11,31,58,0.06)] active:scale-[0.98] p-4.5 transition-all hover:border-[#0A78F5]/40"
            >
              <div className="flex items-center gap-3.5">
                <span className={`text-4xl font-extrabold ${cat.numberColor} tracking-tighter shrink-0 select-none w-11`}>
                  {cat.step}
                </span>
                <div className={`w-11 h-11 rounded-xl ${cat.badgeBg} flex items-center justify-center shrink-0 shadow-sm text-white`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="text-[16px] font-bold text-[#0B1F3A] leading-tight mb-1 group-hover:text-[#0A78F5] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-600 leading-snug line-clamp-2 mb-2">
                    {cat.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#0A78F5]">
                    <span>Touch to explore specs</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full ${cat.buttonBg} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all specifications Button */}
        <div className="mt-6 pt-2">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 text-white bg-[#0A78F5] hover:bg-[#0863CB] py-3.5 px-6 rounded-full font-bold text-sm shadow-md shadow-[#0A78F5]/25 w-full transition-all active:scale-95"
          >
            <span>View all specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
