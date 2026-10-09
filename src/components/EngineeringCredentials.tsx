"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Cog,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const CountUp = ({ start = 0, end, duration = 2, suffix = "" }: { start?: number, end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(start);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const totalDuration = duration * 1000;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / totalDuration, 1);
        
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(ease * (end - start) + start));

        if (progress < 1) {
          window.requestAnimationFrame(animate);
        }
      };
      window.requestAnimationFrame(animate);
    }
  }, [inView, start, end, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

interface Credential {
  id: string;
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  labelTop: string;
  labelBottom: string;
  caption: string;
}

const CREDENTIALS: Credential[] = [
  {
    id: "est-2003",
    step: "01",
    icon: Building2,
    value: <CountUp start={1980} end={2003} duration={2.5} />,
    labelTop: "ESTABLISHED",
    labelBottom: "IN HYDERABAD",
    caption: "23+ Years of Continuous Operations",
  },
  {
    id: "installs-100",
    step: "02",
    icon: Cog,
    value: <CountUp start={0} end={100} duration={2.5} suffix="+" />,
    labelTop: "VERIFIED",
    labelBottom: "INSTALLATIONS",
    caption: "Commercial, Residential & Hospital Lifts",
  },
  {
    id: "coverage-ts-ap",
    step: "03",
    icon: MapPin,
    value: "TS & AP",
    labelTop: "STATEWIDE",
    labelBottom: "COVERAGE",
    caption: "Direct Field Engineering & Support",
  },
  {
    id: "safety-bis",
    step: "04",
    icon: ShieldCheck,
    value: "BIS",
    labelTop: "SAFETY",
    labelBottom: "STANDARDS",
    caption: "Bureau of Indian Standards Compliant",
  },
];

export default function EngineeringCredentials() {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, offsetWidth } = scrollContainerRef.current;
    if (offsetWidth > 0) {
      const newIndex = Math.round(scrollLeft / (offsetWidth * 0.78));
      setMobileActiveIndex(Math.min(Math.max(newIndex, 0), CREDENTIALS.length - 1));
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.offsetWidth * 0.82;
    scrollContainerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setMobileActiveIndex(index);
  };

  return (
    <section
      id="engineering-credentials"
      className="relative w-full overflow-hidden bg-[#030914] text-white py-14 sm:py-18 lg:py-24"
    >
      {/* Sleek Horizontal Background & Glows */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Core dark navy gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02050B] via-[#051126] to-[#02050B]" />
        
        {/* Abstract glowing sweeping lines (Left & Right) */}
        <div className="absolute top-0 left-0 w-[600px] h-full bg-gradient-to-r from-[#0062FF]/10 to-transparent blur-[80px]" />
        <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-[#0062FF]/10 to-transparent blur-[80px]" />
        
        {/* Subtle grid pattern for technical feel */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />

        {/* Cinematic edge lighting */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0062FF]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0062FF]/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (Clean Horizontal Grid with Vertical Dividers)             */}
        {/* ========================================================================= */}
        <div className="hidden xl:flex items-center justify-between gap-0">
          
          {/* Left Title Area */}
          <div className="flex flex-col items-start text-left shrink-0 pr-8">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-3 whitespace-nowrap">
              Standard Engineering Works
            </span>
            <h2 className="text-4xl 2xl:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 whitespace-nowrap">
              <span className="text-white">OUR LEGACY</span><br />
              <span className="text-[#00B4FF]">OF PRECISION</span>
            </h2>
            <div className="h-[2px] w-16 bg-[#0062FF] mb-4" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-slate-500 whitespace-nowrap">
              Engineering Safer. Smarter. Higher.
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-32 bg-white/10 self-center mx-4 2xl:mx-8" />

          {/* Credentials Row */}
          <div className="flex items-start justify-between gap-4 2xl:gap-8 flex-1">
            {CREDENTIALS.map((cred, idx) => {
              const IconComponent = cred.icon;
              return (
                <React.Fragment key={cred.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    className="flex flex-col items-center text-center group flex-1"
                  >
                    {/* Icon Container with glowing ring */}
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full border border-[#00B4FF]/30 scale-[1.3] group-hover:scale-[1.4] group-hover:border-[#00B4FF]/60 transition-all duration-500" />
                      <div className="w-[54px] h-[54px] rounded-full bg-[#05132B] border border-[#1E3A6E] flex items-center justify-center relative z-10 group-hover:bg-[#0A2044] transition-colors duration-500 shadow-[0_0_15px_rgba(0,180,255,0.15)]">
                        <IconComponent className="w-6 h-6 text-[#00B4FF]" />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-4xl font-bold text-white mb-2 drop-shadow-md tracking-tight group-hover:text-[#00B4FF] transition-colors duration-300">
                      {cred.value}
                    </div>

                    {/* Labels */}
                    <div className="text-[11px] font-bold tracking-[0.2em] uppercase leading-relaxed mb-3">
                      <div className="text-slate-300">{cred.labelTop}</div>
                      <div className="text-[#00B4FF]">{cred.labelBottom}</div>
                    </div>

                    {/* Caption */}
                    <div className="text-xs text-slate-400 font-light leading-relaxed px-2">
                      {cred.caption}
                    </div>
                  </motion.div>

                  {/* Vertical Divider between items */}
                  {idx < CREDENTIALS.length - 1 && (
                    <div className="w-px h-28 bg-white/10 self-center" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET LAYOUT: CREATIVE HORIZONTAL SWIPING CARDS                */}
        {/* ========================================================================= */}
        <div className="xl:hidden flex flex-col">
          
          {/* Header Area */}
          <div className="text-center mb-6 px-2">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2 block">
              Standard Engineering Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              <span className="text-white">OUR LEGACY </span>
              <span className="text-[#00B4FF]">OF PRECISION</span>
            </h2>
            <div className="h-[2px] w-14 bg-[#0062FF] mx-auto mb-3" />
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400">
              Engineering Safer. Smarter. Higher.
            </p>
          </div>

          {/* Swipe Hint & Controls Bar */}
          <div className="flex items-center justify-between px-2 mb-3 text-xs text-slate-400">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00B4FF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Swipe cards to explore stats ({mobileActiveIndex + 1}/4)</span>
            </div>

            {/* Quick Next/Prev Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToCard(Math.max(mobileActiveIndex - 1, 0))}
                disabled={mobileActiveIndex === 0}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToCard(Math.min(mobileActiveIndex + 1, CREDENTIALS.length - 1))}
                disabled={mobileActiveIndex === CREDENTIALS.length - 1}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Next card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Swiping Cards Carousel Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory py-2 px-1 -mx-2 scrollbar-none touch-pan-x"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {CREDENTIALS.map((cred, idx) => {
              const IconComponent = cred.icon;
              const isActive = mobileActiveIndex === idx;

              return (
                <div
                  key={cred.id}
                  onClick={() => scrollToCard(idx)}
                  className={`snap-center shrink-0 w-[80vw] sm:w-[320px] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-[#082245]/95 via-[#05162D]/95 to-[#030914]/95 border-2 border-[#00B4FF] shadow-[0_12px_36px_rgba(0,180,255,0.25)] scale-[1.01]"
                      : "bg-[#05132B]/80 border border-white/10 shadow-md opacity-85 scale-[0.98]"
                  }`}
                >
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4FF]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header: Step & Category */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[11px] font-mono font-bold text-[#00B4FF] bg-[#00B4FF]/10 px-2.5 py-0.5 rounded-full border border-[#00B4FF]/30">
                      STEP {cred.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Pillar {idx + 1} of 4
                    </span>
                  </div>

                  {/* Central Content */}
                  <div className="flex flex-col items-center text-center relative z-10 py-2">
                    {/* Glowing Icon */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full border border-[#00B4FF]/40 scale-[1.3] shadow-[0_0_12px_rgba(0,180,255,0.3)]" />
                      <div className="w-[58px] h-[58px] rounded-full bg-[#05162D] border border-[#00B4FF]/50 flex items-center justify-center relative z-10 shadow-lg">
                        <IconComponent className="w-7 h-7 text-[#00B4FF]" />
                      </div>
                    </div>

                    {/* Prominent Stat Value */}
                    <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md text-[#00B4FF]">
                      {cred.value}
                    </div>

                    {/* Stat Labels */}
                    <div className="text-[11px] font-bold tracking-[0.2em] uppercase leading-snug mb-2">
                      <div className="text-slate-200">{cred.labelTop}</div>
                      <div className="text-[#00B4FF]">{cred.labelBottom}</div>
                    </div>

                    {/* Explanatory Caption */}
                    <p className="text-[13px] text-slate-300 font-medium leading-relaxed max-w-[240px]">
                      {cred.caption}
                    </p>
                  </div>

                  {/* Bottom Active Glow Bar */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#00B4FF]">
                    <span>Verified Milestone</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {CREDENTIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`transition-all duration-300 rounded-full ${
                  mobileActiveIndex === i
                    ? "w-8 h-2 bg-[#00B4FF] shadow-[0_0_8px_#00B4FF]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
