import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteLoader from "@/components/SiteLoader";
import RouteLoader from "@/components/RouteLoader";
import { TransitionProvider } from "@/context/TransitionContext";
import SmoothScrolling from "@/components/SmoothScrolling";
import FloatingActions from "@/components/FloatingActions";
import { SITE_URL, BUSINESS_INFO, getOrganizationSchema } from "@/lib/seo";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
    default: "Standard Engineering Works Elevators | Top Elevator Company Hyderabad & TS, AP",
    template: "%s | Standard Engineering Works Elevators",
  },
  description: "Standard Engineering Works Elevators - Premier elevator design, engineering solutions, new installation, repairs, modernization, and maintenance in Hyderabad, Telangana, and Andhra Pradesh since 2016.",
  keywords: [
    "Standard Elevators",
    "Standard Engineering Works Elevators",
    "Standard Elevator Works",
    "Standard Lifts",
    "elevator company Hyderabad",
    "lift manufacturers in Hyderabad",
    "elevators in Hyderabad",
    "lift repair Hyderabad",
    "elevator installation Hyderabad",
    "passenger lifts",
    "MRL lifts",
    "goods lifts",
    "hospital lifts",
    "elevator modernization",
    "elevator AMC Hyderabad",
    "Hyderabad elevator services",
    "Telangana",
    "Andhra Pradesh",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: BUSINESS_INFO.name,
    title: "Standard Engineering Works Elevators | Smooth, Smart, Spacious",
    description: "Premier elevator design, new installation, repairs, modernization, and AMC in Telangana & Andhra Pradesh since 2016.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        secureUrl: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Standard Engineering Works Elevators Logo",
      },
      {
        url: `${SITE_URL}/whatsapp-square.jpg`,
        secureUrl: `${SITE_URL}/whatsapp-square.jpg`,
        width: 600,
        height: 600,
        type: "image/jpeg",
        alt: "Standard Engineering Works Elevators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Standard Engineering Works Elevators | Smooth, Smart, Spacious",
    description: "Premier elevator design, installation, repairs, and maintenance in Telangana and Andhra Pradesh since 2016.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${inter.variable} antialiased`}
    >
      <head>
        {/* Google Search & Browser Favicon declarations */}
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* WhatsApp & Social Media Preview Direct Tags */}
        <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Standard Engineering Works Elevators Logo" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
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
            <FloatingActions />
          </TransitionProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
