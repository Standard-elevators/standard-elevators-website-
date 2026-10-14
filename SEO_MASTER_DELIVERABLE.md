# MASTER OPTIMIZATION DELIVERABLE — SEO, LOCAL SEO, SVO & SOCIAL SHARING
## Standard Engineering Works Elevators (`standardelevatorworks.com`)

---

### Executive Summary

This deliverable establishes complete, enterprise-grade **Search Engine Optimization (SEO)**, **Local SEO**, **Search Voice Optimization (SVO)**, **Answer Engine Optimization (AEO)**, and **Social Sharing Preview Optimization** for **Standard Engineering Works Elevators**. 

Every layer of the technical stack, page hierarchy, Open Graph crawler compatibility, structured data graph, and local search signal has been calibrated to position the website at the top of search engine result pages (SERPs) across Hyderabad, Telangana, and Andhra Pradesh.

---

## The 13 Phases of Optimization

### Phase 1: Canonical Domain & Global Metadata Architecture
- **Primary Production Domain**: Explicitly configured to `https://standardelevatorworks.com` across `SITE_URL`, Next.js `metadataBase`, `.env.local`, canonical links, and XML sitemaps.
- **Canonical Consistency**: Every public route generates a clean, self-referential canonical tag preventing split page rank or duplicate content indexing.
- **Brand Identity**: Standardized across metadata titles, OpenGraph, and JSON-LD schemas.
  - Primary Brand Name: `Standard Engineering Works Elevators`
  - Shorthand / Alternate Names: `Standard Elevators`, `Standard Elevator Works`, `Standard Lift Works`
  - Tagline: `Smooth | Smart | Spacious`
  - Founding / Established Year: `2016`
  - Installation Base: `100+ Verified Units`

---

### Phase 2: Local SEO Domination & Geo-Targeting (Hyderabad, TS & AP)
- **Primary Geolocation Coordinates**: Centered on Hyderabad (`17.3850° N, 78.4867° E`).
- **Standardized NAP (Name, Address, Phone)**:
  - **Company**: Standard Engineering Works Elevators
  - **Headquarters**: Hyderabad Design & Manufacturing Facility, Telangana 500001, India
  - **Sales / New Installations Hotline**: `+91 9515231555`
  - **Repairs, AMC & Emergency Inquiries**: `+91 95567 85440` and `+91 96529 69996`
  - **Direct Email**: `standardelevators.engworks12@gmail.com`
- **Granular Multi-City Service Area Schema**:
  - **Telangana Hubs**: Hyderabad, Secunderabad, Cyberabad, HITEC City, Gachibowli, Warangal, Karimnagar, Nizamabad, Khammam, Nalgonda, Mahbubnagar.
  - **Andhra Pradesh Hubs**: Vijayawada, Visakhapatnam, Guntur, Tirupati, Rajahmundry, Nellore, Kurnool, Kakinada.

---

### Phase 3: SVO (Search Voice Optimization) & Conversational AI / AEO
Optimized for voice assistants (Google Assistant, Apple Siri, Amazon Alexa) and conversational AI engines (Google Gemini / Search Generative Experience AI Overviews).

Integrated **`FAQPage` Schema** answering direct voice queries in conversational, natural language:
1. *"Who is the best elevator company in Hyderabad for commercial and residential lifts?"*
2. *"How can I contact Standard Elevators for new elevator installations and repair services?"*
3. *"What types of elevator systems does Standard Engineering Works Elevators manufacture?"*
4. *"Does Standard Elevators provide Elevator AMC and modernization across Telangana and Andhra Pradesh?"*
5. *"Are Standard Elevators compliant with Indian safety regulations?"*

---

### Phase 4: Social Sharing Engine & WhatsApp / Meta Preview Optimization
- **Dedicated High-Contrast OpenGraph Preview Card**:
  - Asset: `/public/og-image.jpg` (1200×630px, 81 KB).
  - Designed specifically to satisfy WhatsApp's strict crawler constraints (< 300 KB file limit, high contrast, non-square and square fallbacks).
  - Visual: 3D metallic chevron emblem illuminated by luminous blue backlighting with bold typography `STANDARD ENGINEERING WORKS ELEVATORS`.
- **Explicit Open Graph & Twitter Card Headers**:
  - `og:image`, `og:image:secure_url`, `og:image:type="image/jpeg"`
  - `og:image:width="1200"`, `og:image:height="630"`
  - `twitter:card="summary_large_image"`
  - `twitter:image="https://standardelevatorworks.com/og-image.jpg"`
  - Direct `<meta>` fallbacks injected in `<head>` for crawlers that bypass dynamic client script rendering.

---

### Phase 5: Technical SEO, Indexation & Crawl Budget Management
- **Next.js App Router Architecture**: Server-Side Rendering (SSR) and Static Generation (SSG) for fast TTFB (Time to First Byte).
- **XML Sitemap (`/sitemap.xml`)**:
  - Dynamically registers all static routes (`/`, `/about`, `/services`, `/gallery`, `/contact`, `/privacy-policy`, `/terms`).
  - Automatically queries and includes active database service slugs from Firestore.
  - Declares priority weights (`1.0` for homepage, `0.9` for services, `0.85` for core lifts) and `lastModified` timestamps.
