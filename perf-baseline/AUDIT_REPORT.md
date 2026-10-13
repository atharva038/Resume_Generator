# Performance Baseline Audit Report — SmartNShine Landing Page
**Date:** October 13, 2026
**Target:** https://www.smartnshine.app (Landing Page)
**Environment:** Production build (`vite preview`, Node v24.13.1, Chromium headless)
**Baseline Artifacts Saved To:** `/perf-baseline/`

---

## 1. Baseline Measured Performance (Lighthouse Mobile, Simulated Throttling)
*Averaged across 3 runs against production preview bundle on simulated Moto G4 mobile profile:*

| Metric | Run 1 | Run 2 (Median) | Run 3 | Target |
| :--- | :--- | :--- | :--- | :--- |
| **Performance Score** | 36 / 100 | **37 / 100** | 38 / 100 | **85+** |
| **Total Blocking Time (TBT)** | 1,882 ms | **2,029 ms** | 1,927 ms | **< 200 ms** |
| **First Contentful Paint (FCP)**| 4,173 ms | **4,100 ms** | 4,245 ms | **< 1,800 ms** |
| **Largest Contentful Paint (LCP)**| 6,339 ms | **5,886 ms** | 6,034 ms | **< 2,000 ms** |
| **Cumulative Layout Shift (CLS)**| 0.001 | **0.010** | 0.003 | **< 0.10** |
| **Speed Index** | 6,465 ms | **6,194 ms** | 5,571 ms | **< 3,000 ms** |
| **DOM Node Count** | 8,929 nodes | **8,929 nodes** | 8,929 nodes | **< 1,400 nodes** |
| **Initial Network Requests** | 103 reqs | **103 reqs** | 103 reqs | **Minimal** |

---

## 2. Bundle Composition & Top 10 Largest Chunks
*From `rollup-plugin-visualizer` detailed module tree inspection:*

| # | Chunk Name | Rendered Size | Minified / Gzip | Primary Contents & Culprits |
|---|------------|---------------|-----------------|-----------------------------|
| 1 | `assets/index-DTze1VFz.js` | **2,080.10 KiB** | 1,046.11 kB / 270.49 kB | `src/components` (1,086 KiB) including `GlidingMotionCanvas.jsx` (122 KiB), 15 statically imported resume templates (e.g. `Creative2Template` 64.8 KiB, `SiliconValleyTemplate`, `ClassicTemplate`, etc.); `framer-motion` (237.7 KiB); `react-dom` (131.6 KiB); `motion-dom` (105.7 KiB); `axios` (97.9 KiB); `react-router` (73.4 KiB); static routes `Login`, `Register`, `Dashboard` (70.9 KiB); `yup` (60.8 KiB). |
| 2 | `assets/Editor-DOW5I3DR.js` | **1,384.54 KiB** | 645.52 kB / 176.30 kB | `prosemirror-view` (235 KiB), `@tiptap/core` (166.7 KiB), `prosemirror-model` (120.7 KiB), `EditorSections.jsx` (74.7 KiB), `jobProfiles.js` (54.8 KiB). |
| 3 | `assets/PolarChart-BeEIJ6jm.js` | **798.62 KiB** | 318.23 kB / 95.66 kB | `recharts` (525.0 KiB), `es-toolkit` (56.5 KiB), `decimal.js-light` (48.4 KiB), `d3-scale` (28.0 KiB), `d3-shape` (23.9 KiB). |
| 4 | `assets/adaptPortfolioData-B7y2gtwD.js` | **675.88 KiB** | 392.62 kB / 71.43 kB | `RetroFuturisticTheme.jsx` (105.3 KiB), `SwissArchitecturalTheme.jsx` (79.0 KiB), `LiquidGlassTheme.jsx` (60.6 KiB), `GlassmorphismTheme.jsx` (59.0 KiB), `NeomorphicTheme.jsx` (58.7 KiB), `CyberDevTheme.jsx` (34.1 KiB). |
| 5 | `assets/PortfolioEditor-ZWo7beJd.js` | **187.96 KiB** | 104.32 kB / 21.30 kB | `PortfolioEditor.jsx` (148.5 KiB), `PortfolioTemplateSelectorModal.jsx` (27.2 KiB), `PortfolioEditorHeader.jsx` (7.9 KiB). |
| 6 | `assets/CareerProfile-DYLiVrjh.js` | **146.42 KiB** | 88.26 kB / 15.14 kB | `ProjectsSection.jsx` (17.8 KiB), `PersonalInfoSection.jsx` (15.4 KiB), `ExperienceSection.jsx` (15.1 KiB), `CareerProfile.jsx` (14.0 KiB). |
| 7 | `assets/Upload-BS3KwsSZ.js` | **131.69 KiB** | 75.83 kB / 20.84 kB | `file-selector` (56.1 KiB), `react-dropzone` (49.2 KiB), `UploadDropzone.jsx` (6.4 KiB), `UploadWorkflowGuide.jsx` (5.7 KiB). |
| 8 | `assets/AIInterview-soC3xts_.js` | **126.96 KiB** | 70.44 kB / 18.44 kB | `SetupStep.jsx` (28.8 KiB), `InterviewStep.jsx` (25.0 KiB), `useInterviewSession.js` (24.1 KiB), `useInterviewSpeech.js` (17.4 KiB). |
| 9 | `assets/index-DA0zB6ZJ.js` | **126.25 KiB** | 73.60 kB / 16.99 kB | `InteractiveStudioSection.jsx` (72.8 KiB), `career-os-control-center.jsx` (18.0 KiB), `TemplatesShowcaseSection.jsx` (8.1 KiB), `testimonials-3.jsx` (6.0 KiB). |
| 10| `assets/InterviewResult-WCnLldes.js` | **102.72 KiB** | 54.16 kB / 13.58 kB | `InterviewResult.jsx` (46.2 KiB), `recharts` polar radar selectors & axes (53.3 KiB). |

