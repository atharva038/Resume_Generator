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

// Non-jumping clean section renderer that prevents layout thrashing and scroll jitter
function LandingSection({ children }) {
  return (
    <Suspense fallback={null}>
      <div className="w-full">
        {children}
      </div>
    </Suspense>
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
      <LandingSection>
        <PainPointsBentoSection />
      </LandingSection>

      {/* 3. Colorful Bento Grid — Platform Capabilities */}
      <LandingSection>
        <PlayfulColorfulBento />
      </LandingSection>

      {/* 4. Live Scrollable Web Portfolios Showcase */}
      <LandingSection>
        <ScrollablePortfoliosSection />
      </LandingSection>

      {/* 5. How It Works — 3-step visual flow */}
      <LandingSection>
        <HowItWorksSection />
      </LandingSection>

      {/* 6. Interactive Scroll-Split Cards: 1 Web Portfolio ➔ 3 ATS Resumes */}
      <LandingSection>
        <ScrollSplitCardsSection />
      </LandingSection>

      {/* 7. Testimonials — Real Social Proof */}
      <LandingSection>
        <TestimonialsHomeSection />
      </LandingSection>

      {/* 8. Pricing — Real Tiers with Live Data */}
      <LandingSection>
        <PricingSection />
      </LandingSection>

      {/* 9. FAQ Accordion */}
      <LandingSection>
        <FAQSection />
      </LandingSection>

      {/* 10. Final CTA Banner */}
      <LandingSection>
        <FinalCTABanner />
      </LandingSection>

      {/* 11. Global Footer */}
      <LandingSection>
        <Footer />
      </LandingSection>
    </>
  );
}
