# Standard Engineering Works Elevators — Project Handover

> **Project**: Standard Engineering Works Elevators Web Application  
> **Framework**: Next.js 16.3.7 (App Router with Turbopack)  
> **Runtime**: Node.js >= 20.x, React 19.2.8, Tailwind CSS v4  
> **Verification Status**: Ready for Production Launch (Pending Cloud Console API & Secret Configurations)  
> **Verified Local Endpoint**: `http://localhost:3000`

---

## 1. Project Directory Structure

```text
standard-elevators-web/
├── public/                     # Static production assets
│   ├── header-elevator-bg.jpg  # Deep-navy architectural header banner
│   ├── hero-elevator.jpg       # Cinematic hero background
│   ├── logo-header.png         # Horizontal header brand logo
│   ├── logo.jpg                # Footer & brand logo
│   └── videos/
│       └── site-loader.mp4     # Optimized elevator transition video (2.38 MB)
├── scripts/
│   └── audit-check.js          # Automated audit harness for routes, links, & security
├── src/
│   ├── app/
│   │   ├── (public)/           # Root layout and global styles
│   │   ├── about/              # Company profile & engineering heritage
│   │   ├── admin/              # Protected administration portal
│   │   │   ├── gallery/        # Gallery CRUD management with ImageUpload
│   │   │   ├── inquiries/      # Customer quote & inquiry records
│   │   │   ├── login/          # Secure admin authentication
│   │   │   └── services/       # Service catalogue CRUD management
│   │   ├── api/                # Server-side API endpoints
│   │   │   └── cloudinary/
│   │   │       ├── delete/     # Authenticated asset deletion
│   │   │       └── sign/       # Authenticated HMAC-SHA1 upload signatures
│   │   ├── contact/            # Customer quotation & inquiry interface
│   │   ├── gallery/            # Public project gallery with category filters
│   │   ├── privacy-policy/     # Legal privacy documentation
│   │   ├── services/           # Service catalog & dedicated detail routes:
│   │   │   ├── [slug]/         # Dynamic fallback detail route
│   │   │   ├── goods-lifts/    # Industrial heavy-duty cargo specifications
│   │   │   ├── hospital-lifts/ # Medical stretcher elevators
│   │   │   ├── mrl-lifts/      # Machine-Room-Less technology
│   │   │   └── passenger-lifts/# Residential & commercial mobility
│   │   ├── terms/              # Terms of service documentation
│   │   ├── not-found.tsx       # Custom branded 404 error page
│   │   ├── layout.tsx          # Root HTML layout with Viewport & MetadataBase
│   │   ├── robots.ts           # Dynamic SEO robots exclusion rules
│   │   └── sitemap.ts          # Dynamic canonical XML sitemap
│   ├── components/
│   │   ├── admin/              # AdminGuard, ImageUpload, modal dialogs
│   │   ├── Footer.tsx          # Public footer with deep links & legal routes
│   │   ├── Header.tsx          # Responsive navigation header & mobile drawer
│   │   ├── Hero.tsx            # Architectural hero with CTA
│   │   └── SiteLoader.tsx      # Video transition and initial loader
│   ├── context/
│   │   ├── AdminAuthContext.tsx# Firebase user state & admins/{uid} authorization
│   │   └── TransitionContext.tsx# Route transition and video coordination
│   ├── data/
│   │   └── defaultData.ts      # Offline/static fallback services & gallery items
│   ├── lib/
│   │   ├── cloudinary.ts       # Client upload & validation helpers
│   │   ├── firebase.ts         # Firebase App, Auth, & Firestore clients
│   │   ├── firestore-data.ts   # Typed CRUD layer with fallback preservation
│   │   └── server-auth.ts      # Server-side Firebase ID token & admin verification
│   └── types/
│       └── data.ts             # ServiceItem, GalleryItem, and Admin types
├── firestore.rules             # Production Firestore security rules
├── next.config.ts              # Next.js config with security headers & remote hosts
├── package.json                # Project dependencies and operational scripts
└── vercel.json                 # Vercel deployment framework configuration
```

---

## 2. Core Operational Commands

All commands should be executed from the project root directory:

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run ESLint validation (0 errors, 0 warnings)
npm run lint

# Verify TypeScript compilation (0 type errors)
npx tsc --noEmit

# Execute automated site audit (routes, assets, link integrity, security endpoints)
node scripts/audit-check.js

# Build production bundle with Turbopack
npm run build

# Start local production server
npm run start
```

---

## 3. Environment Variables (Names Only)

Store these variables in your hosting provider's secure dashboard (e.g. Vercel Project Settings) or locally in `.env.local` (which is strictly Git-ignored):

### Client-Side Variables (Publicly safe):
* `NEXT_PUBLIC_FIREBASE_API_KEY`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
* `NEXT_PUBLIC_FIREBASE_APP_ID`
* `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
* `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
* `NEXT_PUBLIC_SITE_URL`

### Server-Side Variables (Strictly private — Never prefix with NEXT_PUBLIC_):
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`

