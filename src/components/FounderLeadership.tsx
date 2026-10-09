"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { getFounderData } from "@/lib/firestore-data";

export default function FounderLeadership() {
  const [ownerImgSrc, setOwnerImgSrc] = useState("/images/team/founder.jpg");
  const [founderName, setFounderName] = useState("Founder");

  React.useEffect(() => {
    const fetchFounder = () => {
      getFounderData().then((data) => {
        if (data) {
          setFounderName(data.name || "Founder");
          if (data.imageUrl) setOwnerImgSrc(data.imageUrl);
        }
      });
    };

    fetchFounder();

    if (typeof window !== "undefined") {
      window.addEventListener("se_founder_updated", fetchFounder);
      return () => window.removeEventListener("se_founder_updated", fetchFounder);
    }
  }, []);

  return (
    <section className="relative w-full py-24 sm:py-28 lg:py-32 bg-gradient-to-b from-[#071426] via-[#0D213A] to-[#071426] text-white overflow-hidden">
      {/* Soft background illumination */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0877F9]/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT / CENTER: Large Owner Portrait Architectural Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[400px] p-[2px] rounded-[28px] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(8,119,249,0.25)]">
              {/* Animated Glowing Border */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1E2D40] to-[#0A162B] transition-opacity duration-700 group-hover:opacity-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_60%,#0062FF_80%,#38BDF8_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-700" />
              
              <div className="relative w-full h-full bg-[#050D1A]/95 backdrop-blur-3xl rounded-[26px] overflow-hidden flex flex-col items-center">
                {/* Photo Area */}
                <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-[#0A162B]">
                  <Image
                    src={ownerImgSrc}
                    alt="Founder of Standard Elevators"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-[center_40%] transition-transform duration-1000 group-hover:scale-110"
                    onError={() => {
                      setOwnerImgSrc("/images/owner/owner-placeholder.svg");
                    }}
                  />
                  {/* Cinematic Lighting overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-transparent opacity-90 pointer-events-none" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-[26px] pointer-events-none" />
                </div>

                {/* Details Section Below Image */}
                <div className="relative w-full px-6 py-8 pb-10 flex flex-col items-center text-center -mt-8 z-10">
                  <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#28B8FF]/30 to-transparent" />
                  
                  <h4 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-4 drop-shadow-sm group-hover:text-[#38BDF8] transition-colors duration-500">
                    {founderName || "Founder"}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#38BDF8] uppercase mb-4">
                    Standard Engineering Works
                  </span>
                  
                  <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#28B8FF]/50 to-transparent rounded-full mb-4" />
                  
                  <p className="text-[13px] text-slate-400 font-light leading-relaxed tracking-wide">
                    Leading with precision & vision
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Leadership Message & Corporate Vision */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#071426] border border-[#26384D] w-fit mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#28B8FF]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#28B8FF] uppercase">
                LEADERSHIP
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Building Vertical Mobility <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0877F9] via-[#28B8FF] to-[#38BDF8]">
                With Engineering Discipline.
              </span>
            </h2>

            {/* Approved Leadership Statements */}
            <p className="text-slate-300 text-base sm:text-[17px] leading-relaxed mb-5 font-light">
              Under the strategic guidance of our founder, Standard Engineering Works Elevators was established with a singular vision: to revolutionize vertical mobility through uncompromising quality and innovative engineering. Since 2003, this vision has guided every project we undertake.
            </p>
            <p className="text-slate-300 text-base sm:text-[17px] leading-relaxed mb-8 font-light">
              Our leadership believes in fostering a culture of continuous improvement, where safety, reliability, and customer satisfaction remain the core pillars of our operational philosophy. We are dedicated to building elevator systems that stand the test of time and elevate the standard of modern infrastructure.
            </p>

            {/* Three Executive Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#26384D]">
              <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">SAFETY FIRST</div>
                <div className="text-[12px] text-slate-400">Strict adherence to Indian safety standards at every phase.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">IN-HOUSE CRAFT</div>
                <div className="text-[12px] text-slate-400">Direct manufacturing control without third-party compromises.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#071426]/70 border border-[#26384D]">
                <div className="text-[#28B8FF] font-bold text-xs tracking-wider uppercase mb-1">LONG-TERM CARE</div>
                <div className="text-[12px] text-slate-400">Dedicated maintenance protocols ensuring permanent uptime.</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
