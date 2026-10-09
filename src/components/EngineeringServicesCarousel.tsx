"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_ENGINEERING_SERVICES = [
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

export default function EngineeringServicesCarousel({ initialData, showViewAllButton }: { initialData?: any[], showViewAllButton?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionState, setInteractionState] = useState(0);
  
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const [isHoverPaused, setIsHoverPaused] = useState(false);

  const interact = () => setInteractionState((c) => c + 1);

  const services = initialData && initialData.length > 0 ? initialData : DEFAULT_ENGINEERING_SERVICES;
  const length = services.length;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { prevSlide(); interact(); }
    if (e.key === "ArrowRight") { nextSlide(); interact(); }
  };

  return (
    <section 
      id="engineering-services"
      className="py-20 md:py-32 bg-white text-slate-900 relative"
      aria-labelledby="engineering-heading"
    >
      {/* Creative Light Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-white">
        {/* Elegant structural grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#0062FF 1px, transparent 1px), linear-gradient(90deg, #0062FF 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        {/* Soft, creative colorful Orbs for light theme */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-[#0062FF]/[0.06] to-purple-500/[0.04] rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#38BDF8]/[0.08] to-[#0062FF]/[0.04] rounded-full blur-[90px] -translate-x-1/4 translate-y-1/4" />
        
        {/* Diagonal Light Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[200px] bg-gradient-to-r from-transparent via-[#0062FF]/[0.02] to-transparent -rotate-45 blur-[20px]" />
      </div>

      <div className="site-container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#0062FF]/20 bg-[#0062FF]/5 text-[#0062FF] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
            Comprehensive Support
          </span>
          <h2 id="engineering-heading" className="text-3xl md:text-5xl font-extrabold text-[#0B1F38] mb-6 tracking-tight">
            Engineering Services
          </h2>
          <p className="text-black font-medium text-[17px] md:text-[20px] leading-relaxed">
            Beyond manufacturing, we provide comprehensive lifecycle support for vertical mobility infrastructure.
          </p>
        </div>

        {/* Expanding Cards Container (DESKTOP ONLY) */}
        <div 
          className="relative w-full h-[480px] hidden md:flex gap-4 touch-pan-y items-center"
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
          {services.map((srv, index) => {
            const isActive = index === activeIndex;
            
            return (
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                key={srv.id || `srv-${index}`}
                onClick={() => {
                  setActiveIndex(index);
                  interact();
                }}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  interact();
                }}
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer ${
                  isActive 
                    ? "h-full w-full md:flex-[5] shadow-[0_20px_50px_rgba(0,30,80,0.15)] ring-1 ring-inset ring-[#0062FF]/20 block" 
                    : "h-[90%] md:h-[85%] hidden md:block md:flex-[1] shadow-lg hover:ring-1 hover:ring-inset hover:ring-[#0062FF]/30 opacity-[0.85] hover:opacity-100"
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
                    <p className="text-[#94A3B8] text-sm md:text-lg leading-relaxed mb-6 max-w-xl">
                      {srv.desc}
                    </p>
                    <div className="flex items-center gap-3.5">
                      <Link
                        href={`/contact?service=${encodeURIComponent(srv.title)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0062FF] to-[#0A78F5] hover:from-[#0052DF] hover:to-[#0062FF] text-white text-sm font-bold shadow-[0_4px_20px_rgba(0,98,255,0.45)] hover:shadow-[0_6px_25px_rgba(0,98,255,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
                      >
                        <span>Request a Quote</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={srv.href || "/services"}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02]"
                      >
                        <span>Explore Details</span>
                      </Link>
                    </div>
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

        {/* MOBILE VIEW - Premium Sticky Deck Stack */}
        <div className="block md:hidden relative w-full mt-4 pb-6">
          <div className="flex flex-col w-full relative" style={{ gap: '20vh' }}>
            {services.map((srv, index) => {
              // Base top offset + progressive layer offset for the deck stacking effect
              const stickyTop = 85 + (index * 16); 
              
              return (
                <div 
                  key={`mobile-${srv.id || index}`}
                  className="sticky w-full rounded-[28px] overflow-hidden bg-white flex flex-col will-change-transform shadow-[0_-15px_40px_rgba(11,31,56,0.15)] border border-slate-100"
                  style={{ 
                    top: `${stickyTop}px`,
                    height: '62vh',
                    minHeight: '420px',
                    maxHeight: '550px',
                    zIndex: 10 + index
                  }}
                >
                  {/* Image Area - 55% height */}
                  <div className="relative w-full h-[55%] bg-[#040D1A] overflow-hidden shrink-0">
                     <Image 
                       src={srv.image} 
                       alt={srv.title}
                       fill
                       sizes="(max-width: 768px) 100vw, 0vw"
                       className="object-cover object-center"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  
                  {/* Content Area - 45% height */}
                  <div className="relative flex-1 p-6 md:p-8 flex flex-col bg-white z-10">
                     <div className="flex items-center justify-between mb-3 w-full">
                       <div className="flex items-center gap-3">
                         <span className="text-[#0877F9] font-mono text-[12px] font-bold tracking-widest">
                           {srv.id}
                         </span>
                         <div className="w-1 h-1 rounded-full bg-slate-300" />
                         <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                           FIELD CREW
                         </span>
                       </div>
                       

                     </div>
                     
                     <h3 className="text-[26px] font-extrabold text-[#0B1F38] mb-3 leading-tight tracking-tight">
                       {srv.title}
                     </h3>
                     
                     <p className="text-slate-600 text-[14px] leading-[1.65] line-clamp-3">
                       {srv.desc}
                     </p>
                     
                     <div className="mt-auto pt-4 flex items-center gap-2.5 border-t border-slate-100/90">
                        <Link
                          href={`/contact?service=${encodeURIComponent(srv.title)}`}
                          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0062FF] to-[#0A78F5] hover:from-[#0052DF] hover:to-[#0062FF] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,98,255,0.35)] active:scale-95 transition-all"
                        >
                          <span>Request a Quote</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={srv.href || "/services"}
                          className="py-3 px-3.5 rounded-xl bg-[#F0F7FF] text-[#0877F9] hover:bg-[#E0EFFF] text-[13px] font-bold flex items-center justify-center transition-colors shrink-0"
                          aria-label={`Explore ${srv.title}`}
                        >
                          <ArrowRight className="w-4 h-4 -rotate-45" />
                        </Link>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* View All Services Button */}
        {showViewAllButton && (
          <div className="mt-8 md:mt-16 text-center z-20 relative w-full">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0062FF] hover:bg-[#0051D4] text-white rounded-full font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(0,98,255,0.4)] hover:shadow-[0_8px_25px_rgba(0,98,255,0.5)] hover:-translate-y-1 focus:outline-none"
            >
              <span className="tracking-wide">VIEW ALL SERVICES</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