- **Robots.txt (`/robots.txt`)**:
  - Grants unrestricted access to all legitimate search engine bots (`Googlebot`, `Bingbot`, `WhatsApp`, etc.).
  - Protects crawl budget and security by disallowing `/admin/` and `/api/`.

---

### Phase 6: On-Page Semantic HTML & Heading Hierarchy
- **Strict Semantic Elements**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, `<footer>`.
- **Heading Order**: Single `<h1>` per page with progressive `<h2>` sub-sections and `<h3>` component cards.
- **High-Impact Keyword Integration**:
  - Primary: `Standard Elevators`, `Standard Engineering Works Elevators`, `Standard Elevator Works`
  - Commercial intent: `elevator company Hyderabad`, `lift manufacturers Hyderabad`, `elevator repair Hyderabad`, `passenger lifts`, `MRL lifts`, `goods lifts`, `hospital stretcher lifts`, `elevator AMC`.

---

### Phase 7: Image SEO & Asset Optimization
- **Favicons & Snippet Icons**:
  - `/public/favicon.ico`
  - `/public/logo-square.png` (512×512px)
  - `/src/app/icon.png` (512×512px)
  - `/src/app/apple-icon.png` (180×180px)
- **Footer Architectural Image**:
  - `/public/images/footer-elevator-bg.png` integrated with soft backdrop contrast gradients.
- **Image Metadata**: All visuals rendered using Next.js `Image` with descriptive `alt` tags and automatic WebP serving.

---

### Phase 8: Multi-Tier Schema.org Structured Data Ecosystem
1. **`HomeAndConstructionBusiness` / `LocalBusiness`**: Comprehensive NAP, opening hours, currencies, payment methods, geo-coordinates, area served, and founding year.
2. **`Organization`**: Executive branding, corporate logo object, and contact points.
3. **`WebSite`**: Canonical URL with structured `SearchAction` entry point.
4. **`BreadcrumbList`**: Structured trail on every internal page (`/about`, `/services`, `/gallery`, `/contact`).
5. **`Service`**: Dedicated service schemas detailing passenger, MRL, goods, and hospital elevators.
6. **`FAQPage`**: Voice search Q&A data block.

---

### Phase 9: Internal Linking Structure & Topic Clusters
- Clear navigational breadcrumbs for search crawlers.
- Contextual cross-links between services (`/services#primary-solutions`) and inquiry conversion anchors (`/contact#quotation-form`).
- Clickable telephone and email protocols across all views.

---

### Phase 10: Mobile-First UX, Core Web Vitals & Responsiveness
- Viewport configuration: `width=device-width, initial-scale=1, maximum-scale=5`.
- Theme Color: `#051326` for browser toolbar styling.
- Responsive touch targets: Mobile action buttons comply with accessibility touch standards (>= 48px).
- Low CLS (Cumulative Layout Shift) through static sizing on images and video posters.

---

### Phase 11: NAP Consistency & Google Business Profile (GBP) Alignment
To achieve #1 rank in the Google 3-Pack / Local Map Pack, register or verify your Google Business Profile with these identical parameters:
- **Business Name**: `Standard Engineering Works Elevators`
- **Primary Category**: `Elevator Service`
- **Secondary Categories**: `Elevator Manufacturer`, `Engineering Consultant`, `Industrial Equipment Supplier`
- **Primary Phone**: `+91 9515231555` (New Installations)
- **Secondary Phone**: `+91 95567 85440` (Repairs & Inquiries)
- **Website**: `https://standardelevatorworks.com`

---

### Phase 12: Conversion Rate Optimization (CRO)
- **Click-to-Call**: Direct `tel:9515231555`, `tel:9556785440`, `tel:9652969996`.
- **WhatsApp Integration**: Instant pre-filled inquiry messaging via `https://wa.me/919515231555`.
- **Distinct Inquiries Routing**:
  - New installation leads route to `95152 31555`.
  - Service, maintenance, breakdown, and repairs route to `95567 85440` and `96529 69996`.

---

### Phase 13: Audit, Testing & Verification Report
- **TypeScript Typecheck**: `npx tsc --noEmit` passed with **0 errors**.
- **Live Local Endpoint (`http://localhost:3000`) Tests**:
  - `Has 2016`: **PASS**
  - `Has 2003`: **REMOVED**
  - `Has 95567 85440 & 96529 69996`: **PASS**
  - `Has New Installations & Repairs Subheadings`: **PASS**
  - `Has footer-elevator-bg.png`: **PASS**
  - `Has og-image.jpg (WhatsApp preview)`: **PASS**
  - `Has logo-square.png (Google search snippet logo)`: **PASS**
  - `Has FAQPage Schema (SVO)`: **PASS**
  - `Has GeoCoordinates Schema (Local SEO)`: **PASS**
  - `Has SearchAction Schema`: **PASS**
