import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import SEO from "../components/common/SEO";
import LandingNavbar from "../components/landing-v2/LandingNavbar";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import FAQSchema from "../components/common/FAQSchema";
import { SYSTEM_FAQS } from "../components/landing-v2/FAQSection";

// Lazy-load below-the-fold sections
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

// Viewport-aware section loader with generous 600px pre-mount margin & reserved heights
function LandingSection({ children, minHeight = 600, id }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (inView) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "600px 0px 600px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [inView]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className="w-full"
      style={
        !inView
          ? {
              minHeight: `${minHeight}px`,
              contentVisibility: "auto",
              containIntrinsicSize: `auto ${minHeight}px`,
            }
          : undefined
      }
    >
      {inView ? (
        <Suspense fallback={<div style={{ minHeight: `${minHeight}px` }} />}>
          {children}
        </Suspense>
      ) : (
        <div style={{ minHeight: `${minHeight}px` }} />
      )}
    </div>
  );
}

export default function LandingPage() {
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
      <LandingSection minHeight={900}>
        <PainPointsBentoSection />
      </LandingSection>

      {/* 3. Colorful Bento Grid — Platform Capabilities */}
      <LandingSection minHeight={850}>
        <PlayfulColorfulBento />
      </LandingSection>

      {/* 4. Live Scrollable Web Portfolios Showcase */}
      <LandingSection minHeight={750}>
        <ScrollablePortfoliosSection />
      </LandingSection>

      {/* 5. How It Works — 3-step visual flow */}
      <LandingSection minHeight={650}>
        <HowItWorksSection />
      </LandingSection>

      {/* 6. Interactive Scroll-Split Cards: 1 Web Portfolio ➔ 3 ATS Resumes */}
      <LandingSection minHeight={900}>
        <ScrollSplitCardsSection />
      </LandingSection>

      {/* 7. Testimonials — Real Social Proof */}
      <LandingSection minHeight={800}>
        <TestimonialsHomeSection />
      </LandingSection>

      {/* 8. Pricing — Real Tiers with Live Data */}
      <LandingSection minHeight={900} id="pricing">
        <PricingSection />
      </LandingSection>

      {/* 9. FAQ Accordion */}
      <LandingSection minHeight={700} id="faq">
        <FAQSection />
      </LandingSection>

      {/* 10. Final CTA Banner */}
      <LandingSection minHeight={450}>
        <FinalCTABanner />
      </LandingSection>

      {/* 11. Global Footer */}
      <LandingSection minHeight={400}>
        <Footer />
      </LandingSection>
    </>
  );
}
