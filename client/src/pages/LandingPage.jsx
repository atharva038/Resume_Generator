import React, { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import SEO from "../components/common/SEO";
import LandingNavbar from "../components/landing-v2/LandingNavbar";
import EvilChartsLandingMatrix from "../components/landing-v2/EvilChartsLandingMatrix";
import PlayfulColorfulBento from "../components/landing-v2/PlayfulColorfulBento";
import HowItWorksSection from "../components/landing-v2/HowItWorksSection";
import PainPointsBentoSection from "../components/landing-v2/PainPointsBentoSection";
import ScrollablePortfoliosSection from "../components/landing-v2/ScrollablePortfoliosSection";
import ScrollSplitCardsSection from "../components/landing-v2/ScrollSplitCardsSection";
import { TestimonialsHomeSection } from "../components/home";
import PricingSection from "../components/landing-v2/PricingSection";
import FAQSection, { SYSTEM_FAQS } from "../components/landing-v2/FAQSection";
import FAQSchema from "../components/common/FAQSchema";
import FinalCTABanner from "../components/landing-v2/FinalCTABanner";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  // Lenis Smooth Scroll initialized exclusively for the Landing Page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
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

      {/* 0. Sleek Floating Glassmorphic Top Navbar */}
      <LandingNavbar />

      {/* 1. Hero Section Matrix with Hardware-Accelerated Gliding Reels & Specular Shader */}
      <EvilChartsLandingMatrix />

      {/* 2. Four Roadblocks Solved (Pain-Point Bento Grid) */}
      <PainPointsBentoSection />

      {/* 3. Colorful Bento Grid — Platform Capabilities */}
      <PlayfulColorfulBento />

      {/* 4. Live Scrollable Web Portfolios Showcase */}
      <ScrollablePortfoliosSection />

      {/* 5. How It Works — 3-step visual flow */}
      <HowItWorksSection />

      {/* 6. Interactive Scroll-Split Cards: 1 Web Portfolio ➔ 3 ATS Resumes */}
      <ScrollSplitCardsSection />

      {/* 7. Testimonials — Real Social Proof */}
      <TestimonialsHomeSection />

      {/* 8. Pricing — Real Tiers with Live Data */}
      <PricingSection />

      {/* 9. FAQ Accordion */}
      <FAQSection />

      {/* 10. Final CTA Banner */}
      <FinalCTABanner />

      {/* 11. Global Footer */}
      <Footer />
    </>
  );
}
