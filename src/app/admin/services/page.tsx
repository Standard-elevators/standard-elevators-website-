"use client";

import React from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { ArrowLeft, Building, Settings, Wrench, PackagePlus, ChevronRight } from "lucide-react";

function AdminServicesHub() {
  const sections = [
    {
      id: "primary",
      title: "Primary Elevator Solutions",
      description: "Manage core elevator models (Passenger, MRL, Goods, Hospital).",
      icon: <Building className="w-6 h-6" />,
      href: "/admin/services/primary",
      color: "blue",
      isReady: true,
    },
    {
      id: "engineering",
      title: "Engineering Services",
      description: "Manage New Installation, Modernization, Repairs, Maintenance, and Aftersales.",
      icon: <Settings className="w-6 h-6" />,
      href: "/admin/services/engineering",
      color: "emerald",
      isReady: true,
    },
    {
      id: "customization",
      title: "Elevator Customization & Components",
      description: "Manage Cabin Models, Door Options, Control & Safety, Machinery, and Interiors.",
      icon: <PackagePlus className="w-6 h-6" />,
      href: "/admin/services/customization",
      color: "purple",
      isReady: true,
    },
    {
      id: "other",
      title: "Other Engineering Services",
      description: "Manage Structural Fabrication, Glass & ACP Sheets, Civil Works, and more.",
      icon: <Wrench className="w-6 h-6" />,
      href: "/admin/services/other",
      color: "amber",
      isReady: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Services Page Management
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Select a section from the public Services page to edit its content, images, and settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className={`group bg-[#0C1A2E] border border-white/10 rounded-2xl p-6 transition-all duration-300 shadow-lg flex flex-col justify-between ${
              section.isReady ? "hover:bg-[#10243E] hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl" : "opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  section.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white' :
                  section.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white' :
                  section.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white'
                }`}>
                  {section.icon}
                </div>
                {!section.isReady && (
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Static Component (Read-Only Editor)
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {section.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
              <span>Edit this section</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <AdminGuard>
      <AdminServicesHub />
    </AdminGuard>
  );
}
