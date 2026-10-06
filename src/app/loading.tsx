import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071221]/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 text-white">
        <Loader2 className="w-8 h-8 text-[#0070F3] animate-spin" />
        <span className="text-sm font-medium tracking-widest uppercase text-slate-300">
          Loading...
        </span>
      </div>
    </div>
  );
}