---

## 3. Audit of All Animations & Compositor Status
*Lighthouse and runtime audit identified 53 animated items with non-composited properties across the landing page:*

| Section & Element | Animated Property / JS Driver | Failure Reason / Compositor Status | Fix Strategy |
| :--- | :--- | :--- | :--- |
| **LandingNavbar** (`<div className="flex items-center...">`) | `transition-all duration-300`, `background-color`, `border-color`, `backdrop-filter` | ❌ Non-composited (`color`, `background-color`) | Split static styles, animate opacity on pseudo-element / overlay layer. |
| **EvilChartsLandingMatrix** (Ambient Glow Blobs x3) | `blur-[120px]`, `transition-colors duration-500`, `will-change: transform` | ❌ Expensive paint (heavy blur + color transitions on 3 huge 650px elements) | Use static gold radial gradient images/blobs, animate `opacity`/`transform` only. |
| **EvilChartsLandingMatrix** (Headline Specular Highlight) | `onMouseMove` -> JS rAF -> inline `backgroundImage: radial-gradient(...)` | ❌ Continuous paint reflow of complex radial gradient string | Move gradient highlight to pseudo-element with fixed gradient and translate3d positioning. |
| **GlidingMotionCanvas** (Physical Gliding Track) | `transform: translateX(...)` duration 1000ms ease | ✅ Compositor-only (`transform`) | Keep timing & easing identical. |
| **GlidingMotionCanvas** (Resume Column Stage) | Framer Motion `motion.div` (`x`, `y`, `scale: [1, 0.88, 1]`) | ⚠️ Main-thread Framer Motion RAF calculations | Optimize RAF / pause when off-screen. |
| **GlidingMotionCanvas** (40x ScaledResumeCards & 35x ScaledPortfolioCards) | `transition-all duration-300`, `transition-colors`, `transition-shadow`, `group-hover:scale-105` | ❌ 48 non-composited `color` & `background-color` transitions across 75+ cards | Restrict transitions to `transform` and `opacity`; pause off-screen animation loops. |
| **PainPointsBentoSection** (Bento Spotlight Cards) | `onMouseMove` -> JS setting `--mouse-x`, `--mouse-y` inline styles | ❌ Continuous repaint on mouse move across cards | Throttle to rAF, optimize off-screen. |
| **PainPointsBentoSection** (Animated Status Rings) | `animate-pulse`, `stroke-dashoffset` | ❌ Non-composited SVG `stroke-dashoffset` (8 items) | Replace stroke offset animation with static SVG + rotating/fading compositor wrapper. |
| **PlayfulColorfulBento** (Platform Bento Cards) | Card spotlight `--mouse-x`, `--mouse-y`, hover scale | ❌ Repaint on mousemove | Throttle to rAF; compositor-only hovers. |
| **ScrollSplitCardsSection** (Sticky 3-Card Stack) | `useScroll` + `useSpring` driving transforms and opacity | ⚠️ Framer Motion layout reads and rAF hooks on scroll | Make scroll listener passive, decouple measurements. |
| **TestimonialsHomeSection** (Testimonial Cards) | `style="--t-card-index: ...; opacity: 0; filter: blur(10px);"` + `transition-colors` | ❌ Non-composited `color` transitions & CSS filter blur animations | Use pre-rendered backdrop with animated opacity; compositor-only transitions. |
| **System Buttons & Template Links** (e.g. `<a className="font-bold...">`) | `transition-colors duration-200` | ❌ Non-composited `color` animation | Restrict transition to `opacity` / `transform` without visual change. |

