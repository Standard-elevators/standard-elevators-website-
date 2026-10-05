"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative w-full flex flex-col lg:flex-row overflow-hidden border-t border-slate-100 bg-[#F7F9FC]">
      
      {/* LEFT IMAGE AREA (Base Layer for Desktop, Top block for Mobile) */}
      <div className="relative order-1 lg:order-none lg:absolute lg:inset-0 lg:right-[45%] w-full h-[240px] sm:h-[300px] lg:w-auto lg:h-full z-0">
        <Image 
          src="/images/3d_commercial.jpg"
          alt="Premium Elevator Architectural Lobby"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {/* Subtle shadow overlay on right side of image for depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-transparent hidden lg:block pointer-events-none" />
      </div>

      {/* RIGHT CONTENT AREA (Bottom block for Mobile, Right overlay for Desktop) */}
      <div className="relative order-2 lg:order-none w-full lg:w-[62%] lg:ml-auto z-10 flex flex-col">
        
        {/* Inject clip-path styles for the diagonal transition only on Desktop (mirrored to left edge) */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .cta-blue-edge { clip-path: polygon(130px 0, 100% 0, 100% 100%, 0 100%); }
            .cta-light-panel { clip-path: polygon(134px 0, 100% 0, 100% 100%, 4px 100%); }
          }
        `}} />

        {/* Thin Blue Edge Layer (Desktop Only) */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#0088FF] to-[#0062FF] opacity-95 hidden lg:block cta-blue-edge z-0 shadow-xl" />

        {/* Light Architectural Panel Layer */}
        <div className="relative w-full h-full bg-[#F7F9FC] cta-light-panel z-10 pt-10 pb-12 px-5 sm:px-10 lg:pl-[160px] lg:pr-[10%] lg:py-16 xl:py-20 flex flex-col justify-center shadow-2xl">
          
          {/* Subtle Background Architectural Curve & Mesh */}
          <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none rounded-br-full opacity-50 transform -translate-x-1/4 -translate-y-1/4 z-0" />
          
          <div 
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(#0062FF 1px, transparent 1px), linear-gradient(90deg, #0062FF 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />
          
          {/* Skyline Background Decoration */}
          <div className="absolute bottom-0 right-0 w-full h-[70px] sm:h-[90px] lg:h-[110px] pointer-events-none opacity-[0.25] z-0 overflow-hidden flex items-end">
            <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full stroke-slate-400/80 fill-none" strokeWidth="1.2">
              <path d="M0,150 L0,120 L25,120 L25,100 L50,100 L50,80 L60,80 L60,110 L85,110 L85,50 L110,50 L110,90 L135,90 L135,30 L160,30 L160,100 L185,100 L185,60 L210,60 L210,115 L235,115 L235,70 L260,70 L260,20 L285,20 L285,85 L310,85 L310,40 L335,40 L335,105 L360,105 L360,55 L385,55 L385,120 L410,120 L410,75 L435,75 L435,25 L460,25 L460,95 L485,95 L485,65 L510,65 L510,110 L535,110 L535,45 L560,45 L560,100 L585,100 L585,35 L610,35 L610,90 L635,90 L635,50 L660,50 L660,115 L685,115 L685,80 L710,80 L710,30 L735,30 L735,105 L760,105 L760,60 L785,60 L785,15 L810,15 L810,85 L835,85 L835,40 L860,40 L860,95 L885,95 L885,55 L910,55 L910,110 L935,110 L935,70 L960,70 L960,25 L985,25 L985,150 L1000,150" />
              <path d="M25,120 L25,150 M50,100 L50,150 M85,110 L85,150 M110,90 L110,150 M135,90 L135,150 M160,100 L160,150 M185,100 L185,150 M210,115 L210,150 M235,115 L235,150 M260,85 L260,150 M285,85 L285,150 M310,105 L310,150 M335,105 L335,150 M360,120 L360,150 M385,120 L385,150 M410,95 L410,150 M435,95 L435,150 M460,110 L460,150 M485,110 L485,150 M510,100 L510,150 M535,100 L535,150 M560,90 L560,150 M585,90 L585,150 M610,115 L610,150 M635,115 L635,150 M660,105 L660,150 M685,105 L685,150 M710,85 L710,150 M735,85 L735,150 M760,110 L760,150 M785,110 L785,150 M810,95 L810,150 M835,95 L835,150 M860,110 L860,150 M885,110 L885,150 M910,95 L910,150 M935,95 L935,150 M960,110 L960,150 M985,110 L985,150" strokeWidth="0.5" className="stroke-slate-400/40" />
            </svg>
          </div>

          {/* Foreground Text & Actions */}
          <div className="relative z-10 max-w-[520px] mx-auto lg:mx-0 w-full text-center lg:text-left">
            {/* Small decorative blue line */}
            <div className="w-12 h-[3px] bg-[#0062FF] mb-5 rounded-full mx-auto lg:mx-0" />
            
            {/* Headline */}
            <h2 className="text-[clamp(28px,3vw,46px)] font-extrabold leading-[1.15] tracking-tight text-[#071221] mb-2">
              Planning Your Next <br />
              <span className="text-[#0062FF]">Vertical Journey?</span>
            </h2>
            
            {/* Supporting description */}
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-slate-600 leading-relaxed max-w-[440px] mb-6 mt-4 font-medium mx-auto lg:mx-0">
              Discuss your structural requirements, elevator specifications, and timeline with our engineering team today.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <Link 
                href="/contact" 
                className="group flex items-center justify-center gap-2 h-12 lg:h-[52px] px-6 lg:px-8 bg-[#0062FF] hover:bg-[#0052DF] text-white text-[15px] lg:text-[15.5px] font-bold rounded-xl shadow-[0_6px_16px_rgba(0,98,255,0.25)] hover:shadow-[0_8px_20px_rgba(0,98,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Request a Quotation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <a 
                href="tel:9515231555" 
                className="group flex items-center justify-center gap-2 h-12 lg:h-[52px] px-6 lg:px-8 bg-white border-2 border-slate-200 hover:border-[#0062FF] text-[#071221] text-[15px] lg:text-[15.5px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#F0F5FF] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-[#0062FF] group-hover:scale-110 transition-transform duration-300" />
                <span>Call 9515231555</span>
              </a>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
