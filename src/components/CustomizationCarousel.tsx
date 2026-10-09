"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_CAROUSEL_DATA = [
  {
    id: 0,
    title: "Cabin Models",
    image: "",
    description:
      "Premium architectural cabins with customizable paneling, finishes, and handrails to match any aesthetic.",
    items: ["Standard SS", "Premium Glass", "Custom Designs"],
  },
  {
    id: 1,
    title: "Door Options",
    image: "",
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
    image: "",
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
    image: "",
    description:
      "Heavy-duty geared, gearless, and hydraulic drive systems engineered for maximum durability and efficiency.",
    items: ["Geared Machines", "Gearless Machines", "Hydraulic Drives"],
  },
  {
    id: 4,
    title: "Interiors",
    image: "",
    description:
      "Elevate your space with luxurious flooring, elegant ceilings, and sophisticated custom LED lighting.",
    items: [
      "Custom Flooring",
      "Elegant Ceilings",
      "Integrated LED Lighting",
    ],
  },
];

import { getServicesPageSettings, DEFAULT_CUSTOMIZATION_DATA } from "@/lib/firestore-data";

export default function CustomizationCarousel({ initialData }: { initialData?: any[] }) {
  const [data, setData] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("se_services_page_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.customization?.length > 0) return parsed.customization;
        }
      } catch {}
    }
    return initialData && initialData.length > 0 ? initialData : DEFAULT_CUSTOMIZATION_DATA;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionState, setInteractionState] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  
  const interact = () => setInteractionState(c => c + 1);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const settings = await getServicesPageSettings();
        if (isMounted && settings?.customization && settings.customization.length > 0) {
          setData(settings.customization);
        }
      } catch (err) {
        console.warn("CustomizationCarousel load failed:", err);
      }
    }

    loadData();

    if (typeof window !== "undefined") {
      const handleSync = () => loadData();
      window.addEventListener("se_services_page_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        isMounted = false;
        window.removeEventListener("se_services_page_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const length = data.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
  }, [length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? length - 1 : current - 1));
  }, [length]);

  // Autoplay functionality
  useEffect(() => {
    if (isHoverPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 4500); // 4.5 seconds
    
    return () => clearInterval(timer);
  }, [nextSlide, interactionState, isHoverPaused]);

  // Touch handlers (optimized with refs so touchmove does not trigger continuous re-renders)
  const minSwipeDistance = 45;
  
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    interact();
    touchEndRef.current = null;
    if ("touches" in e) {
      touchStartRef.current = e.targetTouches[0].clientX;
    } else {
      touchStartRef.current = e.clientX;
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartRef.current === null) return;
    if ("touches" in e) {
      touchEndRef.current = e.targetTouches[0].clientX;
    } else {
      touchEndRef.current = e.clientX;
    }
  };

  const onTouchEnd = () => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
      interact();
    } else if (isRightSwipe) {
      prevSlide();
      interact();
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { prevSlide(); interact(); }
    if (e.key === "ArrowRight") { nextSlide(); interact(); }
  };

  return (
    <section 
      id="customization"
      className="relative w-full py-24 md:py-32 bg-[#F8FAFC] overflow-hidden group/section"
      aria-labelledby="customization-heading"
    >
      {/* Premium Navy Mesh Background */}
      <div className="absolute inset-0 z-0 bg-[#071221] pointer-events-none overflow-hidden">
        
        {/* Soft Ambient Light Orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#0062FF]/10 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#38BDF8]/10 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_alternate-reverse]"></div>

        {/* Navy Mesh Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)`, 
               backgroundSize: "40px 40px" 
             }}>
        </div>

        {/* Light Stage Reflection */}
        <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-[#071221] via-[#071221]/80 to-transparent z-0"></div>
      </div>

      <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block px-5 py-2 rounded-full border border-[#0062FF]/20 bg-[#0062FF]/5 text-[#0062FF] text-[11px] font-bold uppercase tracking-[0.25em] mb-6 shadow-sm">
            Engineering Excellence
          </span>
          <h2 id="customization-heading" className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-6 tracking-tight">
            Elevator Customization <br className="hidden md:block"/>& Components
          </h2>
          <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
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
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => {
            onTouchEnd();
            setIsHoverPaused(false);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {data.map((card, index) => {
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
                key={card.id || `custom-${index}`}
                onClick={() => { setActiveIndex(index); interact(); }}
                className={`absolute top-1/2 left-1/2 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] h-[450px] sm:h-[400px] md:h-[420px] lg:h-[440px] rounded-[24px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer select-none group/card will-change-transform`}
                style={{
                  transform: `translate3d(calc(-50% + ${translateX}%), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  pointerEvents: "auto",
                  willChange: "transform, opacity",
                }}
                aria-hidden={!isActive}
              >
                {/* Card Surface */}
                <div className={`relative w-full h-full rounded-[24px] overflow-hidden bg-white shadow-xl flex flex-col group transition-all duration-300 border ${isActive ? 'border-transparent shadow-[0_20px_50px_-10px_rgba(0,98,255,0.2)]' : 'border-slate-200'}`}>
                  
                  {/* Image Area - top part when active, full height when inactive */}
                  <div className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out bg-[#06172B] ${isActive ? 'h-[65%] md:h-[70%]' : 'h-full'}`}>
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className={`object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-100 group-hover/card:scale-105' : 'scale-110'}`}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#071221] to-[#0A2342] flex items-center justify-center" />
                    )}
                  </div>

                  {/* Dark overlay for inactive cards */}
                  <div className={`absolute inset-0 bg-[#050C17] transition-opacity duration-300 z-10 pointer-events-none ${isActive ? 'opacity-0' : Math.abs(diff) === 1 ? 'opacity-50' : 'opacity-80'}`} />

                  {/* Content Area - bottom part */}
                  <div className={`flex flex-col justify-center bg-white p-5 lg:p-6 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] relative z-20 ${
                    isActive 
                      ? 'flex-1 opacity-100 translate-y-0' 
                      : 'h-0 opacity-0 overflow-hidden pointer-events-none p-0 invisible'
                  }`}>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900">
                      {card.title}
                    </h3>
                    <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed font-normal m-0 line-clamp-3">
                      {card.description}
                    </p>
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
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-[#0062FF] hover:border-[#0062FF] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_25px_rgba(0,98,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
            aria-label="Previous component"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2.5">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); interact(); }}
                className={`transition-all duration-500 rounded-full ${activeIndex === i ? 'w-10 h-2 bg-[#0062FF] shadow-[0_0_15px_rgba(0,98,255,0.4)]' : 'w-2 h-2 bg-slate-300 hover:bg-[#0062FF]/40'}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeIndex === i ? "true" : "false"}
              />
            ))}
          </div>

          <button
            onClick={() => { nextSlide(); interact(); }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-[#0062FF] hover:border-[#0062FF] hover:text-white transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_25px_rgba(0,98,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
            aria-label="Next component"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
