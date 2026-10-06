"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Cog,
  MapPin,
  ShieldCheck,
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
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  labelTop: string;
  labelBottom: string;
  caption: string;
}

const CREDENTIALS: Credential[] = [
  {
    id: "est-2003",
    icon: Building2,
    value: <CountUp start={1980} end={2003} duration={2.5} />,
    labelTop: "ESTABLISHED",
    labelBottom: "IN HYDERABAD",
    caption: "23+ Years of Continuous Operations",
  },
  {
    id: "installs-100",
    icon: Cog,
    value: <CountUp start={0} end={100} duration={2.5} suffix="+" />,
    labelTop: "VERIFIED",
    labelBottom: "INSTALLATIONS",
    caption: "Commercial, Residential & Hospital Lifts",
  },
  {
    id: "coverage-ts-ap",
    icon: MapPin,
    value: "TS & AP",
    labelTop: "STATEWIDE",
    labelBottom: "COVERAGE",
    caption: "Direct Field Engineering & Support",
  },
  {
    id: "safety-bis",
    icon: ShieldCheck,
    value: "BIS",
    labelTop: "SAFETY",
    labelBottom: "STANDARDS",
    caption: "Bureau of Indian Standards Compliant",
  },
];

export default function EngineeringCredentials() {
  return (
    <section
      id="engineering-credentials"
      className="relative w-full overflow-hidden bg-[#030914] text-white py-16 md:py-20 lg:py-24"
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
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-0">
          
          {/* Left Title Area */}
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0 xl:pr-8">
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-4 whitespace-nowrap">
              Standard Engineering Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5 whitespace-nowrap">
              <span className="text-white">OUR LEGACY</span><br />
              <span className="text-[#00B4FF]">OF PRECISION</span>
            </h2>
            <div className="h-[2px] w-16 bg-[#0062FF] mb-5 xl:mx-0 mx-auto" />
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-slate-500 whitespace-nowrap">
              Engineering Safer. Smarter. Higher.
            </span>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden xl:block w-px h-32 bg-white/10 self-center mx-2 2xl:mx-4" />

          {/* Credentials Row */}
          <div className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap items-center sm:items-start justify-center xl:justify-between gap-10 sm:gap-x-12 sm:gap-y-12 xl:gap-4 2xl:gap-8 w-full flex-1">
            {CREDENTIALS.map((cred, idx) => {
              const IconComponent = cred.icon;
              return (
                <React.Fragment key={cred.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    className="flex flex-col items-center text-center group w-full sm:w-[calc(50%-24px)] xl:w-auto xl:flex-1"
                  >
                    {/* Icon Container with glowing ring */}
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full border border-[#00B4FF]/30 scale-[1.3] group-hover:scale-[1.4] group-hover:border-[#00B4FF]/60 transition-all duration-500" />
                      <div className="w-[52px] h-[52px] rounded-full bg-[#05132B] border border-[#1E3A6E] flex items-center justify-center relative z-10 group-hover:bg-[#0A2044] transition-colors duration-500 shadow-[0_0_15px_rgba(0,180,255,0.15)]">
                        <IconComponent className="w-6 h-6 text-[#00B4FF]" />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md tracking-tight group-hover:text-[#00B4FF] transition-colors duration-300">
                      {cred.value}
                    </div>

                    {/* Labels */}
                    <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase leading-relaxed mb-3">
                      <div className="text-slate-300">{cred.labelTop}</div>
                      <div className="text-[#00B4FF]">{cred.labelBottom}</div>
                    </div>

                    {/* Caption */}
                    <div className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed px-2">
                      {cred.caption}
                    </div>
                  </motion.div>

                  {/* Vertical Divider between items (Desktop Only) */}
                  {idx < CREDENTIALS.length - 1 && (
                    <div className="hidden xl:block w-px h-28 bg-white/10 self-center" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
