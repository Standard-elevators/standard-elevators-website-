"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/TransitionLink";
import { ArrowRight } from "lucide-react";
import { useTransitionContext } from "@/context/TransitionContext";

export default function Hero() {
  const { isInitialLoad } = useTransitionContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    if (isInitialLoad) {
      // Keep hero video paused at initial frame while the site loader animation plays
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
    } else {
      // Site loader has completed: reset to timestamp 0 and begin playback
      const startPlayback = () => {
        try {
          video.currentTime = 0;
        } catch {}
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Hero video playback was prevented or interrupted:", err);
          });
        }
      };

      if (video.readyState >= 2) {
        startPlayback();
      } else {
        video.addEventListener("canplay", startPlayback, { once: true });
      }
    }
  }, [isInitialLoad]);

  return (
    <section className="relative w-full min-h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-center bg-[#071324]">
      {/* 1. Full-Bleed Cinematic Architectural Elevator Video Background — covers entire viewport edge-to-edge */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Static Fallback & Reduced-Motion Poster Image */}
        <Image
          src="/images/hero-video-poster.jpg"
          alt="Standard Engineering Works Glass Elevators Architectural Overview"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-[78%_center] lg:object-center"
        />

        {/* HTML5 Video — Synchronized with site loading animation */}
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="auto"
          poster="/images/hero-video-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-[72%_center] md:object-[78%_center] lg:object-center motion-reduce:hidden"
          aria-hidden="true"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Subtle localized dark navy vignette on text area for razor-sharp legibility without an opaque wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071221]/80 via-[#071221]/50 to-transparent w-full md:w-[65%] lg:w-[50%] pointer-events-none z-[1]" />
        {/* Soft bottom gradient to ensure smooth transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071221]/60 to-transparent pointer-events-none z-[1]" />
      </div>
      
      {/* 2. Main Hero Content (Relative z-10) — vertically centered, padded for header */}
      <div className="relative z-10 w-full site-container px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-16 my-auto flex flex-col justify-center">
        <div className="w-full md:w-[65%] lg:w-[55%] max-w-3xl">
          
          {/* Small uppercase credential tag */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <span className="text-[11px] md:text-[12px] font-semibold tracking-[0.2em] text-slate-300 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              ELEVATOR ENGINEERING
            </span>
            <div className="h-px w-10 sm:w-12 bg-white/20"></div>
          </div>
          
          {/* Main Headline: Controlled premium architectural hierarchy */}
          <h1 className="text-[clamp(32px,8vw,44px)] lg:text-[clamp(40px,3.8vw,58px)] font-bold lg:font-extrabold tracking-tight leading-[1.06] text-white mb-4 sm:mb-5 break-words drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Elevating<br />
            <span className="text-[#38BDF8] drop-shadow-[0_2px_10px_rgba(0,102,255,0.4)]">People.</span><br />
            <span className="text-[#38BDF8] drop-shadow-[0_2px_10px_rgba(0,102,255,0.4)]">Spaces.</span><br />
            Possibilities.
          </h1>
          
          {/* Description */}
          <p className="text-[15px] sm:text-[16px] lg:text-[16.5px] text-slate-100 mb-6 sm:mb-8 font-normal max-w-[460px] leading-[1.6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Passenger, goods, hospital and hydraulic elevator solutions, supported by engineering, installation and maintenance services.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link 
              href="/services" 
              className="h-[44px] sm:h-[46px] px-6 sm:px-7 bg-gradient-to-r from-[#0062FF] to-[#0088FF] hover:from-[#0052DF] hover:to-[#007AE6] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group shadow-[0_4px_18px_rgba(0,98,255,0.45)] text-[14px] sm:text-[15px] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Explore Our Elevators</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="h-[44px] sm:h-[46px] px-6 sm:px-7 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white rounded-xl font-semibold transition-all flex items-center justify-center text-[14px] sm:text-[15px] active:scale-[0.98] backdrop-blur-md whitespace-nowrap"
            >
              <span>Request a Consultation</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
