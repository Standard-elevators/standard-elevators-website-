"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/context/TransitionContext";

export default function SiteLoader() {
  const { isInitialLoad, dismissLoader } = useTransitionContext();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  // If user is on ANY subpage (/about, /gallery, /services, /contact, etc.), NEVER show the intro video loader!
  const isHomePage = pathname === "/";

  // 1. Guaranteed, un-cancellable safety timeout: dismiss after 1.8s max NO MATTER WHAT
  useEffect(() => {
    if (!isInitialLoad || !isHomePage) return;

    const safetyTimer = setTimeout(() => {
      dismissLoader();
    }, 1800);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [isInitialLoad, isHomePage, dismissLoader]);

  // 2. Allow pressing ESC or clicking anywhere to skip immediately
  useEffect(() => {
    if (!isInitialLoad || !isHomePage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        dismissLoader();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInitialLoad, isHomePage, dismissLoader]);

  // 3. Start video playback cleanly
  useEffect(() => {
    if (!isInitialLoad || !isHomePage) return;

    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playbackRate = 1.5;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented or stalled, gracefully dismiss
          setHasError(true);
          dismissLoader();
        });
      }
    }
  }, [isInitialLoad, isHomePage, dismissLoader]);

  // Don't render anything if not on home page or already loaded
  if (!isHomePage || !isInitialLoad) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isInitialLoad && (
        <motion.div
          key="site-transition-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.35,
              ease: "easeOut",
            },
          }}
          onClick={dismissLoader}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
          aria-live="polite"
          aria-busy="true"
          role="status"
          title="Click anywhere to skip"
        >
          {/* Main Video Presentation Container - Sleek, Compact Luxury Sizing */}
          <div className="relative z-10 w-full max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-[460px] xl:max-w-[480px] flex flex-col items-center justify-center p-2 sm:p-4 pointer-events-none">
            
            {/* Responsive Aspect-Preserving Video Shell - Pure Black Background */}
            <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-black rounded-xl">
              {!hasError ? (
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controls={false}
                  onEnded={dismissLoader}
                  onError={dismissLoader}
                  className="w-full h-full object-contain pointer-events-none bg-black"
                >
                  <source src="/videos/site-loader-trimmed.mp4" type="video/mp4" />
                  <source src="/videos/site-loader.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Fallback loading indicator if video asset fails to load */
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="w-10 h-10 border-2 border-[#0A78F5] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-200">
                    Standard Elevators
                  </p>
                </div>
              )}
            </div>

            {/* Subtle Brand Engineering Badge & Progress Cue */}
            <div className="mt-4 sm:mt-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
                Standard Engineering Works
              </span>
              <div className="mt-2 w-28 sm:w-32 h-[2px] bg-white/10 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-[#0A78F5] shadow-[0_0_8px_rgba(10,120,245,0.8)]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.9,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <span className="text-[9px] text-slate-500 tracking-wider mt-2">
                Tap anywhere to continue
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

