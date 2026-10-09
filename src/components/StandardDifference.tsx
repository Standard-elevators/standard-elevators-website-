"use client";

import React from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Wrench, Headset } from "lucide-react";

const STAGES = [
  { 
    num: "01", 
    title: "Planning", 
    desc: "Detailed site study, architectural shaft drafting, and structural planning.", 
    icon: FileText 
  },
  { 
    num: "02", 
    title: "Manufacturing", 
    desc: "High-grade steel fabrication, gearless motor assembly, and BIS quality checks.", 
    icon: ShieldCheck 
  },
  { 
    num: "03", 
    title: "Installation", 
    desc: "Skilled hoistway installation, guide rail alignment, and precision load testing.", 
    icon: Wrench 
  },
  { 
    num: "04", 
    title: "After-Sales & AMC", 
    desc: "Scientific preventative maintenance schedules, safety audits, and 24/7 rapid support.", 
    icon: Headset 
  }
];

export default function StandardDifference() {
  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP VERSION                           */}
      {/* ========================================== */}
      <section className="relative w-full overflow-hidden text-white py-20 md:py-28 group hidden md:block" style={{ backgroundColor: '#020617' }}>
        {/* 1. BACKGROUND IMAGE WITH REFINED CINEMATIC SHEET */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/standard-difference-bg.jpg" 
            alt="Architectural Elevator Integration by Standard Engineering Works" 
            fill
            sizes="100vw"
            className="object-cover object-[80%_center] md:object-[center_30%] transition-transform duration-1000 group-hover:scale-[1.02]"
          />
          {/* Dark scrims for superior legibility */}
          <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]/90" />
        </div>

        <div className="relative z-10 site-container px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          
          {/* TOP CONTENT AREA */}
          <div className="max-w-2xl mb-12 sm:mb-16 md:mb-20">
            {/* SECTION LABEL */}
            <div className="mb-3 sm:mb-4">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#38bdf8] bg-[#38bdf8]/10 px-3.5 py-1.5 rounded-full border border-[#38bdf8]/30">
                The Standard Difference
              </span>
            </div>

            {/* MAIN HEADING */}
            <h3 className="text-3xl md:text-4xl lg:text-[44px] font-black mb-4 leading-[1.15] tracking-tight text-white mt-4">
              <span className="block mb-1.5">Architectural Integration &</span>
              <span className="block text-[#38bdf8] drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
                Engineering Focus
              </span>
            </h3>

            {/* SUPPORTING DESCRIPTION */}
            <p className="text-base font-normal leading-relaxed text-slate-100 max-w-lg">
              Precision engineering that connects design, performance, and people across every vertical elevation.
            </p>
          </div>

          {/* FOUR-STAGE ENGINEERING TIMELINE */}
          <div className="relative w-full">
            {/* Desktop Line Container */}
            <div className="hidden md:block absolute z-0 top-8 left-8 right-8 h-[3px]">
              <div className="absolute inset-0 bg-[#38bdf8] shadow-[0_0_15px_#38bdf8]" />
            </div>

            {/* Timeline Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {STAGES.map((stage, idx) => {
                const IconComp = stage.icon;
                return (
                  <div key={idx} className="flex flex-col items-start text-left relative group/node">
                    {/* Circular Node */}
                    <div className="flex items-center justify-center rounded-full z-10 mb-5 transition-transform duration-300 group-hover/node:-translate-y-1 relative w-16 h-16 bg-[#020617] border-4 border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.7),inset_0_0_15px_rgba(56,189,248,0.4)]">
                      <IconComp size={26} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                    </div>
                    
                    {/* Content Card with clear contrast and attractive font */}
                    <div className="p-5 rounded-2xl bg-[#071930]/90 backdrop-blur-md border border-white/15 group-hover/node:border-[#38bdf8]/60 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 w-full min-h-[160px] flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-mono font-bold text-[#38bdf8] mb-1.5 tracking-widest uppercase">
                          STAGE {stage.num}
                        </div>
                        <h4 className="text-[19px] font-bold text-white mb-2 leading-tight group-hover/node:text-[#38bdf8] transition-colors">
                          {stage.title}
                        </h4>
                        <p className="text-[13.5px] font-medium leading-[1.6] text-slate-100">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* MOBILE VERSION - PREMIUM VERTICAL TIMELINE */}
      {/* ========================================== */}
      <section className="block md:hidden relative w-full overflow-hidden text-white py-16 bg-[#020617]">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/standard-difference-bg.jpg" 
            alt="Architectural Elevator Integration by Standard Engineering Works" 
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/70 to-[#020617]/95" />
        </div>

        <div className="relative z-10 w-full flex flex-col h-full">
          {/* Intro Typography */}
          <div className="mb-10 px-5 text-center">
            <span className="inline-flex items-center gap-2 text-[#38bdf8] text-[11px] font-bold tracking-[0.2em] uppercase mb-3 bg-[#38bdf8]/10 px-3.5 py-1.5 rounded-full border border-[#38bdf8]/30">
              <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
              The Standard Difference
            </span>
            <h3 className="text-[28px] font-black text-white leading-[1.2] tracking-tight mb-3 drop-shadow-md">
              Architectural Integration <span className="text-[#38bdf8]">&amp;</span><br/>Engineering Focus
            </h3>
            <p className="text-slate-100 text-[14px] leading-relaxed px-2 font-medium">
              Precision engineering that connects design, performance, and people.
            </p>
          </div>

          {/* Vertical Timeline with Clear Contrast Cards */}
          <div className="relative w-full px-5">
            {/* Continuous Vertical Line */}
            <div className="absolute left-[44px] top-[28px] bottom-[28px] w-[2px] bg-[#38bdf8]/50 shadow-[0_0_10px_#38bdf8]" />

            <div className="flex flex-col gap-6 relative z-10">
              {STAGES.map((stage, i) => {
                const IconComp = stage.icon;
                return (
                  <div key={i} className="relative flex items-start w-full gap-4">
                    {/* Glowing Circular Node */}
                    <div className="relative z-10 w-[50px] h-[50px] rounded-full bg-[#020617] border-[2.5px] border-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5),inset_0_0_10px_rgba(56,189,248,0.3)] shrink-0 mt-1">
                      <IconComp size={22} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                    </div>
                    
                    {/* Text Content in readable card */}
                    <div className="flex-1 p-4.5 rounded-2xl bg-[#071930]/90 backdrop-blur-md border border-white/15 shadow-md">
                      <div className="text-[11px] font-mono font-bold text-[#38bdf8] mb-1 tracking-widest uppercase">
                        STAGE {stage.num}
                      </div>
                      <h4 className="text-[18px] font-bold text-white mb-1.5 leading-tight">
                        {stage.title}
                      </h4>
                      <p className="text-[13px] font-medium leading-[1.6] text-slate-100">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
