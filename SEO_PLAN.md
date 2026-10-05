# SEO Plan

## Technical SEO Architecture
- **Framework**: Next.js App Router for optimal server-side rendering (SSR) and static site generation (SSG).
- **URLs**: Search-friendly, descriptive, and consistent URL structures.
- **Metadata**: Unique page titles and meta descriptions for every route using the Next.js Metadata API.
- **Sitemap & Robots**: Automatic XML sitemap generation and proper `robots.txt` configuration.
- **Canonical Tags**: Explicit canonical URLs for all pages to prevent duplicate content issues.
- **Indexation**: Appropriate index/noindex rules (e.g., noindex for all `/admin/*` routes).

## On-Page SEO
- **Semantic HTML**: Proper heading hierarchy (single `<h1>` per page) and use of sectioning elements (`<article>`, `<section>`, `<nav>`, `<aside>`).
- **Images**: Descriptive `alt` text for all images. Next.js `<Image>` component for automatic optimization (WebP/AVIF) and lazy loading.
- **Internal Linking**: Meaningful anchor text and structured internal navigation.

## Structured Data (Schema.org)
- Implement `Organization` and/or `LocalBusiness` schema using verified business information (name, phone, email, service areas).
- Add `Service` or `Product` schemas for specific elevator models when explicit data is confirmed.

## Performance (Core Web Vitals)
- Maintain fast LCP (Largest Contentful Paint) and low CLS (Cumulative Layout Shift) by strictly controlling asset loading and avoiding heavy client-side 3D rendering blocks above the fold.

## Strategy Limitations
- Local SEO targeting will initially focus broadly on Telangana and Andhra Pradesh. Specific city targeting will only commence once explicit verification is provided by the business.
- Avoid keyword stuffing and doorway pages. Focus on high-quality, relevant content that genuinely answers user intent.