---

## 4. Audit of Listeners & Layout Reads (Forced Reflow Hotspots)

### A. Layout Reads (DOM Measurements)
1. **`LandingNavbar.jsx:17`**: `window.scrollY > 20` inside scroll listener.
2. **`EvilChartsLandingMatrix.jsx:51`**: `headlineRef.current.getBoundingClientRect()` inside mousemove callback.
3. **`GlidingMotionCanvas.jsx:1953, 1958`**: `window.innerWidth >= 1280` inside unthrottled resize listener.
4. **`PainPointsBentoSection.jsx:28`**: `cardRef.current.getBoundingClientRect()` on every card mousemove.
5. **`PlayfulColorfulBento.jsx:17`**: `cardRef.current.getBoundingClientRect()` on every card mousemove.
6. **`ScrollSplitCardsSection.jsx:144`**: Framer Motion `useScroll({ target: containerRef })` continuously measures element bounding box and scroll offset.
7. **`ScrollSplitCardsSection.jsx:349, 353`**: `window.innerWidth < 768` in resize listener.

### B. Event Listeners
1. **`LandingNavbar.jsx:19`**: `window.addEventListener("scroll", handleScroll, { passive: true })`
2. **`EvilChartsLandingMatrix.jsx:172`**: `onMouseMove={handleMouseMove}` on container
3. **`GlidingMotionCanvas.jsx:1963`**: `window.addEventListener("resize", updateSteps)` without throttling
4. **`PainPointsBentoSection.jsx:52`**: `onMouseMove={handleMouseMove}` on individual bento cards
5. **`PlayfulColorfulBento.jsx:40`**: `onMouseMove={handleMouseMove}` on individual bento cards
6. **`ScrollSplitCardsSection.jsx:355`**: `window.addEventListener("resize", checkMobile)`

---

## 5. Third-Party Scripts & Blocking Network Requests

1. **`https://checkout.razorpay.com/v1/checkout.js`**:
   - Location: `index.html` line 134 (`<script src="..." defer></script>`).
   - Impact: Downloaded and parsed on landing page load even though payment is never initiated on the landing page first viewport.
   - Fix: Defer loading until payment modal is requested or page is completely idle.
2. **Google Fonts (`https://fonts.googleapis.com/css2?...`)**:
   - Location: `index.html` line 128-131.
   - Impact: Synchronously blocks rendering for 7 font families (`Inter`, `JetBrains Mono`, `Newsreader`, `Playfair Display`, `Outfit`, `Plus Jakarta Sans`, `Scoutie Sans`, `Space Grotesk`) with dozens of weights and italics.
   - Fix: Use `font-display: swap`, preload only the critical hero fonts (`Inter` / `Plus Jakarta Sans`), and eliminate unused weights and families on first paint.

---

## 6. Image Inventory (Natural vs Display Dimensions)

