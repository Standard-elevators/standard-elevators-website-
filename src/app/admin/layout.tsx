import type { Metadata } from "next";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Admin Portal | Standard Engineering Works Elevators",
  description: "Administrative portal for Standard Engineering Works Elevators content management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-[#071221] text-slate-100 flex flex-col">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
