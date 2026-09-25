import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";
import LandingNavbar from "../components/landing-v2/LandingNavbar";
import Footer from "../components/layout/Footer";
import {
  CareersHero,
  CareersValues,
  CareersPerks,
  CareersTechStack,
  CareersOpenings,
  CareerJobModal,
  CareersHiringProcess,
  CareersTestimonials,
  CareersFAQ,
  CareersCTA,
  OPEN_ROLES,
} from "../components/careers";

export default function Careers() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const lenisRef = useRef(null);

  // Smooth Lenis Scroll setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });
    lenisRef.current = lenis;

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis when job modal is active to allow effortless inner modal scrolling
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isJobModalOpen) {
      lenisRef.current.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current.start();
      document.body.style.overflow = "unset";
    }
  }, [isJobModalOpen]);

  const handleOpenJobDetails = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleCloseJobDetails = () => {
    setIsJobModalOpen(false);
  };

  const handleOpenApply = (job) => {
    setIsJobModalOpen(false);
    navigate(`/careers/apply/${job?.id || "general"}`);
  };

  const handleGeneralApply = () => {
    navigate("/careers/apply/general");
  };

  const scrollToOpenings = () => {
    const openingsElement = document.getElementById("openings");
    if (openingsElement) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(openingsElement, { offset: -80 });
      } else {
        openingsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070709] text-zinc-900 dark:text-white transition-colors duration-500 font-scoutie selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <SEO
        title="Careers at SmartNShine - Join the Founding Team"
        description="Join our 100% remote early-stage team. We are looking for passionate builders in Growth, Marketing, Community, and Business Development."
        keywords="SmartNShine careers, founding team jobs, remote startup hiring, growth marketer hiring, startup business partner jobs"
        url="https://www.smartnshine.app/careers"
      />

      {/* Floating Top Navbar */}
      <LandingNavbar />

      {/* Hero Section with Live Metrics */}
      <CareersHero
        totalOpenings={OPEN_ROLES.length}
        onExploreRoles={scrollToOpenings}
      />

      {/* Core Values & Operating Principles */}
      <CareersValues />

      {/* Why Join at Day 0 */}
      <CareersPerks />

      {/* Open Roles & Interactive Job Board */}
      <CareersOpenings
        onSelectJob={handleOpenJobDetails}
        onApplyJob={handleOpenApply}
      />

      {/* Engineering Craft & Tech Stack */}
      <CareersTechStack />

      {/* 5-Step Hiring Roadmap */}
      <CareersHiringProcess />

      {/* Team Voices & Culture Testimonials */}
      <CareersTestimonials />

      {/* Candidate FAQs */}
      <CareersFAQ />

      {/* Final Magnetic CTA Banner */}
      <CareersCTA
        onExploreRoles={scrollToOpenings}
        onGeneralApply={() => handleOpenApply(null)}
      />

      {/* Role Specifications Modal */}
      <CareerJobModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={handleCloseJobDetails}
        onApply={handleOpenApply}
      />

      {/* Global Theme-Aware Footer */}
      <Footer />
    </div>
  );
}
