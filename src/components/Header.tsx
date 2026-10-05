"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { Menu, X, ChevronDown, ArrowRight, Phone, Home, User, Settings, Image as ImageIcon, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { DEFAULT_SERVICES, GALLERY_CATEGORIES_MENU, ENGINEERING_SERVICES_DATA, CUSTOMIZATION_DATA } from "@/data/defaultData";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveMobileDropdown(null);
  }, [pathname]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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

  // Structured Data for Menus
  const primarySolutions = DEFAULT_SERVICES.map(s => ({
    name: s.title.split(" (")[0], // Keep it clean for the menu
    href: `/services/${s.slug}`,
    desc: s.description,
    image: s.imageUrl
  }));

  const engineeringServices = ENGINEERING_SERVICES_DATA.map(s => ({
    name: s.title,
    href: `/services`, 
    desc: s.desc,
    image: s.image
  }));

  const customizationComponents = CUSTOMIZATION_DATA.map(s => ({
    name: s.title,
    href: `/services`,
    desc: s.desc,
    image: s.image
  }));

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
  const MenuItem = ({ item, onClick }: { item: { name: string; href: string; desc: string; image: string }, onClick: () => void }) => (
    <Link
      href={item.href}
      onClick={onClick}
      className="group flex items-start gap-4 p-3 rounded-xl hover:bg-[#F8FAFC] transition-all border border-transparent hover:border-[#E2E8F0]"
    >
      <div className="relative w-14 h-11 rounded-[10px] overflow-hidden shrink-0 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_12px_rgba(8,119,249,0.15)] transition-all">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[14px] font-bold text-[#0B1F38] group-hover:text-[#0877F9] transition-colors truncate">
            {item.name}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0877F9] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
        <span className="text-[12px] text-[#64748B] leading-[1.4] line-clamp-2 font-light">
          {item.desc}
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <header
        className={`z-50 w-full pt-3 sm:pt-4 pb-0 transition-all duration-300 pointer-events-none fixed top-0 left-0 right-0`}
      >
        {/* COMPACT ROUNDED CENTERED HEADER */}
        <div className="pointer-events-auto relative mx-auto w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1320px] h-[60px] sm:h-[68px] lg:h-[72px] rounded-[30px] lg:rounded-[36px] bg-white shadow-[0_10px_35px_rgba(6,25,45,0.14)] flex items-center justify-between overflow-hidden">
          
          {/* DIAGONAL TRANSITION & DARK ARCHITECTURAL IMAGE AREA (Desktop) */}
          <div 
            className="absolute top-0 right-0 bottom-0 w-[77%] pointer-events-none hidden lg:block z-0"
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
            className="absolute top-0 left-0 bottom-0 w-full lg:w-[25%] opacity-[0.06] pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(#0062FF 1px, transparent 1px), linear-gradient(90deg, #0062FF 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }}
          />

          {/* LEFT: LOGO */}
          <div className="relative z-10 flex items-center shrink-0 w-auto lg:w-[23%] pl-4 lg:pl-6 py-2">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0062FF] rounded-md transition-opacity hover:opacity-90 relative z-20 cursor-pointer"
              aria-label="Standard Engineering Works Elevators Home"
            >
              <Image
                src="/logo-header-transparent.png"
                alt="Standard Engineering Works Elevators"
                width={260}
                height={80}
                priority
                className="h-8 sm:h-10 lg:h-[48px] w-auto object-contain shrink-0"
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
                        <div className="bg-[#F7F9FC] border border-[#CBD5E1] rounded-[24px] shadow-[0_24px_50px_rgba(11,31,56,0.12),_0_8px_16px_rgba(11,31,56,0.06)] overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-white/50 before:backdrop-blur-xl before:z-0">
                          
                          <div className="relative z-10 flex flex-col w-full h-full">
                            {/* MENU CONTENT GRID */}
                            <div className="p-8">
                              {item.menuType === 'services' ? (
                                /* SERVICES: 3-COLUMN STRUCTURE */
                                <div className="grid grid-cols-3 gap-8">
                                  {/* Col 1 */}
                                  <div className="flex flex-col gap-2">
                                    <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#0877F9]"></span>
                                      Primary Solutions
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                      {primarySolutions.map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Col 2 */}
                                  <div className="flex flex-col gap-2 relative before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#28B8FF]"></span>
                                      Engineering Services
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                      {engineeringServices.map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Col 3 */}
                                  <div className="flex flex-col gap-2 relative before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#0B1F38]"></span>
                                      Customization
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                      {customizationComponents.map((sub, idx) => (
                                        <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* GALLERY: 2-COLUMN STRUCTURE */
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                  <div className="col-span-2 mb-2">
                                    <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-3 flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-[#0877F9]"></span>
                                      Project Categories
                                    </h4>
                                  </div>
                                  {GALLERY_CATEGORIES_MENU.map((sub, idx) => (
                                    <MenuItem key={idx} item={sub} onClick={() => setActiveDropdown(null)} />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* BOTTOM FOOTER LINK */}
                            <div className="bg-white/80 border-t border-slate-200 p-4 px-6 mt-auto">
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
              href="/contact"
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

        {/* MOBILE NAVIGATION OVERLAY (Accessible Accordion Style) */}
        {isMobileMenuOpen && (
          <div
            className="pointer-events-auto lg:hidden fixed inset-0 z-50 w-screen w-full h-[100dvh] bg-[#040D1A] overflow-hidden flex flex-col justify-between animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            style={{
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

            <div className="relative z-10 flex flex-col justify-between h-full w-full overflow-y-auto overflow-x-hidden min-h-0 px-4 sm:px-5 pt-2 pb-6">
              <div className="flex items-center justify-between shrink-0 pb-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-xl transition-opacity hover:opacity-90 bg-white shadow-sm px-3 py-2 cursor-pointer"
                  aria-label="Standard Engineering Works Elevators Home"
                >
                  <Image
                    src="/logo-header-transparent.png"
                    alt="Standard Engineering Works Elevators"
                    width={220}
                    height={70}
                    priority
                    className="h-9 w-auto object-contain"
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
                      <div key={item.name} className="flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        <button
                          type="button"
                          onClick={() => setActiveMobileDropdown(isOpen ? null : item.name)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] active:bg-white/10 relative ${
                            active ? "font-bold text-white" : "font-medium text-white/90"
                          }`}
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-center gap-3.5">
                            {IconComponent && <IconComponent className="w-5 h-5 stroke-[2] shrink-0 text-white" />}
                            <span className="text-[17px] sm:text-[18px] text-white tracking-wide">{item.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-[#00E5FF]" : "text-white/70"
                            }`}
                          />
                        </button>

                        {/* MOBILE ACCORDION CONTENT */}
                        {isOpen && (
                          <div className="px-3 pb-3 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                            {item.menuType === 'services' ? (
                              <>
                                <div className="flex flex-col gap-1.5">
                                  <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider px-2">Primary Solutions</div>
                                  {primarySolutions.map((sub, idx) => (
                                    <Link key={idx} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] text-slate-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg flex items-center gap-3">
                                      <div className="w-8 h-6 relative rounded overflow-hidden shrink-0"><Image src={sub.image!} alt={sub.name} fill className="object-cover" /></div>
                                      <span className="truncate">{sub.name}</span>
                                    </Link>
                                  ))}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider px-2">Engineering Services</div>
                                  {engineeringServices.map((sub, idx) => (
                                    <Link key={idx} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] text-slate-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg flex items-center gap-3">
                                      <div className="w-8 h-6 relative rounded overflow-hidden shrink-0"><Image src={sub.image!} alt={sub.name} fill className="object-cover" /></div>
                                      <span className="truncate">{sub.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col gap-1.5 pt-1">
                                {GALLERY_CATEGORIES_MENU.map((sub, idx) => (
                                  <Link key={idx} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] text-slate-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg flex items-center gap-3">
                                    <div className="w-8 h-6 relative rounded overflow-hidden shrink-0"><Image src={sub.image!} alt={sub.name} fill className="object-cover" /></div>
                                    <span className="truncate">{sub.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                            <div className="pt-2 border-t border-white/10 px-2">
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[13px] font-bold text-[#00E5FF] flex items-center justify-between py-2"
                              >
                                <span>{item.viewAllText}</span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
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
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] bg-transparent hover:bg-white/10 active:bg-white/20 border border-transparent relative ${
                        active ? "font-bold text-white border-white/10 bg-white/5" : "font-medium text-white/90"
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
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-14 bg-gradient-to-r from-[#0062FF] to-[#0088FF] text-white text-[17px] font-bold rounded-[20px] shadow-[0_4px_25px_rgba(0,98,255,0.4)] flex items-center justify-center gap-2 active:scale-95 focus:outline-none"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
