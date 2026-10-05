"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ENGINEERING_SERVICES = [
  {
    id: "01",
    title: "New Installation",
    image: "/images/card_installation.jpg",
    desc: "Complete turnkey installation of passenger, hospital, goods, and bespoke elevators with structural integration.",
    href: "/services", 
  },
  {
    id: "02",
    title: "Modernization",
    image: "/images/card_modernization.jpg",
    desc: "Upgrade outdated elevator systems with modern microprocessor controllers, new cabins, and energy-efficient drives.",
    href: "/services",
  },
  {
    id: "03",
    title: "Repairs",
    image: "/images/3d_service.jpg",
    desc: "Expert diagnostic and repair services for mechanical, electrical, and hydraulic elevator systems.",
    href: "/services",
  },
  {
    id: "04",
    title: "Maintenance",
    image: "/images/card_maintenance.jpg",
    desc: "Comprehensive preventative maintenance programs to ensure safety, reliability, and extended equipment lifespan.",
    href: "/services",
  },
  {
    id: "05",
    title: "Aftersales Services",
    image: "/images/3d_apartments.jpg",
    desc: "Dedicated post-installation support and technical assistance for all our elevator products.",
    href: "/services",
  }
];

export default function EngineeringServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionState, setInteractionState] = useState(0);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isHoverPaused, setIsHoverPaused] = useState(false);

  const interact = () => setInteractionState((c) => c + 1);

  const length = ENGINEERING_SERVICES.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
  }, [length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? length - 1 : current - 1));
  }, [length]);

  // Autoplay
  useEffect(() => {
    if (isHoverPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, interactionState, isHoverPaused]);

  // Touch Handlers
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { prevSlide(); interact(); }
    if (e.key === "ArrowRight") { nextSlide(); interact(); }
  };

  return (
    <section 
      className="py-20 md:py-32 bg-[#020813] text-white relative overflow-hidden"
      aria-labelledby="engineering-heading"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        {/* Deep blue radial glows */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#0062FF]/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#38BDF8]/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0062FF]/30 bg-[#0062FF]/10 text-[#38BDF8] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
            Comprehensive Support
          </span>
          <h2 id="engineering-heading" className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Engineering Services
          </h2>
          <p className="text-[#94A3B8] text-base md:text-xl font-light leading-relaxed">
            Beyond manufacturing, we provide comprehensive lifecycle support for vertical mobility infrastructure.
          </p>
        </div>

        {/* Expanding Cards Container */}
        <div 
          className="relative w-full h-[440px] md:h-[480px] flex gap-3 md:gap-4 touch-pan-y items-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onMouseLeaveCapture={onTouchEnd}
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => setIsHoverPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {ENGINEERING_SERVICES.map((srv, index) => {
            const isActive = index === activeIndex;
            
            return (
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                key={srv.id}
                onClick={() => {
                  setActiveIndex(index);
                  interact();
                }}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                    setActiveIndex(index);
                    interact();
                  }
                }}
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer ${
                  isActive 
                    ? "h-full w-full md:flex-[5] shadow-2xl ring-1 ring-inset ring-white/20 block" 
                    : "h-[90%] md:h-[85%] hidden md:block md:flex-[1] shadow-lg hover:ring-1 hover:ring-inset hover:ring-white/30 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Background Image */}
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  sizes={isActive ? "100vw" : "20vw"}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                />
                
                {/* Gradient Overlays */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'bg-gradient-to-t from-[#020813] via-[#020813]/60 to-transparent opacity-90' : 'bg-[#020813]/60 group-hover:bg-[#020813]/40'}`} />
                
                {/* Active Card Content */}
                <motion.div 
                  layout
                  transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-end transition-opacity duration-300 ${
                    isActive ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="max-w-2xl">
                    <span className="text-[#38BDF8] font-mono text-sm tracking-widest font-bold mb-3 block">
                      {srv.id} &mdash; FIELD CREW
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      {srv.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm md:text-lg leading-relaxed mb-4 max-w-xl">
                      {srv.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Inactive Card Vertical Content */}
                <motion.div 
                  layout
                  transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 ${
                    isActive ? "opacity-0 pointer-events-none" : "opacity-100 delay-200"
                  }`}
                >
                  <span className="text-[#38BDF8] font-mono font-bold text-lg">
                    {srv.id}
                  </span>
                  
                  {/* Vertical Title */}
                  <h3 
                    className="text-white font-bold text-2xl tracking-wide whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {srv.title}
                  </h3>
                  
                  {/* Circular Thumbnail */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg shadow-black/50 relative">
                    <Image
                      src={srv.image}
                      alt={`${srv.title} thumbnail`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>

              </motion.div>
            );
          })}
        </div>

        {/* Mobile / Tablet Arrows */}
        <div className="flex items-center justify-center gap-6 mt-8 z-20 md:hidden">
          <button
            onClick={() => { prevSlide(); interact(); }}
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                prevSlide(); interact();
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-[#0062FF] hover:border-[#0062FF] transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {ENGINEERING_SERVICES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); interact(); }}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                    setActiveIndex(i); interact();
                  }
                }}
                className={`transition-all duration-300 rounded-full ${activeIndex === i ? 'w-6 h-2 bg-[#38BDF8]' : 'w-2 h-2 bg-white/30'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => { nextSlide(); interact(); }}
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                nextSlide(); interact();
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-[#0062FF] hover:border-[#0062FF] transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