| Image URL | Natural Dimensions | Rendered Display (Mobile 375px) | Format | Current Loading Attributes | Optimization Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/logo-dark.png` | 1024 x 1024 | 28 x 28 px | PNG (100 KiB) | `loading="eager"`, no explicit width/height | Resize to 56x56 @2x, serve WebP (< 3 KiB), explicit `width="28" height="28"`. |
| `/logo-light.png`| 1024 x 1024 | 28 x 28 px | PNG (157 KiB) | `loading="eager"`, no explicit width/height | Resize to 56x56 @2x, serve WebP (< 3 KiB), explicit `width="28" height="28"`. |
| `/images/sample-resume.png` | 753 x 1024 | 70 x 169 px | PNG (316 KiB) | `loading="eager"`, no explicit width/height | Resize to 140x338 @2x, WebP (< 25 KiB), explicit `width="70" height="169"`. |
| `/img/Resume/1.png` | 1070 x 1462 | 300 x 392 px | PNG (381 KiB) | `loading="eager"`, no width/height | Resize to 600x784 @2x, WebP, `loading="lazy"` `decoding="async"`. |
| `/img/Resume/2.png` | 1070 x 1416 | 294 x 410 px | PNG (977 KiB) | `loading="eager"`, no width/height | Resize to 588x820 @2x, WebP, `loading="lazy"` `decoding="async"`. |
| `/img/Resume/3.png` | 1076 x 1496 | 300 x 392 px | PNG (403 KiB) | `loading="eager"`, no width/height | Resize to 600x784 @2x, WebP, `loading="lazy"` `decoding="async"`. |
| `/img/portfolios/1.png` | 1920 x 1080 | 341 x 192 px | PNG (843 KiB) | `loading="lazy"`, no width/height | WebP conversion + explicit dimensions. |
| `/img/portfolios/2.png` | 1920 x 1080 | 341 x 192 px | PNG (2,662 KiB)| `loading="lazy"`, no width/height | WebP conversion + explicit dimensions. |
| `/img/portfolios/3.png` | 1920 x 1080 | 341 x 192 px | PNG (1,803 KiB)| `loading="lazy"`, no width/height | WebP conversion + explicit dimensions. |
| `/img/portfolios/4.png` | 1920 x 1080 | 341 x 192 px | PNG (1,448 KiB)| `loading="lazy"`, no width/height | WebP conversion + explicit dimensions. |
| Unsplash external portraits | Variable | ~64 x 64 px | JPEG / PNG | `loading="lazy"` | Self-host / optimize dimensions, explicit `width="64" height="64"`. |

---

## 7. Heaviest Dependencies & Unused Imports

1. **`framer-motion` (237.7 KiB) + `motion-dom` (105.7 KiB)**:
   - Imported at top of bundle, animating items throughout hero and below-fold sections.
2. **15 Resume Templates in `GlidingMotionCanvas.jsx`**:
   - `ClassicTemplate`, `TechTemplate`, `ModernTemplate`, `ImpactProTemplate`, `MinimalTemplate`, `ExecutiveTemplate`, `SiliconValleyTemplate`, `LatexAcademicTemplate`, `NordicSplitTemplate`, `GitHubStyleTemplate`, `Creative2Template`, `StrategicLeadershipTemplate`, `Professional2Template`, `ProfessionalV2Template`, `StructuredPhotoTemplate`.
   - Adds **> 600 KiB** of unneeded template JSX, styling, and icons to initial hero chunk.
3. **`axios` (97.9 KiB) & `yup` (60.8 KiB)**:
   - Bundled in main index chunk due to static imports in `App.jsx` and context providers, although not needed for rendering landing page HTML.
4. **Static Route Imports in `App.jsx`**:
   - `Login`, `Register`, `Dashboard`, `DashboardOverview` are loaded statically at the top of `App.jsx` instead of using `React.lazy()`.
5. **Immediate mount of below-the-fold sections**:
   - `LandingPage.jsx` renders all 10 below-fold sections immediately without IntersectionObserver gating, inflating the DOM to 8,929 nodes and triggering dozens of Framer Motion hooks simultaneously.
