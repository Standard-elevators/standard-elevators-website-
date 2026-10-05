"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ImageIcon, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getPublishedGallery } from "@/lib/firestore-data";
import { DEFAULT_GALLERY } from "@/data/defaultData";
import { GalleryItem } from "@/types/data";

type GalleryCategoryFilter = "All" | "Passenger Lifts" | "Goods Lifts" | "Hospital Lifts" | "MRL Lifts" | "Installation" | "Cabins" | "Doors" | "Components";

const CATEGORIES: GalleryCategoryFilter[] = ["All", "Passenger Lifts", "Goods Lifts", "Hospital Lifts", "MRL Lifts", "Installation", "Cabins", "Doors", "Components"];

// Pre-seeded verified gallery dataset so page renders immediately with 0ms delay
const INITIAL_GALLERY_ITEMS: GalleryItem[] = DEFAULT_GALLERY.map((g, idx) => ({
  ...g,
  id: `default-g-${idx + 1}`,
}));

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryFilter>("All");
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  // Lightbox state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Touch/swipe state for lightbox
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getPublishedGallery();
        if (isMounted && data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn("Background gallery update skipped, using verified default set:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;


  // Lightbox Navigation Logic
  const goToNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goToPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const closeLightbox = () => setSelectedIndex(null);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Touch Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext(); // Swiped left
      else goToPrev(); // Swiped right
    }
    touchStartX.current = null;
  };

  // Helper for asymmetric grid layout pattern
  const getGridSpanClass = (index: number) => {
    const pos = index % 6;
    if (pos === 0) return "md:col-span-2 md:row-span-2"; // Featured Large
    if (pos === 1) return "md:col-span-1 md:row-span-1"; // Small stacked
    if (pos === 2) return "md:col-span-1 md:row-span-1"; // Small stacked
    if (pos === 3) return "md:col-span-2 md:row-span-1"; // Wide
    if (pos === 4) return "md:col-span-1 md:row-span-1 lg:col-span-1"; // Portrait/Box
    if (pos === 5) return "md:col-span-1 md:row-span-1 lg:col-span-1"; // Box
    return "md:col-span-1 md:row-span-1";
  };

  return (
    <div className="flex flex-col w-full bg-[#F7F9FC] text-[#102A43] min-h-screen">
      
      {/* PREMIUM HERO SECTION */}
      <section className="relative pt-24 pb-6 md:pt-28 md:pb-8 bg-[#061426] overflow-hidden">
        {/* Subtle engineering grid & soft blue atmospheric glow */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: "linear-gradient(#1498FF 1px, transparent 1px), linear-gradient(90deg, #1498FF 1px, transparent 1px)", 
            backgroundSize: "60px 60px", 
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)" 
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#087CF5]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="site-container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7FAFF] mb-3 leading-tight">
                PROJECT <span className="text-[#1498FF]">GALLERY</span>
              </h1>
              <p className="text-base md:text-lg text-[#8FA2B8] font-light max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Explore our precision elevator installations, premium cabin finishes, and expertly engineered architectural components.
              </p>
              
              {/* EXPLORE PROJECTS Premium Button */}
              <button 
                onClick={() => document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-[#087CF5]/10 hover:bg-[#087CF5]/20 text-[#1498FF] border border-[#087CF5]/30 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(8,124,245,0.1)] hover:shadow-[0_0_30px_rgba(8,124,245,0.25)] focus:outline-none"
              >
                <span className="tracking-wide text-sm">EXPLORE PROJECTS</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

            {/* Secondary Visual Preview */}
            <div className="hidden lg:flex flex-1 relative h-[250px] w-full justify-center items-center perspective-[1200px]">
              {items.length > 0 ? (
                <>
                  {/* Floating Back Left (Furthest) */}
                  {items[5] && (
                    <div className="absolute w-[140px] h-[100px] z-[5] rounded-lg overflow-hidden border border-white/5 shadow-sm transform -translate-x-40 -translate-y-20 opacity-20 rotate-[-12deg]">
                      <Image src={items[5].imageUrl} alt={items[5].title} fill className="object-cover grayscale" sizes="150px" />
                    </div>
                  )}
                  {/* Floating Back Right (Furthest) */}
                  {items[4] && (
                    <div className="absolute w-[160px] h-[120px] z-[10] rounded-lg overflow-hidden border border-white/10 shadow-md transform translate-x-44 -translate-y-16 opacity-30 rotate-[10deg]">
                      <Image src={items[4].imageUrl} alt={items[4].title} fill className="object-cover" sizes="180px" />
                    </div>
                  )}
                  {/* Floating Left */}
                  {items[3] && (
                    <div className="absolute w-[180px] h-[130px] z-[15] rounded-xl overflow-hidden border border-white/10 shadow-lg transform -translate-x-32 translate-y-12 opacity-50 rotate-[-8deg]">
                      <Image src={items[3].imageUrl} alt={items[3].title} fill className="object-cover" sizes="200px" />
                    </div>
                  )}
                  {/* Supporting Image Right */}
                  {items[2] && (
                    <div className="absolute w-[200px] h-[140px] z-[20] rounded-xl overflow-hidden border border-white/10 shadow-xl transform translate-x-28 translate-y-8 opacity-70 rotate-[5deg]">
                      <Image src={items[2].imageUrl} alt={items[2].title} fill className="object-cover" sizes="200px" />
                    </div>
                  )}
                  {/* Supporting Image Left */}
                  {items[1] && (
                    <div className="absolute w-[220px] h-[160px] z-[25] rounded-xl overflow-hidden border border-white/20 shadow-2xl transform -translate-x-20 -translate-y-6 opacity-90 rotate-[-3deg]">
                      <Image src={items[1].imageUrl} alt={items[1].title} fill className="object-cover" sizes="250px" />
                    </div>
                  )}
                  {/* Dominant Front Image */}
                  <div className="absolute w-[260px] h-[190px] z-[30] rounded-2xl overflow-hidden border border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform translate-x-4 translate-y-2">
                    <Image src={items[0]?.imageUrl} alt={items[0]?.title || "Featured"} fill className="object-cover" sizes="300px" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061426]/40 to-transparent"></div>
                  </div>
                </>
              ) : (
                 <div className="absolute w-[260px] h-[190px] bg-[#061426]/50 rounded-2xl border border-white/10 flex flex-col items-center justify-center backdrop-blur-sm">
                   <ImageIcon className="text-[#8FA2B8] w-8 h-8 opacity-50 mb-2" />
                   <span className="text-[#8FA2B8] text-xs font-medium uppercase tracking-wider">Preview Pending</span>
                 </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY & FILTERS */}
      <section id="gallery-grid" className="py-20 md:py-28">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          
          {/* Premium Segmented Category Filters */}
          <div className="flex justify-center mb-16 md:mb-20">
            <div className="inline-flex flex-wrap justify-center bg-white p-2 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#DCE5EF]">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedIndex(null); // Reset lightbox if open
                  }}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${
                    activeCategory === category
                      ? "bg-[#087CF5] text-white shadow-[0_4px_15px_rgba(8,124,245,0.3)]"
                      : "text-[#102A43] hover:bg-[#F7F9FC]"
                  }`}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Content */}
          {isLoading ? (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#087CF5] animate-spin mb-4" />
              <p className="text-sm font-medium text-[#8FA2B8] uppercase tracking-widest">Loading Portfolio</p>
            </div>
          ) : filteredItems.length > 0 ? (
            
            /* ASYMMETRIC CSS GRID LAYOUT */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[280px]">
              {filteredItems.map((item, idx) => {
                const spanClass = getGridSpanClass(idx);

                return (
                  <div
                    key={item.id || item.title}
                    onClick={() => setSelectedIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedIndex(idx);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${item.title}`}
                    className={`group relative rounded-2xl overflow-hidden bg-[#DCE5EF] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087CF5] ${spanClass}`}
                    style={{ transform: "translateZ(0)" }} // Hardware acceleration for smooth scale
                  >
                    {/* Image */}
                    <Image
                      src={item.imageUrl}
                      alt={item.altText || item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Glass Overlay (Premium Gradient) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07172B]/95 via-[#07172B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1498FF] mb-2 block">
                          {item.category}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">
                          {item.title}
                        </h3>
                        {/* Hover metadata & arrow */}
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 font-medium mt-1">
                          <span>View Project</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Thin translucent inner border */}
                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
            
          ) : (
            
            /* EMPTY GALLERY STATE */
            <div className="text-center py-32 bg-white rounded-3xl border border-[#DCE5EF] shadow-sm">
              <ImageIcon className="w-16 h-16 text-[#DCE5EF] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#07172B] mb-3">Projects Coming Soon</h3>
              <p className="text-[#8FA2B8] font-light max-w-md mx-auto">
                We are currently curating the {activeCategory} portfolio. Check back shortly to explore our latest architectural integrations.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-8 text-[#087CF5] font-semibold hover:text-[#1498FF] transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Return to All Projects</span>
              </button>
            </div>
            
          )}
        </div>
      </section>

      {/* PREMIUM LIGHTBOX UI */}
      {selectedItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${selectedItem.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030914]/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {selectedIndex > 0 && (
            <button
              onClick={goToPrev}
              aria-label="Previous image"
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all focus:outline-none group"
            >
              <ChevronLeft className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform" />
            </button>
          )}

          {/* Next Button */}
          {selectedIndex < filteredItems.length - 1 && (
            <button
              onClick={goToNext}
              aria-label="Next image"
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all focus:outline-none group"
            >
              <ChevronRight className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Main Lightbox Content */}
          <div
            className="relative w-full h-full max-w-7xl max-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            {/* Image Container */}
            <div className="relative w-full h-[70vh] md:h-[80vh] bg-transparent rounded-lg overflow-hidden">
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.altText || selectedItem.title}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Metadata Footer */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-[#030914] to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1498FF] mb-1 block">
                  {selectedItem.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="text-sm text-[#8FA2B8] mt-2 max-w-2xl font-light">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              <Link
                href={`/contact?service=${encodeURIComponent(selectedItem.category)}`}
                onClick={closeLightbox}
                className="shrink-0 px-6 py-3 bg-[#087CF5] hover:bg-[#1498FF] text-white text-sm font-semibold rounded-full tracking-wide transition-colors inline-flex items-center gap-2 shadow-[0_0_20px_rgba(8,124,245,0.4)]"
              >
                <span>Request Specs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA SECTION */}
      <section className="py-24 bg-[#07172B] text-center border-t border-white/5">
        <div className="site-container px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to discuss your architectural requirements?
          </h2>
          <p className="text-[#8FA2B8] font-light max-w-2xl mx-auto mb-10 text-lg">
            Our engineering team prepares turnkey shaft drawings, motor sizing, and detailed quotations based on your precise specifications.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#087CF5] text-white rounded-full font-semibold hover:bg-[#1498FF] transition-all shadow-[0_4px_20px_rgba(8,124,245,0.3)] hover:shadow-[0_8px_30px_rgba(8,124,245,0.5)] focus:outline-none"
          >
            <span>Request Site Survey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
