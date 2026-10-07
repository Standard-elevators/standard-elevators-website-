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

        {/* Subtle uniform overlay to keep text readable without blocking the video */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 pointer-events-none z-[1]" />
        {/* Soft bottom gradient to ensure smooth transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#071221] to-transparent pointer-events-none z-[1]" />
      </div>
      
      {/* 2. Main Hero Content (Relative z-10) */}
      <div className="relative z-10 w-full site-container px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 lg:pt-40 pb-16 my-auto flex flex-col justify-center">
        <div className="w-full lg:w-[75%] max-w-4xl">
          
          {/* Small uppercase credential tag */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
            <span className="text-[9px] font-medium md:font-semibold md:text-[13px] tracking-[0.25em] text-white/90 md:text-slate-200 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] md:drop-shadow-md">
              PREMIUM ELEVATOR ENGINEERING
            </span>
            <div className="h-px w-10 sm:w-16 bg-white/30 hidden sm:block"></div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl font-light md:font-bold tracking-tight md:text-[clamp(52px,5.5vw,76px)] leading-[1.15] md:leading-[1.05] text-white mb-4 md:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:drop-shadow-lg">
            Elevating <span className="font-medium md:font-bold md:text-[#38BDF8]">People</span>, <span className="font-medium md:font-bold md:text-[#38BDF8]">Spaces</span>,<br className="hidden lg:block"/> and Possibilities.
          </h1>
          
          {/* Description */}
          <p className="text-[13px] font-light leading-[1.6] md:text-[17px] lg:text-[19px] md:font-normal text-white/95 md:text-slate-100 mb-6 sm:mb-10 max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:drop-shadow-md">
            Passenger, goods, hospital, and hydraulic elevator solutions seamlessly integrated into architectural masterpieces. Supported by world-class engineering, installation, and maintenance.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-max mt-2">
            <Link 
              href="/services" 
              className="h-[40px] md:h-[52px] px-6 md:px-10 bg-[#0062FF] md:bg-gradient-to-r md:from-[#0062FF] md:to-[#0088FF] hover:md:from-[#0052DF] hover:md:to-[#007AE6] border-transparent text-white rounded-full font-semibold md:font-bold transition-all flex items-center justify-center gap-2 group shadow-md md:shadow-[0_8px_25px_rgba(0,98,255,0.4)] text-[13.5px] md:text-[16px] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Explore Our Elevators</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 md:group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="h-[40px] md:h-[52px] px-6 md:px-10 bg-white md:bg-white/10 hover:bg-slate-100 md:hover:bg-white/20 border border-transparent md:border-white/30 md:hover:border-white/50 text-[#0B1F38] md:text-white rounded-full font-semibold md:font-bold transition-all flex items-center justify-center text-[13.5px] md:text-[16px] active:scale-[0.98] md:backdrop-blur-md shadow-md md:shadow-[0_8px_25px_rgba(0,0,0,0.2)] whitespace-nowrap w-full"
            >
              <span>Request a Consultation</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
