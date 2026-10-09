"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon, Loader2 } from "lucide-react";
import { getPublishedGallery } from "@/lib/firestore-data";
import { DEFAULT_GALLERY } from "@/data/defaultData";
import { GalleryItem } from "@/types/data";

export default function ProjectPortfolio() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Mobile Carousel state
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Desktop supporting card pagination if > 5 items exist
  const [desktopPage, setDesktopPage] = useState(0);

  // Track failed image URLs to fall back gracefully without broken icons
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      try {
        const data = await getPublishedGallery();
        if (isMounted && data) {
          const sorted = [...data].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
          setItems(sorted);
        }
      } catch (err) {
        console.warn("Portfolio fetch failed:", err);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPortfolio();

    const handleSync = () => {
      loadPortfolio();
    };

    window.addEventListener("se_gallery_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener("se_gallery_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);


  // Mobile Carousel Auto-play (paused on interaction)
  useEffect(() => {
    if (items.length <= 1 || isInteracting) return;

    autoPlayTimerRef.current = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % items.length);
    }, 3500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [items.length, isInteracting]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      if (touchDeltaX.current < -40) {
        // Swipe Left -> Next
        setActiveMobileIndex((prev) => (prev + 1) % items.length);
      } else if (touchDeltaX.current > 40) {
        // Swipe Right -> Previous
        setActiveMobileIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsInteracting(false), 3000);
  };

  const nextMobile = () => {
    setIsInteracting(true);
    setActiveMobileIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsInteracting(false), 3000);
  };

  const prevMobile = () => {
    setIsInteracting(true);
    setActiveMobileIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsInteracting(false), 3000);
  };

  const handleImageError = useCallback((id: string) => {
    setFailedImageIds((prev) => ({ ...prev, [id]: true }));
  }, []);

  // Featured project is always the first record
  const featuredItem = items[0];

  // Supporting items: up to 4 items in a 2x2 grid on desktop
  const supportingItemsPool = items.slice(1);
  const supportingPageSize = 4;
  const totalPages = Math.ceil(supportingItemsPool.length / supportingPageSize) || 1;
  const currentSupportingItems = supportingItemsPool.slice(
    desktopPage * supportingPageSize,
    (desktopPage + 1) * supportingPageSize
  );

  return (
    <section 
      id="project-portfolio" 
      aria-label="Project Portfolio"
      className="py-20 md:py-24 bg-pale-steel border-t border-slate-muted/10 relative overflow-hidden"
    >
      <div className="site-container px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-14 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-[#0877F9] uppercase">
                ENGINEERED INSTALLATIONS
              </span>
              <div className="h-px w-8 bg-[#0877F9]/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-midnight tracking-tight mb-3">
              Project Portfolio
            </h2>
            <p className="text-black font-semibold text-[15px] md:text-[17px] leading-relaxed">
              Illustrative examples of premium elevator design and integration.
            </p>
          </div>

          <Link 
            href="/gallery" 
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#0877F9] border border-slate-300 hover:border-[#0877F9] text-midnight hover:text-white transition-all duration-300 text-sm font-semibold rounded-xl shadow-xs hover:shadow-md shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9]"
            aria-label="View Full Gallery of projects"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* LOADING STATE                                                             */}
        {/* ========================================================================= */}
        {isLoading && (
          <div className="w-full h-[460px] flex flex-col items-center justify-center bg-white/60 rounded-2xl border border-slate-200/60 shadow-xs">
            <Loader2 className="w-8 h-8 text-[#0877F9] animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading project portfolio...</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EMPTY STATE                                                               */}
        {/* ========================================================================= */}
        {!isLoading && items.length === 0 && !hasError && (
          <div className="w-full py-20 px-6 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-midnight mb-2">Project Portfolio</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Recent project imagery will appear here as new elevator installations are published.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ERROR STATE                                                               */}
        {/* ========================================================================= */}
        {!isLoading && hasError && items.length === 0 && (
          <div className="w-full py-16 px-6 text-center bg-white rounded-2xl border border-red-100 shadow-xs">
            <p className="text-sm text-slate-500 mb-3">Portfolio imagery temporarily unavailable.</p>
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0877F9] hover:underline"
            >
              <span>Explore gallery directly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DESKTOP / TABLET COMPOSITION (Hidden on small mobile)                     */}
        {/* ========================================================================= */}
        {!isLoading && items.length > 0 && (
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-5 lg:gap-6 auto-rows-[250px] lg:auto-rows-[270px]">
              
              {/* ------------------------------------------------------------------- */}
              {/* LEFT: FEATURED PROJECT CARD (~50% width on Desktop, full height)   */}
              {/* ------------------------------------------------------------------- */}
              {featuredItem && (
                <div className={`${supportingItemsPool.length === 0 ? "col-span-12" : "col-span-12 lg:col-span-6"} row-span-2`}>
                  <Link
                    href={`/gallery${featuredItem.category ? `?category=${encodeURIComponent(featuredItem.category)}` : ''}`}
                    className="group relative w-full h-full block rounded-2xl overflow-hidden bg-[#071324] border border-[#102B46]/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(8,119,249,0.18)] hover:-translate-y-1.5 transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9]"
                  >
                    {/* Media Asset (Video or Clean Image) */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {Boolean(featuredItem.mediaType === "video" || featuredItem.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || featuredItem.imageUrl?.includes("/video/upload/")) ? (
                        <video
                          src={featuredItem.imageUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={failedImageIds[featuredItem.id || "featured"] ? "/hero-elevator.jpg" : featuredItem.imageUrl}
                          alt={featuredItem.altText || featuredItem.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          onError={() => handleImageError(featuredItem.id || "featured")}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Subtle Architectural Gradient Overlay for legibility */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#040D1A]/95 via-[#040D1A]/40 to-transparent transition-opacity duration-300" />
                    
                    {/* Top Architectural Badge */}
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#0877F9]/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase rounded-full shadow-sm">
                        Featured Project
                      </span>
                    </div>

                    {/* Bottom Content Area */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 lg:p-8 flex items-end justify-between gap-4">
                      <div className="max-w-md">
                        {featuredItem.category && (
                          <span className="inline-block text-xs font-bold tracking-widest text-[#38BDF8] uppercase mb-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            {featuredItem.category}
                          </span>
                        )}
                        <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                          {featuredItem.title}
                        </h3>
                      </div>

                      {/* Interactive Subtle 3D Action Icon */}
                      <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#0877F9] group-hover:border-[#0877F9] group-hover:scale-110 transition-all duration-300 shadow-md">
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* ------------------------------------------------------------------- */}
              {/* RIGHT: SUPPORTING PROJECT CARDS (2x2 Balanced Grid on Desktop)     */}
              {/* ------------------------------------------------------------------- */}
              {currentSupportingItems.map((item, idx) => {
                const uniqueKey = item.id || `support-${idx}`;
                return (
                  <div key={uniqueKey} className="col-span-6 lg:col-span-3 row-span-1">
                    <Link
                      href={`/gallery${item.category ? `?category=${encodeURIComponent(item.category)}` : ''}`}
                      className="group relative w-full h-full block rounded-2xl overflow-hidden bg-[#071324] border border-[#102B46]/20 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(8,119,249,0.15)] hover:-translate-y-1.5 transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9]"
                    >
                      {/* Media Asset (Video or Clean Image) */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        {Boolean(item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || item.imageUrl?.includes("/video/upload/")) ? (
                          <video
                            src={item.imageUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={failedImageIds[uniqueKey] ? "/hero-elevator.jpg" : item.imageUrl}
                            alt={item.altText || item.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            onError={() => handleImageError(uniqueKey)}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#040D1A]/95 via-[#040D1A]/35 to-transparent transition-opacity duration-300" />

                      {/* Content Area */}
                      <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          {item.category && (
                            <span className="block text-[11px] font-bold tracking-widest text-[#38BDF8] uppercase mb-1 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                              {item.category}
                            </span>
                          )}
                          <h4 className="text-sm lg:text-[15px] font-semibold text-white leading-snug line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                            {item.title}
                          </h4>
                        </div>

                        {/* Action Icon */}
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#0877F9] group-hover:border-[#0877F9] group-hover:scale-110 transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}

            </div>

            {/* Desktop Supporting Carousel Navigation if > 4 supporting items exist */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3 mt-6">
                <span className="text-xs font-medium text-slate-500 mr-2">
                  Showing {desktopPage * supportingPageSize + 1}–{Math.min((desktopPage + 1) * supportingPageSize, supportingItemsPool.length)} of {supportingItemsPool.length} additional projects
                </span>
                <button
                  type="button"
                  onClick={() => setDesktopPage((prev) => Math.max(0, prev - 1))}
                  disabled={desktopPage === 0}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-[#0877F9] flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Previous projects"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={desktopPage >= totalPages - 1}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-[#0877F9] flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Next projects"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* MOBILE CAROUSEL (Visible on screen < 768px)                               */}
        {/* ========================================================================= */}
        {!isLoading && items.length > 0 && (
          <div className="block md:hidden mt-8 relative"
               onTouchStart={handleTouchStart}
               onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}
          >
            {/* Carousel Track */}
            <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-2xl">
              {items.map((item, index) => {
                // Calculate position relative to active index
                let position = index - activeMobileIndex;
                if (position < -1) position += items.length;
                if (position > 1) position -= items.length;
                
                // Only render active, previous, and next for performance
                if (Math.abs(position) > 1 && items.length > 3) return null;

                const uniqueKey = item.id || `mobile-carousel-${index}`;
                
                const isActive = position === 0;
                
                let transformStyle = '';
                let opacityStyle = 'opacity-0';
                let zIndex = 0;
                
                if (isActive) {
                  transformStyle = 'translateX(0) scale(1)';
                  opacityStyle = 'opacity-100';
                  zIndex = 20;
                } else if (position === 1) {
                  transformStyle = 'translateX(105%) scale(0.95)';
                  opacityStyle = 'opacity-50';
                  zIndex = 10;
                } else if (position === -1) {
                  transformStyle = 'translateX(-105%) scale(0.95)';
                  opacityStyle = 'opacity-50';
                  zIndex = 10;
                }

                return (
                  <Link
                    key={uniqueKey}
                    href={`/gallery${item.category ? `?category=${encodeURIComponent(item.category)}` : ''}`}
                    className={`absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden bg-[#071324] shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${opacityStyle}`}
                    style={{
                      transform: transformStyle,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <div className="absolute inset-0 z-0 flex items-center justify-center">
                      {Boolean(item.mediaType === "video" || item.imageUrl?.match(/\.(mp4|webm|mov|m4v)($|\?)/i) || item.imageUrl?.includes("/video/upload/")) ? (
                        <video
                          src={item.imageUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={failedImageIds[uniqueKey] ? "/hero-elevator.jpg" : item.imageUrl}
                          alt={item.altText || item.title}
                          fill
                          sizes="100vw"
                          onError={() => handleImageError(uniqueKey)}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {/* Gradient for text legibility */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#040D1A]/95 via-[#040D1A]/30 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 flex flex-col justify-end">
                      {item.category && (
                        <span className="inline-block text-[10px] font-bold tracking-widest text-[#38BDF8] uppercase mb-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 px-1">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsInteracting(true);
                      setActiveMobileIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeMobileIndex ? "w-6 bg-[#0877F9]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevMobile}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs active:scale-95 transition-all"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextMobile}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs active:scale-95 transition-all"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