---

## 4. Backend & Security Architecture

### A. Firebase Authentication & Admin Authorization
1. **User Identity**: Managed via Firebase Authentication (email/password).
2. **Explicit Authorization**: An authenticated user is only recognized as an administrator if a corresponding document exists at `admins/{uid}` in Firestore with `{ isActive: true }`.
3. **Protected Admin Routes**: `/admin`, `/admin/services`, `/admin/gallery`, `/admin/inquiries` are guarded by `<AdminGuard />`, redirecting unauthenticated or unauthorized visitors to `/admin/login`.
4. **Server Authorization Utility**: `src/lib/server-auth.ts` verifies incoming Firebase ID tokens against Google Identity Toolkit REST API and confirms the active admin role in Firestore before granting access to server-side endpoints.

### B. Firestore Security Rules ([firestore.rules](file:///c:/Users/sai%20veni/OneDrive/Desktop/standard%20elevators%20web/firestore.rules))
* **Public Reads**: Only items with `status == 'published'` in `services` and `gallery` can be read publicly.
* **Admin Writes**: All creation, modification, and deletion in `services` and `gallery` strictly require `isAuthorizedAdmin()`.
* **Inquiries**: Public visitors can submit quotes with validated fields (`name`, `phone`); only active administrators can read or manage inquiries.
* **Admins Collection**: Client-side writes are forbidden (`allow write: if false;`).

### C. Cloudinary Image Uploads & Management
* **Upload Strategy**: Authenticated server-side signed uploads via `POST /api/cloudinary/sign`.
* **Preset Permissions**: The preset `ml_default` requires signed authentication; client-side unsigned uploads are blocked by Cloudinary.
* **Deletion**: Asset cleanup on item deletion is performed through the authorized server endpoint `POST /api/cloudinary/delete`.
* **Safe Fallback**: If server secrets are pending configuration, the admin `ImageUpload` component gracefully provides manual URL entry so administrative catalog operations are never halted.

---

## 5. Administrative Workflows

1. **Accessing the Portal**: Navigate to `/admin/login`. Enter authorized administrator credentials.
2. **Managing Services**:
   * Navigate to `/admin/services`.
   * Create or edit services with custom titles, URL slugs, descriptions, bulleted technical specifications, and uploaded images.
   * Toggle publication status between **Published** (visible to public) and **Draft** (hidden from public).
   * Delete outdated services (triggers Cloudinary asset cleanup if `imagePublicId` is registered).
3. **Managing Project Gallery**:
   * Navigate to `/admin/gallery`.
   * Upload site installation photos, assign elevator categories, and specify display ordering.
4. **Viewing Customer Inquiries**:
   * Navigate to `/admin/inquiries` to review contact form submissions and quote requests.

---

## 6. Production Deployment & Rollback Guide

### Vercel Deployment (Recommended):
1. Push repository code to a private GitHub repository.
2. Link the repository in the **Vercel Dashboard**.
3. In **Project Settings > Environment Variables**, input all client-side and server-side variables.
4. Deploy the production branch.

### Custom Domain & SSL:
1. In Vercel, go to **Settings > Domains** and enter your production domain (e.g., `standardelevators.in`).
2. At your domain registrar (e.g., GoDaddy, Namecheap):
   * Add an **A Record**: `@` points to `76.76.21.21`.
   * Add a **CNAME Record**: `www` points to `cname.vercel-dns.com`.
3. Vercel will automatically provision SSL/TLS certificates via Let's Encrypt.

### Instant Rollback Plan:
* If an error occurs in production, open **Vercel Dashboard > Deployments**, locate the last known healthy deployment, click the three dots (`...`), and select **Instant Rollback**. Traffic reverts in seconds without requiring a code commit.

---

## 7. Known External Blockers & Action Items

| Blocker | Impact | Action Required |
| :--- | :--- | :--- |
| **Cloud Firestore API Disabled** | Firestore queries fall back to static data; admin cannot persist new records live | Visit [Google Cloud Console for standard-engineering-wor-c28e6](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=standard-engineering-wor-c28e6) and click **Enable**. |
| **Firestore Security Rules Deployment** | Default security rules apply until deployed | Deploy project rules using Firebase CLI: `firebase deploy --only firestore:rules` |
| **Cloudinary Server Credentials** | `/api/cloudinary/sign` returns HTTP 501; signed uploads blocked | Add `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from [console.cloudinary.com](https://console.cloudinary.com) to hosting environment variables. |
| **Domain DNS Setup** | Website accessible only on host URL until DNS mapped | Point registrar `A` and `CNAME` records to Vercel Anycast IP. |
