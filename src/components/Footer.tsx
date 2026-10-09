"use client";

import Image from "next/image";
import Link from "@/components/TransitionLink";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Settings, 
  ShieldCheck, 
  Users, 
  Wrench
} from "lucide-react";
import { usePathname } from "next/navigation";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}



function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#061426] font-sans text-white z-10 w-full overflow-hidden block">
      {/* 
        The footer should not rely on scroll triggers or delayed animations for its initial mounting/layout.
        It is rendered statically right now to guarantee it exists at the end of the page reliably.
      */}

      {/* ========================================================================= */}
      {/* BACKGROUND IMAGE SLICE (Desktop & Tablet)                                 */}
      {/* ========================================================================= */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-[40%] hidden lg:block z-0 pointer-events-none"
        style={{ 
          clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <Image 
          src="/hero-elevator.jpg" 
          alt="Premium Elevator Architecture" 
          fill 
          className="object-cover opacity-90"
          sizes="(max-width: 1024px) 0vw, 40vw"
        />
        {/* Soft dark gradient fading into the image from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#061426]/80 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: MAIN INFORMATION AREA                                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row pt-16 pb-12 lg:pt-20 lg:pb-14">
        
        {/* TEXT COLUMNS WRAPPER */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-8 xl:gap-12 lg:pr-[30%]">
          
          {/* COLUMN 1: BRAND (lg:col-span-4) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4 flex flex-col">
            {/* Logo */}
            <Link href="/" className="inline-block mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9] rounded-md">
              <Image 
                src="/logo-header-transparent.png" 
                width={220} 
                height={70} 
                className="w-[180px] sm:w-[200px] lg:w-[220px] h-auto object-contain" 
                alt="Standard Engineering Works Elevators" 
              />
            </Link>
            
            {/* Tagline */}
            <div className="text-[15px] lg:text-[16px] text-white leading-[1.6] mb-8 font-medium">
              Precision. Safety. Performance.<br />
              <span className="text-[#B8C8D7] font-normal mt-1 block">Your Trusted Partner in Vertical Mobility</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/share/r/17sFZPW8Uw/?mibextid=wwXIfr" },
                { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/standardelevators.engworks12/" },
                { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com/@standardelevators1212?si=Hrhd1KxKQBozTIXp" }
              ].map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="w-[36px] h-[36px] rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-[#0877F9] hover:border-[#0877F9] transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9]">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (lg:col-span-2) */}
          <nav className="col-span-1 sm:col-span-1 lg:col-span-2" aria-label="Quick Links Navigation">
            <h4 className="text-[16px] font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="text-[14px] lg:text-[15px] font-medium text-[#B8C8D7] hover:text-[#0877F9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9] rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMN 3: OUR SERVICES (lg:col-span-3) */}
          <nav className="col-span-1 sm:col-span-1 lg:col-span-3" aria-label="Services Navigation">
            <h4 className="text-[16px] font-bold text-white mb-6">Our Services</h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Primary Elevator Solutions', path: '/services#primary-solutions' },
                { name: 'Engineering Services', path: '/services#engineering-services' },
                { name: 'Elevator Customization & Components', path: '/services#customization' },
                { name: 'Other Engineering Services', path: '/services#other-services' }
              ].map(service => (
                <li key={service.name}>
                  <Link 
                    href={service.path} 
                    className="text-[14px] lg:text-[15px] font-medium text-[#B8C8D7] hover:text-[#0877F9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9] rounded-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMN 4: CONTACT DETAILS (lg:col-span-3) */}
          <address className="col-span-2 sm:col-span-2 lg:col-span-3 not-italic">
            <h4 className="text-[16px] font-bold text-white mb-6">Contact Details</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3.5">
                <div className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#B8C8D7] fill-current" />
                </div>
                <div className="min-w-0">
                  <a 
                    href="tel:9515231555" 
                    className="text-[14px] lg:text-[15px] font-semibold text-white hover:text-[#0877F9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9] rounded-sm"
                    aria-label="Call +91 9515231555"
                  >
                    +91 9515231555
                  </a>
                </div>
              </li>
              
              <li className="flex items-center gap-3.5">
                <div className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#B8C8D7]" />
                </div>
                <div className="min-w-0 break-words">
                  <a 
                    href="mailto:standardelevators.engworks12@gmail.com?subject=Elevator%20Inquiry%20-%20Standard%20Engineering%20Works&body=Hello%20Standard%20Engineering%20Works%20Team%2C%0A%0AI%20am%20interested%20in%20your%20elevator%20solutions%20and%20would%20like%20to%20request%20information%20and%20a%20quotation.%0A%0AMy%20Project%20Details%3A%0A-%20Name%3A%20%0A-%20Phone%3A%20%0A-%20Location%20%2F%20City%3A%20%0A-%20Building%20Type%20(Residential%20%2F%20Commercial%20%2F%20Industrial)%3A%20%0A-%20Elevator%20System%20(Passenger%20%2F%20MRL%20%2F%20Goods%20%2F%20Hospital%20%2F%20Modernization)%3A%20%0A-%20Number%20of%20Floors%20%2F%20Stops%3A%20%0A%0APlease%20get%20in%20touch%20with%20technical%20specifications%20and%20preliminary%20estimates.%0A%0AThank%20you!" 
                    className="text-[14px] lg:text-[15px] font-medium text-[#B8C8D7] hover:text-[#0877F9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877F9] rounded-sm"
                    aria-label="Email Standard Engineering Works"
                  >
                    standardelevators.engworks12@gmail.com
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-3.5">
                <div className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-[#B8C8D7] fill-current" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[14px] lg:text-[15px] font-medium text-white">Telangana &amp; Andhra Pradesh</span>
                  <span className="block text-[13px] text-[#B8C8D7] mt-0.5">(Our Service Locations)</span>
                </div>
              </li>
            </ul>
          </address>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMBINED LEVEL 2 & 3 WITH MOBILE BACKGROUND IMAGE                         */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden">
        
        {/* Background Image (Mobile Only) */}
        <div className="absolute inset-0 z-0 block lg:hidden">
          <Image 
            src="/hero-elevator.jpg" 
            alt="Premium Elevator Architecture" 
            fill 
            className="object-cover object-center opacity-[0.55]"
            sizes="100vw"
          />
          {/* Gradients to darken image so text remains highly readable */}
          <div className="absolute inset-0 bg-[#061426]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-transparent to-[#061426]/80" />
        </div>

        {/* ========================================================================= */}
        {/* LEVEL 2: VALUE / SERVICE STRIP                                             */}
        {/* ========================================================================= */}
        <div className="w-full border-t border-white/5 bg-transparent lg:bg-[#0B2036] relative z-10">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 gap-x-4 md:gap-x-0 md:divide-x divide-white/10">
              
              <div className="flex items-center gap-3 lg:justify-center md:px-2">
                <div className="shrink-0 text-[#38BDF8]">
                   <Settings size={22} strokeWidth={1.5} />
                </div>
                <div className="text-[13px] lg:text-[14.5px] font-semibold text-white tracking-wide">
                  Quality Installation
                </div>
              </div>
              
              <div className="flex items-center gap-3 lg:justify-center md:px-2">
                <div className="shrink-0 text-[#38BDF8]">
                   <ShieldCheck size={22} strokeWidth={1.5} />
                </div>
                <div className="text-[13px] lg:text-[14.5px] font-semibold text-white tracking-wide">
                  Reliable Performance
                </div>
              </div>

              <div className="flex items-center gap-3 lg:justify-center md:px-2">
                <div className="shrink-0 text-[#38BDF8]">
                   <Users size={22} strokeWidth={1.5} />
                </div>
                <div className="text-[13px] lg:text-[14.5px] font-semibold text-white tracking-wide">
                  Expert Support
                </div>
              </div>

              <div className="flex items-center gap-3 lg:justify-center md:px-2">
                <div className="shrink-0 text-[#38BDF8]">
                   <Wrench size={20} strokeWidth={1.5} />
                </div>
                <div className="text-[13px] lg:text-[14.5px] font-semibold text-white tracking-wide">
                  AMC &amp; Maintenance
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LEVEL 3: LEGAL BAR                                                         */}
        {/* ========================================================================= */}
        <div className="w-full bg-transparent lg:bg-[#0A2136] relative z-10 border-t border-white/5 pb-[72px] md:pb-0">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#B8C8D7] font-medium">
              <div className="text-center md:text-left leading-relaxed">
                &copy; {currentYear} Standard Engineering Works Elevators.<br className="block sm:hidden" /> All Rights Reserved.
                <span className="block mt-1">
                  Design and developed by <a href="https://www.thedreamteamservices.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#0877F9] transition-colors focus:outline-none focus-visible:underline">Dream Team Services</a>
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2 md:mt-0">
                <Link href="/privacy-policy" className="hover:text-white transition-colors focus:outline-none focus-visible:underline">Privacy Policy</Link>
                <span className="text-white/20">|</span>
                <Link href="/terms" className="hover:text-white transition-colors focus:outline-none focus-visible:underline">Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
