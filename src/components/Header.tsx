"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, Phone, Home, User, Settings, Image as ImageIcon, Mail, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  getPublishedServices,
  getServicesPageSettings,
  getPublishedGallery,
  applyLocalServiceOverrides,
  applyLocalGalleryOverrides,
  EngineeringServiceSetting,
  CustomizationSetting,
  DEFAULT_ENGINEERING_SERVICES_DATA,
  DEFAULT_CUSTOMIZATION_DATA,
} from "@/lib/firestore-data";
import { DEFAULT_SERVICES, DEFAULT_GALLERY } from "@/data/defaultData";
import { ServiceItem, GalleryItem } from "@/types/data";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [dynamicServices, setDynamicServices] = useState<ServiceItem[]>(() => {
    if (typeof window !== "undefined") {
      return applyLocalServiceOverrides(DEFAULT_SERVICES.map(s => ({ ...s, id: s.slug })));
    }
    return [];
  });
  const [dynamicEngineering, setDynamicEngineering] = useState<EngineeringServiceSetting[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("se_services_page_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.engineeringServices?.length > 0) return parsed.engineeringServices;
        }
      } catch {}
    }
    return DEFAULT_ENGINEERING_SERVICES_DATA;
  });
  const [dynamicCustomization, setDynamicCustomization] = useState<CustomizationSetting[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("se_services_page_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.customization?.length > 0) return parsed.customization;
        }
      } catch {}
    }
    return DEFAULT_CUSTOMIZATION_DATA;
  });
  const [dynamicGallery, setDynamicGallery] = useState<GalleryItem[]>(() => {
    if (typeof window !== "undefined") {
      return applyLocalGalleryOverrides(DEFAULT_GALLERY.map((g, idx) => ({ ...g, id: `default-g-${idx + 1}` })));
    }
    return [];
  });
  
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
      setActiveMobileDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Fetch dynamic content for the mega menu and mobile menu
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllMenuData() {
      try {
        const [servicesData, pageSettings, galleryData] = await Promise.all([
          getPublishedServices(),
          getServicesPageSettings(),
          getPublishedGallery(),
        ]);
        if (isMounted) {
          if (servicesData && servicesData.length > 0) setDynamicServices(servicesData);
          if (pageSettings?.engineeringServices?.length > 0) setDynamicEngineering(pageSettings.engineeringServices);
          if (pageSettings?.customization?.length > 0) setDynamicCustomization(pageSettings.customization);
          if (galleryData && galleryData.length > 0) setDynamicGallery(galleryData);
        }
      } catch (err) {
        console.warn("Header fetch all menu data failed:", err);
      }
    }

    fetchAllMenuData();

    if (typeof window !== "undefined") {
      const handleSync = () => fetchAllMenuData();
      window.addEventListener("se_services_updated", handleSync);
      window.addEventListener("se_services_page_updated", handleSync);
      window.addEventListener("se_gallery_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        isMounted = false;
        window.removeEventListener("se_services_updated", handleSync);
        window.removeEventListener("se_services_page_updated", handleSync);
        window.removeEventListener("se_gallery_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Body scroll lock and Lenis stop for mobile menu
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    };
  }, [isMobileMenuOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 150ms delay prevents flickering when moving cursor from header to dropdown
  };

  // Structured Data for Menus (live dynamic data from admin uploads)
  const primarySolutions = useMemo(() => {
    const list = dynamicServices.length > 0 ? dynamicServices : DEFAULT_SERVICES;
    return list.map(s => ({
      name: s.title.split(" (")[0],
      href: `/services/${s.slug}`,
      desc: s.description,
      image: s.imageUrl || ""
    }));
  }, [dynamicServices]);

  const engineeringServices = useMemo(() => {
    const list = dynamicEngineering.length > 0 ? dynamicEngineering : DEFAULT_ENGINEERING_SERVICES_DATA;
    return list.map(s => ({
      name: s.title,
      href: `/services#engineering-services`, 
      desc: s.desc,
      image: s.image || ""
    }));
  }, [dynamicEngineering]);

  const customizationComponents = useMemo(() => {
    const list = dynamicCustomization.length > 0 ? dynamicCustomization : DEFAULT_CUSTOMIZATION_DATA;
    return list.map(s => ({
      name: s.title,
      href: `/services#customization`,
      desc: s.description || "Premium architectural components and finishes",
      image: s.image || ""
    }));
  }, [dynamicCustomization]);

  const galleryMenu = useMemo(() => {
    const categories = [
      { name: "Passenger Lifts", desc: "Premium passenger elevator installations" },
      { name: "Goods Lifts", desc: "Heavy-duty cargo and freight installations" },
      { name: "Hospital Lifts", desc: "Stretcher and medical elevator systems" },
      { name: "MRL Lifts", desc: "Machine room less gearless elevators" },
      { name: "Installation", desc: "Site preparations and shaft structural work" },
      { name: "Cabins", desc: "Premium elevator cabins and custom interiors" },
      { name: "Doors", desc: "Automatic, manual, and swing door designs" },
      { name: "Components", desc: "Microprocessor control panels and machinery" },
    ];
    return categories.map(cat => {
      const match = dynamicGallery.find(g => g.category?.toLowerCase() === cat.name.toLowerCase() && g.imageUrl);
      return {
        name: cat.name,
        href: `/gallery?category=${encodeURIComponent(cat.name)}#gallery-grid`,
        desc: cat.desc,
        image: match?.imageUrl || ""
      };
    });
  }, [dynamicGallery]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: User },
    {
      name: "Services",
      href: "/services",
      icon: Settings,
      hasMegaMenu: true,
      menuType: "services", // To render specific layout
      viewAllText: "VIEW ALL SERVICES",
    },
    { 
      name: "Gallery", 
      href: "/gallery", 
      icon: ImageIcon,
      hasMegaMenu: true,
      menuType: "gallery",
      viewAllText: "VIEW ALL GALLERY",
    },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const isCurrentActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // REUSABLE MEGA MENU ITEM COMPONENT
  const MenuItem = ({ item, onClick }: { item: { name: string; href: string; desc: string; image: string }, onClick: () => void }) => {
    // Check if active (avoid matching '#' links incorrectly)
    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/services' && !item.href.includes('#'));
    
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`group flex items-start gap-4 p-3 rounded-xl transition-all border ${
          isActive 
            ? "bg-[#F0F7FF] border-[#0877F9]/30 shadow-sm" 
            : "hover:bg-[#F8FAFC] border-transparent hover:border-[#E2E8F0]"
        }`}
      >
        <div className={`relative w-14 h-11 rounded-[10px] overflow-hidden shrink-0 border shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_12px_rgba(8,119,249,0.15)] transition-all ${isActive ? 'border-[#0877F9]/40' : 'border-slate-200'}`}>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={`object-cover transition-transform duration-500 ease-out ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#06172B] to-[#0A2342] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#38BDF8]/60" />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[14px] font-bold transition-colors truncate ${isActive ? 'text-[#0877F9]' : 'text-[#0B1F38] group-hover:text-[#0877F9]'}`}>
              {item.name}
            </span>
            <ArrowRight className={`w-3.5 h-3.5 text-[#0877F9] transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
          </div>
          <span className={`text-[12px] leading-[1.4] line-clamp-2 font-light ${isActive ? 'text-[#0B1F38]/80 font-medium' : 'text-[#64748B]'}`}>
            {item.desc}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <>
      <header
        className={`z-50 w-full pt-3 sm:pt-4 pb-0 transition-all duration-300 pointer-events-none fixed top-0 left-0 right-0`}
      >
        {/* COMPACT ROUNDED CENTERED HEADER */}
        <div className="pointer-events-auto relative mx-auto w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1320px] h-[60px] sm:h-[68px] lg:h-[72px] rounded-[30px] lg:rounded-[36px] bg-white shadow-[0_10px_35px_rgba(6,25,45,0.14)] flex items-center justify-between">
          
          {/* BACKGROUND WRAPPER (Needs overflow-hidden for rounded corners) */}
          <div className="absolute inset-0 rounded-[30px] lg:rounded-[36px] overflow-hidden pointer-events-none z-0">
            {/* DIAGONAL TRANSITION & DARK ARCHITECTURAL IMAGE AREA (Desktop) */}
            <div 
              className="absolute top-0 right-0 bottom-0 w-[77%] pointer-events-none hidden lg:block"
              style={{
                clipPath: 'polygon(36px 0, 100% 0, 100% 100%, 0 100%)',
                backgroundImage: "url('/images/elevator-header-background.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-[#071221]/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071221]/50 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* MESH BACKGROUND PATTERN (Left White Side) */}
            <div 
              className="absolute top-0 left-0 bottom-0 w-full lg:w-[25%] opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#0062FF 1px, transparent 1px), linear-gradient(90deg, #0062FF 1px, transparent 1px)`,
                backgroundSize: '16px 16px'
              }}
            />
          </div>

          {/* LEFT: LOGO */}
          <div className="relative z-10 flex items-center justify-center shrink-0 w-auto lg:w-[23%] py-1 pl-5 sm:pl-6 lg:pl-0">
            <Link
              href="/"
              className="flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF] rounded-md transition-opacity hover:opacity-90 relative z-20 cursor-pointer"
              aria-label="Standard Engineering Works Elevators Home"
            >
              <Image
                src="/logo-header-transparent.png"
                alt="Standard Engineering Works Elevators"
                width={280}
                height={90}
                priority
                className="h-[52px] sm:h-[54px] lg:h-[58px] w-auto object-contain shrink-0"
              />
            </Link>
          </div>

          {/* MIDDLE: DESKTOP NAVIGATION */}
          <nav
            className="relative z-10 hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center px-4"
            aria-label="Main Navigation"
            ref={dropdownRef}
          >
            {navLinks.map((item) => {
              const active = isCurrentActive(item.href);
              const isOpen = activeDropdown === item.name;

              if (item.hasMegaMenu) {
                return (
                  <div
                    key={item.name}
                    className="relative py-2"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1.5 text-[15px] font-semibold leading-[1.3] whitespace-nowrap transition-colors duration-150 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070F3] rounded-sm relative ${
                        active ? "text-[#38BDF8]" : "text-slate-200 hover:text-white"
                      }`}
                      onClick={() => setActiveDropdown(null)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#38BDF8]" : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                      {active && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#38BDF8] rounded-full" />
                      )}
                    </Link>

                    {/* MEGA MENU - Floating Architectural Panel */}
                    {isOpen && (
                      <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 animate-in fade-in-50 zoom-in-95 duration-200 ${
                          item.menuType === 'services' ? 'w-[980px]' : 'w-[680px]'
                        }`}
                      >
                        <div className="bg-white/75 backdrop-blur-[40px] border border-white/60 rounded-[24px] shadow-[0_24px_50px_rgba(11,31,56,0.15),_inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden flex flex-col relative">
                          {/* Creative Radial Glow behind the menu */}
                          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#0877F9]/10 rounded-full blur-[60px] pointer-events-none" />
                          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-[60px] pointer-events-none" />
                          
                          <div className="relative z-10 flex flex-col w-full h-full">
                            {/* MENU CONTENT GRID */}
                            <div className="p-8">
                              {item.menuType === 'services' ? (
                                /* SERVICES: 3-COLUMN STRUCTURE */
                                <div className="grid grid-cols-3 gap-8">
                                  {/* Col 1 */}
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 mb-2 rounded-lg bg-gradient-to-r from-blue-50/90 to-transparent border-l-[3px] border-[#0877F9]">
                                      <span className="w-2 h-2 rounded-full bg-[#0877F9] shadow-[0_0_8px_rgba(8,119,249,0.7)] shrink-0"></span>
                                      <h4 className="text-[12px] font-extrabold text-[#0B213F] uppercase tracking-[0.16em]">
                                        Primary Solutions
                                      </h4>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      {primarySolutions.slice(0, 3).map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Col 2 */}
                                  <div className="flex flex-col gap-2 relative before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 mb-2 rounded-lg bg-gradient-to-r from-sky-50/90 to-transparent border-l-[3px] border-[#0062FF]">
                                      <span className="w-2 h-2 rounded-full bg-[#0062FF] shadow-[0_0_8px_rgba(0,98,255,0.7)] shrink-0"></span>
                                      <h4 className="text-[12px] font-extrabold text-[#0B213F] uppercase tracking-[0.16em]">
                                        Engineering Services
                                      </h4>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      {engineeringServices.slice(0, 3).map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Col 3 */}
                                  <div className="flex flex-col gap-2 relative before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 mb-2 rounded-lg bg-gradient-to-r from-slate-100/90 to-transparent border-l-[3px] border-[#0A78F5]">
                                      <span className="w-2 h-2 rounded-full bg-[#0A78F5] shadow-[0_0_8px_rgba(10,120,245,0.7)] shrink-0"></span>
                                      <h4 className="text-[12px] font-extrabold text-[#0B213F] uppercase tracking-[0.16em]">
                                        Customization
                                      </h4>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      {customizationComponents.slice(0, 3).map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* GALLERY: 2-COLUMN STRUCTURE */
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                  <div className="col-span-2 mb-2">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50/90 to-transparent border-l-[3px] border-[#0877F9]">
                                      <span className="w-2 h-2 rounded-full bg-[#0877F9] shadow-[0_0_8px_rgba(8,119,249,0.7)] shrink-0"></span>
                                      <h4 className="text-[12px] font-extrabold text-[#0B213F] uppercase tracking-[0.16em]">
                                        Project Categories
                                      </h4>
                                    </div>
                                  </div>
                                  {galleryMenu.map((sub, idx) => (
                                    <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* BOTTOM FOOTER LINK */}
                            <div className="bg-white/40 border-t border-white/50 p-4 px-6 mt-auto backdrop-blur-md">
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0877F9] hover:text-[#0052DF] uppercase tracking-wider group/link py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <span>{item.viewAllText}</span>
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                              </Link>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Standard Link
              return (
                <div key={item.name} className="relative py-2">
                  <Link
                    href={item.href}
                    className={`text-[15px] font-semibold leading-[1.3] whitespace-nowrap transition-colors duration-150 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070F3] rounded-sm relative ${
                      active ? "text-[#38BDF8]" : "text-slate-200 hover:text-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#38BDF8] rounded-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* RIGHT: PHONE & GET A QUOTE (Desktop) */}
          <div className="relative z-10 hidden lg:flex items-center gap-3 xl:gap-4 shrink-0 pr-2 lg:pr-3">
            {/* Phone Pill */}
            <a
              href="tel:9515231555"
              className="h-[38px] xl:h-[42px] px-3 xl:px-4 bg-white rounded-full flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-md hover:-translate-y-[1px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
              aria-label="Call +91 9515231555"
            >
              <Phone className="w-4 h-4 text-[#0062FF] fill-[#0062FF]" />
              <span className="text-[13.5px] xl:text-[14.5px] font-bold text-slate-800 tracking-tight whitespace-nowrap">+91 9515231555</span>
            </a>
            
            {/* Get a Quote Button */}
            <Link
              href="/contact#quotation-form"
              className="group h-[38px] xl:h-[42px] px-4 xl:px-5 bg-[#0062FF] hover:bg-[#0052DF] text-white text-[13.5px] xl:text-[14.5px] font-bold rounded-full shadow-[0_4px_12px_rgba(0,98,255,0.3)] hover:shadow-[0_6px_16px_rgba(0,98,255,0.4)] transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0070F3] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* RIGHT: MOBILE CONTROLS */}
          <div className="relative z-10 lg:hidden flex items-center gap-2 shrink-0 pr-2">
            <a
              href="tel:9515231555"
              aria-label="Call Standard Engineering Works at 9515231555"
              className="w-10 h-10 rounded-full bg-[#0062FF] flex items-center justify-center shadow-[0_4px_10px_rgba(0,98,255,0.3)] active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF]"
            >
              <Phone className="w-4 h-4 fill-white text-white" />
            </a>

            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF] rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
               <X className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION OVERLAY (Smooth Slide-In Drawer Animation) */}
        <div
          data-lenis-prevent="true"
          className={`pointer-events-auto lg:hidden fixed inset-0 z-50 w-full h-[100dvh] bg-[#040D1A] overflow-hidden flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileMenuOpen
              ? "opacity-100 translate-x-0 pointer-events-auto visible"
              : "opacity-0 translate-x-full pointer-events-none invisible"
          }`}
          role="dialog"
          aria-modal={isMobileMenuOpen}
          aria-label="Mobile Navigation Menu"
          style={{
            overscrollBehavior: "contain",
            touchAction: "pan-y",
            paddingTop: "max(1.25rem, env(safe-area-inset-top))",
            paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
            paddingRight: "max(1.25rem, env(safe-area-inset-right))",
          }}
        >
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <Image
              src="/images/futuristic-glass-elevator-blue.png"
              alt="Futuristic Glass Elevator in Blue Light"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right pointer-events-none opacity-90"
            />
            <div className="absolute inset-y-0 left-0 w-[80%] sm:w-[65%] md:w-[50%] bg-gradient-to-r from-[#040D1A] via-[#040D1A]/95 to-transparent pointer-events-none" />
          </div>

          <div 
            data-lenis-prevent="true"
            className="relative z-10 flex flex-col justify-between h-full w-full overflow-y-auto overflow-x-hidden min-h-0 px-4 sm:px-5 pt-2 pb-6"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="flex items-center justify-between shrink-0 pb-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-xl transition-opacity hover:opacity-90 cursor-pointer"
                aria-label="Standard Engineering Works Elevators Home"
              >
                <Image
                  src="/logo-header-transparent.png"
                  alt="Standard Engineering Works Elevators"
                  width={220}
                  height={70}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] shrink-0"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 my-auto py-2 w-full max-w-[360px]" aria-label="Mobile Navigation">
              {navLinks.map((item) => {
                const active = isCurrentActive(item.href);
                const IconComponent = item.icon;
                const isOpen = activeMobileDropdown === item.name;

                if (item.hasMegaMenu) {
                  return (
                    <div key={item.name} className="flex flex-col overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveMobileDropdown(isOpen ? null : item.name)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] active:bg-white/10 relative ${
                          active ? "font-bold text-white" : "font-medium text-white/90"
                        }`}
                        aria-expanded={isOpen}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 stroke-[2] shrink-0 text-white" />}
                        <span className="text-[17px] sm:text-[18px] text-white tracking-wide">{item.name}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#00E5FF]" : "text-white/70"
                          }`}
                        />
                      </button>

                      {/* MOBILE ACCORDION CONTENT */}
                      {isOpen && (
                        <div className="px-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                          <div className="bg-[#EAF3FA] rounded-2xl p-2 flex flex-col gap-2">
                            {item.menuType === 'services' ? (
                              <>
                                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#D1E6F7] text-[#0A64BC] font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-sm">
                                  <span>All services</span>
                                  <ArrowRight className="w-4 h-4 -rotate-45" />
                                </Link>
                                {primarySolutions.slice(0, 5).map((service, idx) => (
                                  <Link key={idx} href={service.href} onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                      {service.image ? (
                                        <Image src={service.image} alt={service.name} fill className="object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#06172B] to-[#0A2342] flex items-center justify-center">
                                          <Layers className="w-4 h-4 text-[#38BDF8]/60" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                                      <span className="text-[#102A43] font-bold text-[14px] leading-tight mb-0.5">{service.name}</span>
                                      <span className="text-[#64748B] text-[12px] truncate">{service.desc}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#102A43] shrink-0" />
                                  </Link>
                                ))}
                              </>
                            ) : (
                              <>
                                <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#D1E6F7] text-[#0A64BC] font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-sm">
                                  <span>All gallery</span>
                                  <ArrowRight className="w-4 h-4 -rotate-45" />
                                </Link>
                                {galleryMenu.map((sub, idx) => (
                                  <Link key={idx} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                      {sub.image ? (
                                        <Image src={sub.image} alt={sub.name} fill className="object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#06172B] to-[#0A2342] flex items-center justify-center">
                                          <Layers className="w-4 h-4 text-[#38BDF8]/60" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                                      <span className="text-[#102A43] font-bold text-[14px] leading-tight mb-0.5">{sub.name}</span>
                                      <span className="text-[#64748B] text-[12px] truncate">{sub.desc}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#102A43] shrink-0" />
                                  </Link>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] bg-transparent relative ${
                      active ? "font-bold text-[#00E5FF]" : "font-medium text-white/90"
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 stroke-[2] shrink-0 text-white" />}
                    <span className="text-[17px] sm:text-[18px] text-white tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-3 pt-4 shrink-0">
              <a
                href="tel:9515231555"
                className="flex items-center gap-3 py-2 px-2 text-white hover:text-white transition-colors max-w-[280px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-lg group"
              >
                <Phone className="w-5 h-5 text-[#00E5FF] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[16px] font-bold tracking-wide text-white">
                  Call +91 9515231555
                </span>
              </a>

              <Link
                href="/contact#quotation-form"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-14 bg-gradient-to-r from-[#0062FF] to-[#0088FF] text-white text-[17px] font-bold rounded-[20px] shadow-[0_4px_25px_rgba(0,98,255,0.4)] flex items-center justify-center gap-2 active:scale-95 focus:outline-none"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
