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
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#071426] via-[#091B33] to-[#071426] text-white py-20"
    >
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-[#0877F9]/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #28B8FF 1px, transparent 1px), linear-gradient(to bottom, #28B8FF 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CREDENTIALS.map((cred, idx) => {
            const IconComponent = cred.icon;
            return (
              <motion.div
                key={cred.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="group relative bg-[#0D213A]/50 hover:bg-[#112948]/80 backdrop-blur-md border border-[#26384D] hover:border-[#0877F9]/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,119,249,0.15)] flex flex-col items-center text-center"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0877F9]/0 group-hover:via-[#28B8FF]/50 to-transparent transition-all duration-500" />
                
                <div className="w-14 h-14 rounded-full bg-[#071426] border border-[#26384D] group-hover:border-[#0877F9]/50 flex items-center justify-center text-[#28B8FF] transition-all duration-500 shadow-inner mb-6 group-hover:scale-110">
                  <IconComponent className="w-6 h-6 stroke-[1.5]" />
                </div>

                <div className="text-4xl font-black text-white tracking-tight mb-4 drop-shadow-md">
                  {cred.value}
                </div>

                <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300 leading-relaxed mb-3">
                  <div>{cred.labelTop}</div>
                  <div className="text-[#28B8FF]">{cred.labelBottom}</div>
                </div>

                <div className="text-sm text-slate-400 font-light max-w-[200px] leading-relaxed">
                  {cred.caption}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
