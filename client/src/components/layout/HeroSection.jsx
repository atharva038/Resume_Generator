import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {
  CheckCircle2,
  Sparkles,
  Play,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    let rafId = null;
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, {passive: true});
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const trustPoints = [
    {icon: CheckCircle2, text: "No Credit Card Required"},
    {icon: CheckCircle2, text: "Free Forever Plan"},
    {icon: CheckCircle2, text: "ATS-Optimized Templates"},
  ];

  const floatingResumes = [
    {delay: 0, duration: 3, yOffset: 20},
    {delay: 0.5, duration: 3.5, yOffset: -15},
    {delay: 1, duration: 4, yOffset: 30},
  ];

  return (
    <section
      className="relative min-h-screen overflow-hidden transition-opacity duration-300 w-full"
      style={{
        opacity: Math.max(0.3, 1 - scrollY / 1500),
      }}
    >
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-32 relative z-10 max-w-7xl">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-16">
          {/* Left Side - Text Content */}
          <div
            className={`flex-1 max-w-2xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg mb-6 animate-bounce-slow">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Resume Builder
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Build a{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Smart
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
                Shining
              </span>{" "}
              Resume That Gets You Hired
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Create your AI-enhanced, recruiter-ready resume in just{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                5 minutes
              </span>
              . Beat ATS systems and impress hiring managers — powered by
              cutting-edge AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/upload"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Build My Resume Now — Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <a
                href="#how-it-works"
                className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                See How It Works
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-all duration-500 delay-${
                      index * 100
                    } ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium">{point.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    5min
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average Time
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    95%
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ATS Pass Rate
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    3x
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  More Interviews
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Visual */}
          <div
            className={`flex-1 max-w-xl w-full transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Central Gradient Sphere */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
              </div>

              {/* Floating Resume Cards */}
              <div className="relative w-full h-full flex items-center justify-center">
                {floatingResumes.map((resume, index) => (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      animation: `float ${resume.duration}s ease-in-out infinite`,
                      animationDelay: `${resume.delay}s`,
                    }}
                  >
                    <div
                      className={`w-48 h-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 transform ${
                        index === 0
                          ? "rotate-[-8deg] translate-x-[-60px]"
                          : index === 1
                          ? "rotate-[4deg] translate-x-[60px] translate-y-[-30px] scale-95"
                          : "rotate-[-2deg] translate-y-[40px] scale-90"
                      } hover:scale-105 transition-transform duration-300 cursor-pointer`}
                    >
                      {/* Resume Card Header */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                      </div>
                      {/* AI Badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </div>
                    </div>
                  </div>
                ))}

                {/* Center Sparkle Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl animate-spin-slow">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Orbiting Icons */}
              <div className="absolute inset-0 animate-spin-slower">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse-slower">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      {/* Custom Animations in Style Tag */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateZ(0);
          }
          50% { 
            transform: translateY(-20px) translateZ(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          40% { opacity: 1; }
          80% { transform: translateY(20px); opacity: 0; }
          100% { opacity: 0; }
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          will-change: opacity;
        }
        
        .animate-spin-slow {
          animation: spin 20s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        
        .animate-spin-slower {
          animation: spin 30s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        
        .animate-spin-reverse-slower {
          animation: spin 30s linear infinite reverse;
          will-change: transform;
          transform: translateZ(0);
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        /* Hardware acceleration for smooth animations */
        section {
          will-change: opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
