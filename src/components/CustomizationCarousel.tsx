"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const CAROUSEL_DATA = [
  {
    id: 0,
    title: "Cabin Models",
    image: "/images/3d_apartments.jpg",
    description:
      "Premium architectural cabins with customizable paneling, finishes, and handrails to match any aesthetic.",
    items: ["Standard SS", "Premium Glass", "Custom Designs"],
  },
  {
    id: 1,
    title: "Door Options",
    image: "/images/card_installation.jpg",
    description:
      "High-performance automatic and manual door systems engineered for rapid, safe, and silent operation.",
    items: [
      "Automatic Sliding Doors",
      "Manual Collapsible",
      "Premium Glass Doors",
    ],
  },
  {
    id: 2,
    title: "Control & Safety",
    image: "/images/3d_service.jpg",
    description:
      "Advanced microprocessor controllers and intelligent sensors ensuring smooth, reliable, and perfectly leveled rides.",
    items: [
      "Microprocessor Control",
      "ARD (Auto Rescue Device)",
      "Advanced Safety Gears",
    ],
  },
  {
    id: 3,
    title: "Machinery",
    image: "/images/3d_industrial.jpg",
    description:
      "Heavy-duty geared, gearless, and hydraulic drive systems engineered for maximum durability and efficiency.",
    items: ["Geared Machines", "Gearless Machines", "Hydraulic Drives"],
  },
  {
    id: 4,
    title: "Interiors",
    image: "/images/futuristic-glass-elevator-blue.png",
    description:
      "Elevate your space with luxurious flooring, elegant ceilings, and sophisticated custom LED lighting.",
    items: [
      "Custom Flooring",
      "Elegant Ceilings",
      "Integrated LED Lighting",
    ],
  },
];

