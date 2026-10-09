"use client";

import React from "react";
import { ShieldCheck, Cog, Activity, Layers, CheckCircle } from "lucide-react";

export default function SafetyArchitecture() {
  const pillars = [
    {
      title: "ARD System",
      code: "IS 14665 Compliance",
      icon: ShieldCheck,
      image: "/images/card_installation.jpg",
      description: "Automatic Rescue Device guides the car to the nearest landing and opens doors safely during utility power outages."
    },
    {
      title: "Over-Speed Governor",
      code: "Progressive Safety",
      icon: Cog,
      image: "/images/card_modernization.jpg",
      description: "Mechanical safety gear firmly locks the elevator onto guide rails if downward speed exceeds certified thresholds."
    },
    {
      title: "Infrared Curtain",
      code: "Multi-Beam Sensor",
      icon: Activity,
      image: "/images/card_maintenance.jpg",
      description: "Full-height 2D/3D light curtain scans the entrance to prevent door closing when passengers or objects cross."
    },
    {
      title: "Phase Failure Monitor",
      code: "Electrical Protection",
      icon: Layers,
      image: "/images/card_maintenance.jpg",
      description: "Intelligent electrical controller prevents motor operation under phase reversal, phase loss, or electrical imbalance."
    }
  ];

  return (
    <section className="relative w-full py-20 sm:py-24 lg:py-32 bg-[#061426] text-white overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{ 
             backgroundImage: "radial-gradient(#28B8FF 1px, transparent 1px)", 
             backgroundSize: "32px 32px" 
           }} 
      />
      
      <div className="site-container px-4 sm:px-6 lg:px-12 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#28B8FF]/10 border border-[#28B8FF]/30 text-[#28B8FF] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-sm">
            <span>Safety Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            Compliant With Bureau of Indian Standards (BIS)
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Every elevator system designed and manufactured by Standard Engineering Works adheres to strict national safety codes, including IS 14665 standards for electric traction elevators.
          </p>
        </div>

        {/* 4 Safety Pillars Grid - Highly visible on Mobile and Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div 
                key={idx}
                className="group relative p-5 sm:p-6 rounded-2xl overflow-hidden shadow-lg border border-white/15 hover:border-[#28B8FF]/60 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 bg-[#071930]/90 backdrop-blur-md min-h-[220px]"
              >
                {/* Background Image with Dark Readability Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img 
                    src={pillar.image} 
                    alt={pillar.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-35" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#071930]/90 to-[#071930]/75"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#28B8FF]/20 to-[#0877F9]/20 border border-[#28B8FF]/40 flex items-center justify-center text-[#28B8FF] shadow-md group-hover:scale-105 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/10 text-[#38BDF8] border border-white/10">
                      {pillar.code}
                    </span>
                  </div>

                  <h3 className="text-[17px] sm:text-lg font-bold text-white mb-2 leading-snug tracking-tight group-hover:text-[#38BDF8] transition-colors drop-shadow-sm">
                    {pillar.title}
                  </h3>

                  <p className="text-[13px] sm:text-[13.5px] text-slate-100 font-medium leading-[1.6] drop-shadow-xs">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[#28B8FF]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>BIS Certified Protection</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
