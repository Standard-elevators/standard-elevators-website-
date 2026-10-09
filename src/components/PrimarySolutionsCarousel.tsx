"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Building2, ArrowUpFromLine, Box, Stethoscope, Layers } from "lucide-react";

// Utility to get icons
function getServiceIcon(slug: string, category?: string) {
  const cat = (category || "").toLowerCase();
  if (slug.includes("mrl") || cat.includes("mrl")) return <Building2 className="w-6 h-6" />;
  if (slug.includes("passenger") || cat.includes("passenger")) return <ArrowUpFromLine className="w-6 h-6" />;
  if (slug.includes("goods") || slug.includes("freight") || cat.includes("goods")) return <Box className="w-6 h-6" />;
  if (slug.includes("hospital") || slug.includes("stretcher") || cat.includes("hospital")) return <Stethoscope className="w-6 h-6" />;
  if (slug.includes("hydraulic") || cat.includes("hydraulic")) return <Layers className="w-6 h-6" />;
  return <Layers className="w-6 h-6" />;
}

import { getPublishedServices, applyLocalServiceOverrides } from "@/lib/firestore-data";
import { DEFAULT_SERVICES } from "@/data/defaultData";

export default function PrimarySolutionsCarousel({ services: initialServices }: { services?: any[] }) {
  const [services, setServices] = useState<any[]>(() => {
    const base = initialServices && initialServices.length > 0 ? initialServices : DEFAULT_SERVICES.map(s => ({ ...s, id: s.slug }));
    if (typeof window !== "undefined") {
      return applyLocalServiceOverrides(base);
    }
    return base;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      if (typeof window !== "undefined") {
        setServices(applyLocalServiceOverrides(initialServices));
      } else {
        setServices(initialServices);
      }
    }
  }, [initialServices]);

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const data = await getPublishedServices();
        if (isMounted && data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.warn("PrimarySolutionsCarousel load failed:", err);
      }
    }

    loadServices();

    if (typeof window !== "undefined") {
      const handleSync = () => loadServices();
      window.addEventListener("se_services_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        isMounted = false;
        window.removeEventListener("se_services_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.children;
    if (index >= 0 && index < cards.length) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    const nextIndex = activeIndex === services.length - 1 ? 0 : activeIndex + 1;
    scrollToIndex(nextIndex);
  }, [activeIndex, services.length, scrollToIndex]);

  const prevSlide = useCallback(() => {
    const prevIndex = activeIndex === 0 ? services.length - 1 : activeIndex - 1;
    scrollToIndex(prevIndex);
  }, [activeIndex, services.length, scrollToIndex]);

  // Autoplay (Continuous slow scroll on mobile only when in viewport)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isPaused = false;
    let isInView = false;
    let resumeTimeoutId: NodeJS.Timeout;
    let startDelayTimeoutId: NodeJS.Timeout;
    
    const isMobile = () => window.innerWidth < 768;

    const handleInteractionStart = () => {
      isPaused = true;
      clearTimeout(resumeTimeoutId);
    };
    
    const handleInteractionEnd = () => {
      resumeTimeoutId = setTimeout(() => {
        isPaused = false;
      }, 3000);
    };

    container.addEventListener('touchstart', handleInteractionStart, { passive: true });
    container.addEventListener('touchend', handleInteractionEnd);
    container.addEventListener('mousedown', handleInteractionStart);
    container.addEventListener('mouseup', handleInteractionEnd);

    // Only start scrolling once the section is in view, ensuring Card 1 is fully visible first
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.scrollLeft = 0; // First card is completely visible
            clearTimeout(startDelayTimeoutId);
            startDelayTimeoutId = setTimeout(() => {
              isInView = true;
            }, 2500); // 2.5s pause to read/observe first card
          } else {
            isInView = false;
            clearTimeout(startDelayTimeoutId);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    const scrollContinuously = () => {
      if (isInView && !isPaused && isMobile()) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          if (container.scrollLeft >= maxScroll - 1) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft += 0.5;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollContinuously);
    };

    animationFrameId = requestAnimationFrame(scrollContinuously);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resumeTimeoutId);
      clearTimeout(startDelayTimeoutId);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchend', handleInteractionEnd);
      container.removeEventListener('mousedown', handleInteractionStart);
      container.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, []);

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume autoplay after a short delay
        setTimeout(() => setIsPaused(false), 2000);
      }}
    >
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10 overflow-x-auto md:snap-none no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 items-stretch"
      >
        {services.map((service, index) => {
          const icon = getServiceIcon(service.slug, service.category);
          return (
            <div
              key={service.id || service.slug}
              className="w-[300px] sm:w-[330px] md:w-auto shrink-0 group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-[0_4px_20px_rgba(10,35,66,0.06)] hover:shadow-[0_20px_40px_rgba(8,119,249,0.12)] hover:border-[#0877F9]/30 transition-all duration-500"
            >
              <div className="relative w-full aspect-[16/10] bg-[#06172B] overflow-hidden">
                <Image
                  src={service.imageUrl || "/hero-elevator.jpg"}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/90 via-[#0A2342]/20 to-transparent" />
                
                {/* Category Pill Badge - Top Left with clean padding and no collision */}
                <div className="absolute top-3 left-3.5 z-10 max-w-[calc(100%-2rem)]">
                  <span className="inline-block px-3 py-1 bg-[#0A2342]/85 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider rounded-lg border border-white/20 shadow-md truncate max-w-full">
                    0{index + 1} &mdash; {service.category || "Lift"}
                  </span>
                </div>

                {/* Service Type Icon - Bottom Right with premium glow */}
                <div className="absolute bottom-3.5 right-3.5 z-10">
                  <div className="w-10 h-10 bg-[#0877F9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0877F9]/40 group-hover:scale-110 transition-transform duration-500">
                    {icon}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-[#0A2342] mb-3 group-hover:text-[#0877F9] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#F1F5F9]">
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A2342] hover:bg-[#0877F9] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}#quotation-form`}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0A2342] text-sm font-semibold rounded-lg transition-colors"
                  >
                    Quote
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Navigation Controls (Arrows & Dots) */}
      <div className="md:hidden flex items-center justify-center gap-4 mt-2">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A2342] active:bg-[#F1F5F9] transition-colors"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1.5">
          {services.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-5 bg-[#0877F9]' : 'w-2 bg-[#CBD5E1]'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A2342] active:bg-[#F1F5F9] transition-colors"
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