export default function CustomizationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionState, setInteractionState] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const interact = () => setInteractionState(c => c + 1);

  const length = CAROUSEL_DATA.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
  }, [length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? length - 1 : current - 1));
  }, [length]);

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4500); // 4.5 seconds
    
    return () => clearInterval(timer);
  }, [nextSlide, interactionState]);

  // Touch handlers
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    interact();
    setTouchEnd(null);
    if ("touches" in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart(e.clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return;
    if ("touches" in e) {
      setTouchEnd(e.targetTouches[0].clientX);
    } else {
      setTouchEnd(e.clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
      interact();
    }
    if (isRightSwipe) {
      prevSlide();
      interact();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { prevSlide(); interact(); }
    if (e.key === "ArrowRight") { nextSlide(); interact(); }
  };

  return (
    <section 
      className="relative w-full py-20 md:py-32 bg-slate-50 overflow-hidden group/section"
      aria-labelledby="customization-heading"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
        
        {/* Soft Dynamic Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#0062FF]/[0.08] rounded-full blur-[120px] mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#38BDF8]/[0.08] rounded-full blur-[120px] mix-blend-multiply animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]"></div>
        <div className="absolute top-[20%] left-[40%] w-[40%] h-[40%] bg-indigo-500/[0.05] rounded-full blur-[100px] mix-blend-multiply"></div>

        {/* Dual-Scale Architectural Grid (Engineering Graph Paper) */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)`, 
               backgroundSize: "60px 60px" 
             }}>
        </div>
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `linear-gradient(#000000 2px, transparent 2px), linear-gradient(90deg, #000000 2px, transparent 2px)`, 
               backgroundSize: "240px 240px" 
             }}>
        </div>

        {/* Elevator Shaft Vertical Accents (Guide Rails) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] bg-gradient-to-b from-transparent via-[#0062FF]/[0.03] to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[calc(50%-150px)] md:left-[calc(50%-200px)] w-px bg-gradient-to-b from-transparent via-[#0062FF]/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-[calc(50%+150px)] md:left-[calc(50%+200px)] w-px bg-gradient-to-b from-transparent via-[#0062FF]/20 to-transparent"></div>

        {/* Premium Glassmorphism Angular Slash */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[120%] bg-gradient-to-b from-white/80 to-transparent skew-x-[-15deg] transform origin-top border-l border-white/50 shadow-[inset_0_0_50px_rgba(255,255,255,0.5)] blur-[1px]"></div>

        {/* Glowing Floor Stage */}
        <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-white via-white/80 to-transparent z-0"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[200px] bg-gradient-to-t from-[#0062FF]/10 to-transparent blur-[30px] rounded-t-[100%] scale-y-50 origin-bottom"></div>
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[60vw] max-w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#0062FF]/30 to-transparent"></div>
      </div>

      <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0062FF]/20 bg-[#0062FF]/5 text-[#0062FF] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
            Engineering Excellence
          </span>
          <h2 id="customization-heading" className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Elevator Customization & Components
          </h2>
          <p className="text-slate-600 text-base md:text-xl font-light leading-relaxed">
            Tailor every aspect of your elevator system. From advanced microprocessor controls to premium cabin interiors, we offer extensive customization to match your architectural vision.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative w-full max-w-[1200px] h-[500px] sm:h-[450px] md:h-[460px] lg:h-[480px] flex items-center justify-center perspective-[2000px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onMouseLeave={onTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {CAROUSEL_DATA.map((card, index) => {
            // Calculate relative position (-2, -1, 0, 1, 2)
            let diff = index - activeIndex;
            
            // Handle infinite wrapping math
            if (diff > Math.floor(length / 2)) {
              diff -= length;
            } else if (diff < -Math.floor(length / 2)) {
              diff += length;
            }

            const isActive = diff === 0;
            const isVisible = Math.abs(diff) <= 2; // Show 5 cards max on desktop

            // Responsive transforms based on diff
            const translateX = diff * 45; // percentage based
            const translateZ = Math.abs(diff) * -160;
            const rotateY = diff * -16; // cards face slightly inward
            const scale = isActive ? 1 : 1 - (Math.abs(diff) * 0.12);
            const zIndex = 50 - Math.abs(diff) * 10;

            if (!isVisible && !isActive) return null;

            return (
              <div
                key={card.id}
                onClick={() => { setActiveIndex(index); interact(); }}
                className={`absolute top-1/2 left-1/2 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] h-[450px] sm:h-[400px] md:h-[420px] lg:h-[440px] rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer select-none`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  pointerEvents: "auto",
                }}
                aria-hidden={!isActive}
              >
                {/* Card Surface */}
                <div className={`relative w-full h-full rounded-3xl overflow-hidden bg-[#0A1628] border ${isActive ? 'border-[#0062FF]/50 shadow-[0_20px_60px_-15px_rgba(0,98,255,0.3)]' : 'border-white/10 shadow-xl'} flex flex-col group transition-all duration-500`}>
                  
                  {/* Natural Depth Dimming Overlay for Background Side Cards */}
                  <div className={`absolute inset-0 bg-[#06172B] transition-opacity duration-500 pointer-events-none z-20 ${isActive ? 'opacity-0' : Math.abs(diff) === 1 ? 'opacity-35' : 'opacity-65'}`} />

                  {/* Image Area - Expands to full height on background cards, compact on active card */}
                  <div className={`relative w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'h-[42%]' : 'h-full'}`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={`object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-100 group-hover:scale-105' : 'scale-105'}`}
                      draggable={false}
                    />
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-transparent' : 'bg-gradient-to-t from-[#0A1628]/50 to-transparent'}`}></div>
                    {/* Subtle border glow on image */}
                    {isActive && <div className="absolute inset-0 ring-1 ring-inset ring-[#0062FF]/30 rounded-t-3xl pointer-events-none"></div>}
                  </div>

                  {/* Content Area - ONLY visible on the Active Card, hidden completely on background cards */}
                  <div className={`flex flex-col p-5 lg:p-6 pt-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isActive 
                      ? 'flex-1 opacity-100 translate-y-0' 
                      : 'h-0 opacity-0 overflow-hidden pointer-events-none p-0 invisible'
                  }`}>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4 font-light">
                      {card.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="mt-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3"></div>
                      <ul className="grid grid-cols-1 gap-y-2">
                        {card.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-[#0062FF]/20 text-[#38BDF8]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs font-medium text-slate-200">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-8 md:mt-12 z-20">
          <button
            onClick={() => { prevSlide(); interact(); }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#0062FF] hover:border-[#0062FF] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_25px_rgba(0,98,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
            aria-label="Previous component"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {CAROUSEL_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); interact(); }}
                className={`transition-all duration-300 rounded-full ${activeIndex === i ? 'w-8 h-2 bg-[#0062FF] shadow-[0_0_10px_rgba(0,98,255,0.4)]' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeIndex === i ? "true" : "false"}
              />
            ))}
          </div>

          <button
            onClick={() => { nextSlide(); interact(); }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#0062FF] hover:border-[#0062FF] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_25px_rgba(0,98,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
            aria-label="Next component"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
