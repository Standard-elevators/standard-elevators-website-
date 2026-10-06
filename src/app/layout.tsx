import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteLoader from "@/components/SiteLoader";
import MobileStickyBar from "@/components/MobileStickyBar";
import RouteLoader from "@/components/RouteLoader";
import { TransitionProvider } from "@/context/TransitionContext";
import SmoothScrolling from "@/components/SmoothScrolling";
import FloatingActions from "@/components/FloatingActions";
import { SITE_URL, BUSINESS_INFO, getOrganizationSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#051326",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Standard Engineering Works Elevators | Smooth, Smart, Spacious",
    template: "%s | Standard Engineering Works Elevators",
  },
  description: "Premium elevator design, engineering solutions, installation, modernization, and maintenance in Hyderabad, Telangana, and Andhra Pradesh since 2003.",
  keywords: [
    "elevators",
    "lifts",
    "elevator company Hyderabad",
    "passenger lifts",
    "MRL lifts",
    "goods lifts",
    "hospital lifts",
    "elevator modernization",
    "elevator AMC",
    "Hyderabad",
    "Telangana",
    "Andhra Pradesh",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: BUSINESS_INFO.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Smooth, Smart, Spacious`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [BUSINESS_INFO.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = getOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col bg-soft-background text-body-text min-h-screen">
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        <SmoothScrolling>
          <TransitionProvider>
            <SiteLoader />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <MobileStickyBar />
            <FloatingActions />
          </TransitionProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
