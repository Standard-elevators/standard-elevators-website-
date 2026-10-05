# Implementation Plan

## Phase 1: Foundation (Current)
- [x] Inspect existing workspace and assets.
- [x] Extract and verify business facts from the brochure.
- [x] Document technical architecture, design system, SEO strategy, and data model.
- [x] Generate foundational project documentation.
- [x] Initialize Next.js scaffolding with Tailwind CSS and TypeScript.

## Phase 2: Design System & Shared Components
- [ ] Implement Tailwind configuration based on the `DESIGN_SYSTEM.md` (colors, typography, spacing).
- [ ] Create the global layout (`app/layout.tsx`) including shared navigation and footer.
- [ ] Build reusable UI components (Buttons, Cards, Inputs).
- [ ] Setup Three.js / React Three Fiber scaffolding with a basic fallback mechanism.

## Phase 3: Public Page Development
- [ ] Develop the Home page (Hero section, services overview, about snippet).
- [ ] Develop the About Us page.
- [ ] Develop the Services page and individual service detail views (using static data initially).
- [ ] Develop the Gallery page (grid layout, lightboxes).
- [ ] Develop the Contact Us page with a functional form.

## Phase 4: Backend & Database Integration
- [ ] Set up Supabase project and apply database schema (`DATA_MODEL.md`).
- [ ] Configure Supabase Auth and Row Level Security (RLS) policies.
- [ ] Replace static data on public pages with dynamic data fetching from Supabase.

## Phase 5: Admin Panel Implementation
- [ ] Build the `/admin/login` route and authentication flow.
- [ ] Create the Admin Dashboard layout.
- [ ] Implement CRUD operations for Services.
- [ ] Implement image upload and management for the Gallery.

## Phase 6: Polish, SEO, and Launch Prep
- [ ] Implement advanced 3D micro-interactions and scroll animations.
- [ ] Conduct accessibility and responsive design audits across all viewports.
- [ ] Finalize metadata, XML sitemaps, and structured data.
- [ ] Final performance testing (Core Web Vitals).
- [ ] Secure credential handover to the client.
