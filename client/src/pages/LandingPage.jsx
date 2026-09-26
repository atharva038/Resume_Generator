import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import SEO from "../components/common/SEO";
import LandingNavbar from "../components/landing-v2/LandingNavbar";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import FAQSchema from "../components/common/FAQSchema";
import { SYSTEM_FAQS } from "../components/landing-v2/FAQSection";

// Lazy-load below-the-fold sections with background idle prefetching
const PainPointsBentoSection = lazy(() => import("../components/landing-v2/PainPointsBentoSection"));
const PlayfulColorfulBento = lazy(() => import("../components/landing-v2/PlayfulColorfulBento"));
const ScrollablePortfoliosSection = lazy(() => import("../components/landing-v2/ScrollablePortfoliosSection"));
const HowItWorksSection = lazy(() => import("../components/landing-v2/HowItWorksSection"));
const ScrollSplitCardsSection = lazy(() => import("../components/landing-v2/ScrollSplitCardsSection"));
const TestimonialsHomeSection = lazy(() =>
  import("../components/home").then((mod) => ({ default: mod.TestimonialsHomeSection }))
);
const PricingSection = lazy(() => import("../components/landing-v2/PricingSection"));
const FAQSection = lazy(() => import("../components/landing-v2/FAQSection"));
const FinalCTABanner = lazy(() => import("../components/landing-v2/FinalCTABanner"));
const Footer = lazy(() => import("../components/layout/Footer"));

// Smooth, non-blocking lazy section with generous root margin to avoid on-scroll lag
function LazySection({ children, minHeight = "200px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        minHeight: isVisible ? "auto" : minHeight,
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${minHeight}`,
      }}
      className="w-full"
    >
      {isVisible ? (
        <Suspense fallback={<div style={{ minHeight }} className="w-full animate-pulse bg-transparent" />}>
          <div className="w-full transition-opacity duration-300 ease-out opacity-100">
            {children}
          </div>
        </Suspense>
      ) : null}
    </div>
  );
}

export default function LandingPage() {
  // Pre-warm below-the-fold component chunks during browser idle time so scrolling is 100% instant and butter-smooth
  useEffect(() => {
    const prefetchChunks = () => {
      import("../components/landing-v2/PainPointsBentoSection");
      import("../components/landing-v2/PlayfulColorfulBento");
      import("../components/landing-v2/ScrollablePortfoliosSection");
      import("../components/landing-v2/HowItWorksSection");
      import("../components/landing-v2/ScrollSplitCardsSection");
      import("../components/home");
      import("../components/landing-v2/PricingSection");
      import("../components/landing-v2/FAQSection");
      import("../components/landing-v2/FinalCTABanner");
      import("../components/layout/Footer");
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(prefetchChunks, { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(prefetchChunks, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <SEO
        title="SmartNShine - #1 ATS Resume Builder & Career Intelligence Platform"
        description="Build ATS-proof resumes, deploy live developer portfolios, and run keyword gap audits."
        keywords="ATS resume templates, resume optimizer, developer portfolio generator, ATS score analyzer, Workday ATS scanner"
        url="https://www.smartnshine.app"
      />
      <FAQSchema faqs={SYSTEM_FAQS} />

      {/* 0. Sleek Floating Glassmorphic Top Navbar (Above the fold - Instant) */}
      <LandingNavbar />

      {/* 1. Hero Section Matrix (Above the fold - Instant) */}
      <EvilChartsLandingMatrix />

      {/* 2. Four Roadblocks Solved (Pain-Point Bento Grid) */}
      <LazySection minHeight="400px">
        <PainPointsBentoSection />
      </LazySection>

      {/* 3. Colorful Bento Grid — Platform Capabilities */}
      <LazySection minHeight="450px">
        <PlayfulColorfulBento />
      </LazySection>

      {/* 4. Live Scrollable Web Portfolios Showcase */}
      <LazySection minHeight="500px">
        <ScrollablePortfoliosSection />
      </LazySection>

      {/* 5. How It Works — 3-step visual flow */}
      <LazySection minHeight="350px">
        <HowItWorksSection />
      </LazySection>

      {/* 6. Interactive Scroll-Split Cards: 1 Web Portfolio ➔ 3 ATS Resumes */}
      <LazySection minHeight="450px">
        <ScrollSplitCardsSection />
      </LazySection>

      {/* 7. Testimonials — Real Social Proof */}
      <LazySection minHeight="350px">
        <TestimonialsHomeSection />
      </LazySection>

      {/* 8. Pricing — Real Tiers with Live Data */}
      <LazySection minHeight="450px">
        <PricingSection />
      </LazySection>

      {/* 9. FAQ Accordion */}
      <LazySection minHeight="300px">
        <FAQSection />
      </LazySection>

      {/* 10. Final CTA Banner */}
      <LazySection minHeight="250px">
        <FinalCTABanner />
      </LazySection>

      {/* 11. Global Footer */}
      <LazySection minHeight="200px">
        <Footer />
      </LazySection>
    </>
  );
}
