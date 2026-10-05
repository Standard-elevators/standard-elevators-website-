"use client";

import React from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Wrench, Headset } from "lucide-react";

export default function StandardDifference() {
  return (
    <section className="relative w-full overflow-hidden text-white py-20 md:py-28 group" style={{ backgroundColor: '#020617' }}>
      {/* 1. BACKGROUND IMAGE WITH REFINED CINEMATIC SHEET */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/standard-difference-bg.jpg" 
          alt="Architectural Elevator Integration by Standard Engineering Works" 
          fill
          sizes="100vw"
          className="object-cover object-[80%_center] md:object-[center_30%] transition-transform duration-1000 group-hover:scale-[1.02]"
        />
        {/* Transparent sheet so the building is clearly visible */}
        <div className="absolute inset-0 bg-[#020617]/65 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/30 to-[#020617]/80" />
      </div>

      <div className="relative z-10 site-container px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        
        {/* TOP CONTENT AREA */}
        <div className="max-w-2xl mb-12 sm:mb-16 md:mb-20">
          {/* SECTION LABEL */}
          <div className="mb-3 sm:mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-300">
              The Standard Difference
            </h2>
          </div>

          {/* MAIN HEADING */}
          <h3 className="text-3xl md:text-4xl lg:text-[44px] font-bold mb-4 leading-[1.15] tracking-tight">
            <span className="block text-white mb-1.5">Architectural Integration &</span>
            <span className="block text-[#38bdf8] drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              Engineering Focus
            </span>
          </h3>

          {/* SUPPORTING DESCRIPTION */}
          <p className="text-sm md:text-base max-w-md font-light leading-relaxed text-slate-300">
            Precision engineering that connects design, performance, and people.
          </p>
        </div>

        {/* FOUR-STAGE ENGINEERING TIMELINE */}
        <div className="relative w-full">
          {/* Desktop Line Container (Constrained strictly within nodes without overflow) */}
          <div className="hidden md:block absolute z-0 top-8 left-8 right-8 h-[3px]">
            {/* The solid thick glowing line */}
            <div className="absolute inset-0 bg-[#38bdf8] shadow-[0_0_15px_#38bdf8]" />
          </div>

          {/* Timeline Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
            
            {/* STAGE 01 */}
            <div className="flex flex-col items-start text-left relative group">
              {/* Mobile vertical line */}
              <div className="md:hidden absolute z-0 top-16 bottom-[-32px] left-8 w-[3px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />

              {/* Circular Node */}
              <div className="flex items-center justify-center rounded-full z-10 mb-5 transition-transform duration-300 group-hover:-translate-y-1 relative w-16 h-16 bg-[#020617] border-4 border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.7),inset_0_0_15px_rgba(56,189,248,0.4)]">
                <FileText size={28} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </div>
              
              {/* Content */}
              <div className="text-sm font-bold text-[#38bdf8] mb-1">STAGE 01</div>
              <h4 className="text-xl font-bold text-white mb-1.5">Planning</h4>
              <p className="text-sm font-light leading-relaxed max-w-[220px] text-slate-300">
                Detailed site study, architectural shaft drafting, and structural planning.
              </p>
            </div>

            {/* STAGE 02 */}
            <div className="flex flex-col items-start text-left relative group">
              {/* Mobile vertical line */}
              <div className="md:hidden absolute z-0 top-16 bottom-[-32px] left-8 w-[3px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />

              {/* Circular Node */}
              <div className="flex items-center justify-center rounded-full z-10 mb-5 transition-transform duration-300 group-hover:-translate-y-1 relative w-16 h-16 bg-[#020617] border-4 border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.7),inset_0_0_15px_rgba(56,189,248,0.4)]">
                <ShieldCheck size={28} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </div>
              
              {/* Content */}
              <div className="text-sm font-bold text-[#38bdf8] mb-1">STAGE 02</div>
              <h4 className="text-xl font-bold text-white mb-1.5">Manufacturing</h4>
              <p className="text-sm font-light leading-relaxed max-w-[220px] text-slate-300">
                High-grade steel fabrication, gearless motor assembly, and BIS quality checks.
              </p>
            </div>

            {/* STAGE 03 */}
            <div className="flex flex-col items-start text-left relative group">
              {/* Mobile vertical line */}
              <div className="md:hidden absolute z-0 top-16 bottom-[-32px] left-8 w-[3px] bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />

              {/* Circular Node */}
              <div className="flex items-center justify-center rounded-full z-10 mb-5 transition-transform duration-300 group-hover:-translate-y-1 relative w-16 h-16 bg-[#020617] border-4 border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.7),inset_0_0_15px_rgba(56,189,248,0.4)]">
                <Wrench size={28} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </div>
              
              {/* Content */}
              <div className="text-sm font-bold text-[#38bdf8] mb-1">STAGE 03</div>
              <h4 className="text-xl font-bold text-white mb-1.5">Installation</h4>
              <p className="text-sm font-light leading-relaxed max-w-[220px] text-slate-300">
                Skilled hoistway installation, guide rail alignment, and testing.
              </p>
            </div>

            {/* STAGE 04 */}
            <div className="flex flex-col items-start text-left relative group">
              {/* Circular Node */}
              <div className="flex items-center justify-center rounded-full z-10 mb-5 transition-transform duration-300 group-hover:-translate-y-1 relative w-16 h-16 bg-[#020617] border-4 border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.7),inset_0_0_15px_rgba(56,189,248,0.4)]">
                <Headset size={28} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              </div>
              
              {/* Content */}
              <div className="text-sm font-bold text-[#38bdf8] mb-1">STAGE 04</div>
              <h4 className="text-xl font-bold text-white mb-1.5">After-Sales & AMC</h4>
              <p className="text-sm font-light leading-relaxed max-w-[220px] text-slate-300">
                Scientific maintenance schedules, safety audits, and rapid support.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
