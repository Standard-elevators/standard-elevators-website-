"use client";

import React from "react";
import Image from "next/image";
import { Home, Building2, Briefcase, Plus, Settings, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "residential",
    title: "RESIDENTIAL",
    subtitle: "Private Villas & Bungalows",
    icon: <Home size={28} color="#38bdf8" strokeWidth={1.5} />,
    image: "/images/card_installation.jpg",
    link: "/contact?service=MRL+Lifts&type=Residential",
  },
  {
    id: "apartments",
    title: "APARTMENTS & RWAS",
    subtitle: "Residential Societies",
    icon: <Building2 size={28} color="#38bdf8" strokeWidth={1.5} />,
    image: "/images/card_modernization.jpg",
    link: "/contact?service=Passenger+Lifts&type=Apartment",
  },
  {
    id: "commercial",
    title: "COMMERCIAL",
    subtitle: "Offices & Shopping Complexes",
    icon: <Briefcase size={28} color="#38bdf8" strokeWidth={1.5} />,
    image: "/hero-elevator.jpg",
    link: "/contact?service=Passenger+Lifts&type=Commercial",
  },
  {
    id: "healthcare",
    title: "HEALTHCARE",
    subtitle: "Hospitals & Stretcher Lifts",
    icon: <Plus size={32} color="#38bdf8" strokeWidth={2} />,
    image: "/images/card_maintenance.jpg",
    link: "/contact?service=Hospital+Lifts&type=Healthcare",
  },
  {
    id: "industrial",
    title: "INDUSTRIAL",
    subtitle: "Goods & Cargo Freight",
    icon: <Settings size={28} color="#38bdf8" strokeWidth={1.5} />,
    image: "/images/card_installation.jpg",
    link: "/contact?service=Goods+Lifts&type=Industrial",
  },
  {
    id: "service",
    title: "SERVICE & UPGRADES",
    subtitle: "Modernization & AMC Contracts",
    icon: <Wrench size={28} color="#38bdf8" strokeWidth={1.5} />,
    image: "/images/card_modernization.jpg",
    link: "/contact?service=Modernization",
  },
];

export default function CustomerJourneys() {
  return (
    <section 
      className="relative w-full py-20 md:py-28 font-sans text-white overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #06112a 0%, #030814 100%)' }}
    >
      {/* 3D Perspective Grid Background for 'Emerging' Tech Feel */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         {/* The Grid Layer */}
         <div className="absolute inset-0" style={{
           backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
           backgroundSize: '40px 40px',
           backgroundPosition: 'center center',
           transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2.5)',
           transformOrigin: 'top center',
           opacity: 0.7
         }}></div>
         
         {/* Fade out the grid at the top and bottom so it blends smoothly */}
         <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #06112a 0%, transparent 30%, transparent 70%, #030814 100%)' }}></div>
      </div>

      {/* Floating 3D Ambient Orbs */}
      <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] rounded-full pointer-events-none opacity-30" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)', filter: 'blur(100px)', mixBlendMode: 'screen' }}></div>
      <div className="absolute bottom-1/4 -right-20 w-[40rem] h-[40rem] rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)', filter: 'blur(100px)', mixBlendMode: 'screen' }}></div>

      <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL HEADER */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-center mx-auto">
          <h2 className="text-xs md:text-[13px] font-bold tracking-widest uppercase mb-3 text-[#38bdf8]">
            Elevator Solutions
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-[44px] font-light leading-tight mb-4 tracking-wide text-white">
            Engineered for <br />
            <span className="font-bold">Your Property</span>
          </h3>
          <p className="text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto text-slate-300">
            Select your building category to discover tailored shaft dimensions, motor specifications, and turnkey quotation workflows.
          </p>
        </div>

        {/* GRID LAYOUT: 3 Cards Top, 3 Cards Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="w-full">
              <Link href={cat.link} className="block w-full outline-none group" draggable={false}>
                
                {/* PREMIUM BENTO/GLASS CARD */}
                <div 
                  className="relative w-full overflow-hidden shadow-2xl rounded-[22px] bg-[#0f172a] h-[380px] sm:h-[420px] md:h-[430px] transform transition-transform duration-500 md:hover:-translate-y-2"
                >
                  
                  {/* Real Photograph Background */}
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={cat.image} 
                      alt={cat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 ease-out md:group-hover:scale-110 brightness-[0.55] contrast-[1.1]"
                    />
                  </div>

                  {/* Depth Gradients */}
                  <div className="absolute inset-0 z-10 opacity-90 transition-opacity duration-500 md:group-hover:opacity-100 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                       
                  {/* Hover Accent Glow */}
                  <div className="hidden md:block absolute inset-0 z-10 opacity-0 transition-opacity duration-700 md:group-hover:opacity-100 mix-blend-screen bg-[radial-gradient(circle_at_center_bottom,rgba(56,189,248,0.25)_0%,transparent_60%)]" />

                  {/* Outer Border */}
                  <div className="absolute inset-0 z-20 pointer-events-none rounded-[24px] border border-white/10 md:border-transparent md:group-hover:border-2 md:group-hover:border-[#38bdf8]/40 transition-all duration-300" />

                  {/* CONTENT LAYER */}
                  <div className="absolute inset-0 z-30 p-6 sm:p-8 flex flex-col items-center justify-end">
                    
                    {/* Icon & Title */}
                    <div className="transform transition-transform duration-500 ease-out md:translate-y-12 md:group-hover:-translate-y-16 flex flex-col items-center text-center w-full mb-2 md:mb-0">
                      
                      {/* Icon */}
                      <div className="flex items-center justify-center rounded-full mb-4 sm:mb-6 transition-all duration-500 shadow-lg md:group-hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] md:group-hover:scale-110 w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/70 backdrop-blur-md border border-white/10">
                        {cat.icon}
                      </div>

                      {/* Title */}
                      <h4 className="text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-white uppercase drop-shadow-md">
                        {cat.title}
                      </h4>
                    </div>

                    {/* Subtitle & CTA: Always readable on mobile/touch, animated reveal on desktop hover */}
                    <div className="w-full flex flex-col items-center transition-all duration-500 ease-out mt-2 md:mt-0 md:absolute md:bottom-8 md:left-0 md:px-8 opacity-100 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      
                      {/* Accent Line */}
                      <div className="w-10 sm:w-12 h-1 mb-2 sm:mb-3 bg-[#38bdf8] rounded-full shadow-[0_0_10px_#38bdf8]" />
                      
                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm font-light text-center mb-3 sm:mb-5 text-slate-200">
                        {cat.subtitle}
                      </p>

                      {/* Button */}
                      <div className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all shadow-md bg-[#0ea5e9] border border-[#38bdf8] hover:scale-105 active:scale-95">
                        <span>View Specs</span>
                        <ArrowRight size={14} />
                      </div>

                    </div>

                  </div>

                </div>

              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
