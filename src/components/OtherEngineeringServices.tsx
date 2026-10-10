"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { OtherServiceSetting, getServicesPageSettings, DEFAULT_OTHER_SERVICES_DATA } from "@/lib/firestore-data";

interface OtherEngineeringServicesProps {
  initialData?: OtherServiceSetting[];
}

export default function OtherEngineeringServices({ initialData }: OtherEngineeringServicesProps) {
  const [items, setItems] = useState<OtherServiceSetting[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("se_services_page_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.otherServices && parsed.otherServices.length > 0) {
            return parsed.otherServices;
          }
        }
      } catch {}
    }
    return initialData && initialData.length > 0 ? initialData : DEFAULT_OTHER_SERVICES_DATA;
  });

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const timer = setTimeout(() => {
        setItems(initialData);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;

    async function syncData() {
      try {
        const settings = await getServicesPageSettings();
        if (isMounted && settings?.otherServices && settings.otherServices.length > 0) {
          setItems(settings.otherServices);
        }
      } catch (err) {
        console.warn("OtherEngineeringServices sync notice:", err);
      }
    }

    syncData();

    if (typeof window !== "undefined") {
      const handleSync = () => syncData();
      window.addEventListener("se_services_page_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        isMounted = false;
        window.removeEventListener("se_services_page_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const displayList = items.length > 0 ? items : DEFAULT_OTHER_SERVICES_DATA;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {displayList.map((srv, idx) => {
        const hasImage = Boolean(srv.image && srv.image.trim().length > 0);

        return (
          <div
            key={idx}
            className="group relative h-[160px] sm:h-[190px] md:h-[280px] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,31,56,0.08)] hover:shadow-[0_20px_40px_rgba(0,98,255,0.22)] transition-all duration-500 cursor-pointer border border-slate-200/60 md:border-transparent bg-[#0B1F38]"
          >
            {/* Background Image or Modern Deep Navy Gradient */}
            {hasImage ? (
              <div className="absolute inset-0">
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F38]/95 via-[#0B1F38]/50 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F38] via-[#0A2342] to-[#051329]" />
            )}

            {/* Subtle interactive hover highlight border */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#0062FF]/40 rounded-2xl pointer-events-none transition-all duration-300" />
            
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0062FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Text directly on top of the image (No icon circle) */}
            <div className="absolute inset-0 p-3.5 sm:p-4 md:p-6 flex flex-col justify-end z-10">
              <h3 className="text-[13px] sm:text-[15px] md:text-xl font-bold text-white leading-snug drop-shadow-md group-hover:text-[#38BDF8] transition-colors duration-300">
                {srv.title}
              </h3>
              {srv.desc && (
                <p className="hidden md:block text-[13px] text-slate-300 leading-relaxed font-light line-clamp-2 mt-2">
                  {srv.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
