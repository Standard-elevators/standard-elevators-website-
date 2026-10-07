"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Wrench, Headset, ChevronLeft, ChevronRight } from "lucide-react";

const MOBILE_STAGES = [
  { num: "01", title: "Planning", desc: "Detailed site study, architectural shaft drafting, and structural planning.", img: "/images/standard-difference-bg.jpg", icon: FileText },
  { num: "02", title: "Manufacturing", desc: "High-grade steel fabrication, gearless motor assembly, and BIS quality checks.", img: "/images/card_modernization.jpg", icon: ShieldCheck },
  { num: "03", title: "Installation", desc: "Skilled hoistway installation, guide rail alignment, and testing.", img: "/images/card_installation.jpg", icon: Wrench },
  { num: "04", title: "After-Sales & AMC", desc: "Scientific maintenance schedules, safety audits, and rapid support.", img: "/images/3d_apartments.jpg", icon: Headset }
];

export default function StandardDifference() {
  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP VERSION - STRICTLY UNTOUCHED       */}
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

    {/* ========================================== */}
    {/* MOBILE VERSION - PREMIUM VERTICAL TIMELINE */}
    {/* ========================================== */}
    <section className="block md:hidden relative w-full overflow-hidden text-white py-16 bg-[#020617]">
      {/* Background Image Setup matches desktop */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/standard-difference-bg.jpg" 
          alt="Architectural Elevator Integration by Standard Engineering Works" 
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/60 to-[#020617]/90" />
      </div>

      <div className="relative z-10 w-full flex flex-col h-full">
        {/* Intro Typography */}
        <div className="mb-12 px-5 text-center">
          <h2 className="text-[#38bdf8] text-[11px] font-bold tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
            The Standard Difference
          </h2>
          <h3 className="text-[28px] font-extrabold text-white leading-[1.2] tracking-tight mb-4 drop-shadow-md">
            Architectural Integration <span className="text-[#38bdf8]">&amp;</span><br/>Engineering Focus
          </h3>
          <p className="text-slate-300 text-[14px] leading-relaxed px-2 font-light">
            Precision engineering that connects design, performance, and people.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative w-full px-6">
          
          {/* Continuous Vertical Line */}
          <div className="absolute left-[52px] top-[28px] bottom-[28px] w-[2px] bg-[#38bdf8]/40 shadow-[0_0_10px_#38bdf8]" />

          <div className="flex flex-col gap-10 relative z-10">
            {MOBILE_STAGES.map((stage, i) => (
              <div key={i} className="relative flex items-start w-full">
                
                {/* Glowing Circular Node */}
                <div className="relative z-10 w-[56px] h-[56px] rounded-full bg-[#020617] border-[2.5px] border-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5),inset_0_0_10px_rgba(56,189,248,0.3)] shrink-0">
                  <stage.icon size={22} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                </div>
                
                {/* Text Content */}
                <div className="pl-6 pt-1 flex-1">
                  <div className="text-[12px] font-bold text-[#38bdf8] mb-1 tracking-widest uppercase">STAGE {stage.num}</div>
                  <h4 className="text-[20px] font-bold text-white mb-2 leading-tight">{stage.title}</h4>
                  <p className="text-[14px] font-light leading-[1.65] text-slate-300">
                    {stage.desc}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
