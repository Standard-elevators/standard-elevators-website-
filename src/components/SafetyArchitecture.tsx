"use client";

import React from "react";
import { ShieldCheck, Cog, Activity, Layers } from "lucide-react";

export default function SafetyArchitecture() {
  return (
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="group relative p-4 md:p-6 rounded-2xl md:rounded-2xl overflow-hidden shadow-xs md:shadow-lg flex flex-col items-center md:items-start text-center md:text-left justify-center md:justify-start h-[150px] md:h-auto border border-[#CBD5E1]/20">
            <div className="absolute inset-0 z-0">
              <img src="/images/card_installation.jpg" alt="ARD System" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#071426]/80 group-hover:bg-[#071426]/70 transition-colors"></div>
            </div>
            <div className="relative z-10 w-12 h-12 md:w-10 md:h-10 rounded-full md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#28B8FF] mb-3 md:mb-4 mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="relative z-10 text-[13px] md:text-lg font-bold text-white md:mb-2 leading-tight">ARD System</h4>
            <p className="relative z-10 hidden md:block text-xs text-slate-300 leading-relaxed mt-2">
              Emergency battery system that safely guides the car to the nearest floor and unlocks doors during utility power interruptions.
            </p>
          </div>

          <div className="group relative p-4 md:p-6 rounded-2xl md:rounded-2xl overflow-hidden shadow-xs md:shadow-lg flex flex-col items-center md:items-start text-center md:text-left justify-center md:justify-start h-[150px] md:h-auto border border-[#CBD5E1]/20">
            <div className="absolute inset-0 z-0">
              <img src="/images/card_modernization.jpg" alt="Over-Speed Governor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#071426]/80 group-hover:bg-[#071426]/70 transition-colors"></div>
            </div>
            <div className="relative z-10 w-12 h-12 md:w-10 md:h-10 rounded-full md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#28B8FF] mb-3 md:mb-4 mx-auto md:mx-0">
              <Cog className="w-5 h-5" />
            </div>
            <h4 className="relative z-10 text-[13px] md:text-lg font-bold text-white md:mb-2 leading-tight">Over-Speed Governor</h4>
            <p className="relative z-10 hidden md:block text-xs text-slate-300 leading-relaxed mt-2">
              Instantaneous and progressive mechanical safety gear that clamps firmly onto the guide rails if normal descending speed is exceeded.
            </p>
          </div>

          <div className="group relative p-4 md:p-6 rounded-2xl md:rounded-2xl overflow-hidden shadow-xs md:shadow-lg flex flex-col items-center md:items-start text-center md:text-left justify-center md:justify-start h-[150px] md:h-auto border border-[#CBD5E1]/20">
            <div className="absolute inset-0 z-0">
              <img src="/images/card_maintenance.jpg" alt="Infrared Curtain" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#071426]/80 group-hover:bg-[#071426]/70 transition-colors"></div>
            </div>
            <div className="relative z-10 w-12 h-12 md:w-10 md:h-10 rounded-full md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#28B8FF] mb-3 md:mb-4 mx-auto md:mx-0">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="relative z-10 text-[13px] md:text-lg font-bold text-white md:mb-2 leading-tight">Infrared Curtain</h4>
            <p className="relative z-10 hidden md:block text-xs text-slate-300 leading-relaxed mt-2">
              Full-height optical multi-beam sensor scanning the door entrance to prevent closure if passengers, pets, or objects cross the threshold.
            </p>
          </div>

          <div className="group relative p-4 md:p-6 rounded-2xl md:rounded-2xl overflow-hidden shadow-xs md:shadow-lg flex flex-col items-center md:items-start text-center md:text-left justify-center md:justify-start h-[150px] md:h-auto border border-[#CBD5E1]/20">
            <div className="absolute inset-0 z-0">
              <img src="/images/3d_service.jpg" alt="Phase Failure" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#071426]/80 group-hover:bg-[#071426]/70 transition-colors"></div>
            </div>
            <div className="relative z-10 w-12 h-12 md:w-10 md:h-10 rounded-full md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#28B8FF] mb-3 md:mb-4 mx-auto md:mx-0">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="relative z-10 text-[13px] md:text-lg font-bold text-white md:mb-2 leading-tight">Phase Failure</h4>
            <p className="relative z-10 hidden md:block text-xs text-slate-300 leading-relaxed mt-2">
              Intelligent electrical monitors preventing elevator operation under phase loss, reverse phasing, or rated weight capacity breach.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
