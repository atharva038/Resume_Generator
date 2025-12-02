import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {
  CheckCircle2,
  Sparkles,
  Play,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import TechTemplate from "../templates/TechTemplate";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [laptopScrollPosition, setLaptopScrollPosition] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  // Handle CTA button click
  const handleBuildResumeClick = (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

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

  // Auto-scroll laptop screen templates
  useEffect(() => {
    const interval = setInterval(() => {
      setLaptopScrollPosition((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Comprehensive sample resume data for template previews
  const sampleResumeData = {
    name: "John Doe",
    contact: {
      email: "john.doe@email.com",
      phone: "+1 (234) 567-8900",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      website: "johndoe.dev",
    },
    summary:
      "Innovative software engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Specialized in full-stack development, cloud architecture, and agile methodologies. Proven track record of delivering high-impact solutions that drive business growth and enhance user experience.",
    skills: [
      {
        category: "Frontend Development",
        items: [
          "React.js",
          "Vue.js",
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "Redux",
          "HTML5/CSS3",
        ],
      },
      {
        category: "Backend Development",
        items: [
          "Node.js",
          "Express.js",
          "Python",
          "Django",
          "GraphQL",
          "REST APIs",
          "Microservices",
        ],
      },
      {
        category: "Cloud & DevOps",
        items: [
          "AWS",
          "Docker",
          "Kubernetes",
          "CI/CD",
          "Jenkins",
          "Terraform",
          "Azure",
        ],
      },
      {
        category: "Database & Storage",
        items: [
          "MongoDB",
          "PostgreSQL",
          "Redis",
          "Elasticsearch",
          "MySQL",
          "DynamoDB",
        ],
      },
      {
        category: "Tools & Methodologies",
        items: [
          "Git",
          "Agile/Scrum",
          "JIRA",
          "Testing (Jest, Cypress)",
          "System Design",
        ],
      },
      {
        category: "Soft Skills",
        items: [
          "Team Leadership",
          "Technical Mentoring",
          "Problem Solving",
          "Communication",
          "Project Management",
        ],
      },
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer & Team Lead",
        location: "San Francisco, CA",
        startDate: "Jan 2020",
        endDate: "Present",
        achievements: [
          "Led team of 8 developers in architecting and building enterprise-scale SaaS platform serving 50K+ users",
          "Reduced application load time by 60% through implementing code splitting and lazy loading strategies",
          "Designed and implemented microservices architecture, improving system reliability to 99.9% uptime",
          "Implemented CI/CD pipeline using Jenkins and Docker, reducing deployment time from 4 hours to 15 minutes",
          "Mentored 5 junior developers, with 3 promoted to mid-level positions within 18 months",
          "Spearheaded adoption of TypeScript across codebase, reducing production bugs by 35%",
        ],
      },
      {
        company: "StartUp Inc",
        position: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "Jun 2018",
        endDate: "Dec 2019",
        achievements: [
          "Built and launched 3 customer-facing web applications using React, Node.js, and MongoDB",
          "Integrated third-party APIs including Stripe, SendGrid, and Google Analytics",
          "Collaborated with UX team to redesign dashboard, increasing user engagement by 45%",
          "Implemented real-time features using WebSockets, enhancing user experience for chat functionality",
          "Optimized database queries reducing average response time by 40%",
        ],
      },
      {
        company: "Digital Solutions LLC",
        position: "Junior Web Developer",
        location: "Los Angeles, CA",
        startDate: "Aug 2016",
        endDate: "May 2018",
        achievements: [
          "Developed responsive websites for 15+ clients using HTML, CSS, JavaScript, and WordPress",
          "Assisted in migration of legacy PHP applications to modern React-based architecture",
          "Implemented SEO best practices resulting in 50% increase in organic traffic for client sites",
          "Collaborated with design team to ensure pixel-perfect implementation of mockups",
        ],
      },
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science in Computer Science",
        location: "Berkeley, CA",
        graduationDate: "2016",
        gpa: "3.8/4.0",
        coursework:
          "Data Structures, Algorithms, Database Systems, Web Development, Machine Learning",
      },
      {
        institution: "Stanford University",
        degree: "Professional Certificate in Cloud Computing",
        location: "Stanford, CA",
        graduationDate: "2021",
        gpa: "",
        coursework:
          "Cloud Architecture, Distributed Systems, Container Orchestration",
      },
    ],
    projects: [
      {
        name: "E-Commerce Platform",
        description:
          "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Handles 10K+ transactions monthly.",
        technologies: [
          "React",
          "Node.js",
          "MongoDB",
          "Stripe",
          "Redis",
          "AWS S3",
        ],
        date: "2023",
        link: "github.com/johndoe/ecommerce",
      },
      {
        name: "Real-Time Collaboration Tool",
        description:
          "Web-based collaborative workspace with live document editing, video conferencing, and task management features.",
        technologies: [
          "Next.js",
          "WebRTC",
          "Socket.io",
          "PostgreSQL",
          "Docker",
        ],
        date: "2022",
        link: "github.com/johndoe/collab-tool",
      },
      {
        name: "AI-Powered Resume Builder",
        description:
          "Smart resume builder with AI-driven content suggestions, ATS optimization, and 20+ professional templates.",
        technologies: [
          "React",
          "Express.js",
          "OpenAI API",
          "MongoDB",
          "Tailwind CSS",
        ],
        date: "2024",
        link: "github.com/johndoe/resume-ai",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        date: "2022",
      },
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
      },
      {
        name: "Professional Scrum Master I (PSM I)",
        issuer: "Scrum.org",
        date: "2021",
      },
    ],
    achievements: [
      "Employee of the Year 2022 - Tech Corp",
      "Published 8 technical articles on Medium with 25K+ combined views",
      "Open source contributor - 500+ GitHub stars across projects",
      "Speaker at React Summit 2023 - 'Building Scalable React Applications'",
      "Hackathon Winner - TechCrunch Disrupt 2021",
    ],
  };

  // Resume templates for mockup display with actual template components
  const resumeTemplates = [
    {
      id: 1,
      name: "Professional",
      component: ProfessionalTemplate,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      name: "Modern",
      component: ModernTemplate,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      name: "Creative",
      component: CreativeTemplate,
      color: "from-orange-500 to-red-600",
    },
    {
      id: 4,
      name: "Executive",
      component: ExecutiveTemplate,
      color: "from-gray-700 to-gray-900",
    },
    {
      id: 5,
      name: "Minimalist",
      component: MinimalTemplate,
      color: "from-teal-500 to-cyan-600",
    },
    {
      id: 6,
      name: "Tech",
      component: TechTemplate,
      color: "from-emerald-500 to-green-600",
    },
  ];

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    <section className="relative min-h-screen overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Vibrant Gradient Orbs Background - Static */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{animationDelay: "700ms"}}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 dark:bg-pink-500/15 rounded-full blur-3xl animate-pulse"
          style={{animationDelay: "1000ms"}}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10 max-w-7xl">
        {/* Mobile Layout - Vertical */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* Mobile - Laptop Animation First */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            {/* Laptop Mockup */}
            <div className="relative animate-float">
              {/* Laptop Base Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-700/50 to-transparent blur-xl animate-pulse"></div>

              {/* Laptop Screen Container */}
              <div className="relative bg-gray-900 dark:bg-gray-950 rounded-t-2xl border-4 border-gray-800 dark:border-gray-900 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] w-full">
                {/* Top Bar (Camera/Notch) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-6 bg-gray-800 dark:bg-gray-950 rounded-b-2xl z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-700 dark:bg-gray-800 rounded-full animate-pulse"></div>
                </div>

                {/* Scrolling Template Gallery Inside Screen */}
                <div className="relative w-full h-[320px] sm:h-[360px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                  {/* Scrolling Content */}
                  <div
                    className="absolute inset-0 p-4 sm:p-6 space-y-4 sm:space-y-6"
                    style={{
                      transform: `translateY(-${laptopScrollPosition}%)`,
                      transition: "transform 0.5s ease-out",
                    }}
                  >
                    {/* Duplicate templates for seamless loop */}
                    {[...resumeTemplates, ...resumeTemplates].map(
                      (template, index) => {
                        const TemplateComponent = template.component;
                        return (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              {/* Miniature Template Preview - Mobile Version */}
                              <div className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] bg-white rounded shadow-md overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full flex items-start justify-center overflow-hidden">
                                  <div
                                    className="origin-top"
                                    style={{
                                      transform: "scale(0.165)",
                                      width: "850px",
                                    }}
                                  >
                                    <div className="w-[850px] bg-white">
                                      <TemplateComponent
                                        resumeData={sampleResumeData}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Template Info - Mobile Version */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-xs sm:text-sm transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                                  {template.name} Template
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                                  Professional & ATS-Optimized
                                </p>
                                <div className="flex gap-0.5 sm:gap-1 mt-1 sm:mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400 animate-pulse"
                                      style={{
                                        animationDelay: `${star * 100}ms`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Screen Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Laptop Keyboard/Base */}
              <div className="relative h-3 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-b-lg w-full"></div>
              <div className="relative h-1 bg-gray-200 dark:bg-gray-600 mx-auto w-[90%]"></div>
            </div>
          </div>

          {/* Mobile - Text Content Below */}
          <div
            className={`transition-all duration-1000 text-center ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 rounded-full mb-6 sm:mb-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.2s both",
              }}
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Resume Builder
              </span>
            </div>

            {/* Bold Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-4 sm:mb-6"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.4s both",
              }}
            >
              <span className="text-gray-900 dark:text-white">Build a </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart
              </span>
              <span className="text-gray-900 dark:text-white">, </span>
              <span className="block mt-1 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Shining
              </span>
              <span className="block mt-1 text-gray-900 dark:text-white">
                Resume That Gets You Hired
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg md:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.6s both",
              }}
            >
              Create your AI-enhanced, recruiter-ready resume in just{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                5 minutes
              </span>
              . Beat ATS systems and impress hiring managers — powered by
              cutting-edge AI.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.8s both",
              }}
            >
              <button
                onClick={handleBuildResumeClick}
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-1 cursor-pointer text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Build My Resume Now — Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>

              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 hover:-translate-y-1 text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1.1s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Free Forever Plan</span>
              </div>
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1.2s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>ATS-Optimized Templates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop - 2 Column Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12">
          {/* Left Side - Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-full mb-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.2s both",
              }}
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Resume Builder
              </span>
            </div>

            {/* Bold Headline */}
            <h1
              className="text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-6"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.4s both",
              }}
            >
              <span className="text-gray-900 dark:text-white">Build a </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart
              </span>
              <span className="text-gray-900 dark:text-white">, </span>
              <span className="block mt-1 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Shining
              </span>
              <span className="block mt-1 text-gray-900 dark:text-white">
                Resume That Gets You Hired
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.6s both",
              }}
            >
              Create your AI-enhanced, recruiter-ready resume in just{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                5 minutes
              </span>
              . Beat ATS systems and impress hiring managers — powered by
              cutting-edge AI.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex gap-4 mb-10"
              style={{
                animation: "fadeInUp 0.6s ease-out 0.8s both",
              }}
            >
              <button
                onClick={handleBuildResumeClick}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Build My Resume Now — Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>

              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 hover:-translate-y-1"
              >
                <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                See How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1.1s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Free Forever Plan</span>
              </div>
              <div
                className="flex items-center gap-2 transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out 1.2s both`,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>ATS-Optimized Templates</span>
              </div>
            </div>
          </div>

          {/* Right Side - Laptop Mockup with Template Gallery */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Laptop Mockup */}
            <div className="relative animate-float md:w-[85%] lg:w-[95%] xl:w-full">
              {/* Laptop Base Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-700/50 to-transparent blur-xl animate-pulse"></div>

              {/* Laptop Screen Container */}
              <div className="relative bg-gray-900 dark:bg-gray-950 rounded-t-2xl border-4 border-gray-800 dark:border-gray-900 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] w-full">
                {/* Top Bar (Camera/Notch) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-6 bg-gray-800 dark:bg-gray-950 rounded-b-2xl z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-700 dark:bg-gray-800 rounded-full animate-pulse"></div>
                </div>

                {/* Scrolling Template Gallery Inside Screen */}
                <div className="relative w-full h-[420px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                  {/* Scrolling Content */}
                  <div
                    className="absolute inset-0 p-6 space-y-6"
                    style={{
                      transform: `translateY(-${laptopScrollPosition}%)`,
                      transition: "transform 0.5s ease-out",
                    }}
                  >
                    {/* Duplicate templates for seamless loop */}
                    {[...resumeTemplates, ...resumeTemplates].map(
                      (template, index) => {
                        const TemplateComponent = template.component;
                        return (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                          >
                            <div className="flex items-center gap-3">
                              {/* Miniature Template Preview - Laptop Version */}
                              <div className="w-[170px] h-[220px] bg-white rounded shadow-md overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full flex items-start justify-center overflow-hidden">
                                  <div
                                    className="origin-top transition-transform duration-300 group-hover:scale-105"
                                    style={{
                                      transform: "scale(0.20)",
                                      width: "850px",
                                    }}
                                  >
                                    <div className="w-[850px] bg-white">
                                      <TemplateComponent
                                        resumeData={sampleResumeData}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Template Info - Laptop Version */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                                  {template.name} Template
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Professional & ATS-Optimized
                                </p>
                                <div className="flex gap-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse"
                                      style={{
                                        animationDelay: `${star * 100}ms`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  {/* Screen Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Laptop Keyboard/Base */}
              <div className="relative h-3 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-b-lg w-full"></div>
              <div className="relative h-1 bg-gray-200 dark:bg-gray-600 mx-auto w-[90%]"></div>
            </div>

            {/* Template Carousel Below Laptop */}
            <div className="mt-8 sm:mt-12 relative hidden lg:block">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Left Arrow */}
                <button
                  onClick={() => scrollCarousel("left")}
                  className="flex-shrink-0 p-1.5 sm:p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
                  aria-label="Previous templates"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>

                {/* Carousel */}
                <div
                  ref={carouselRef}
                  className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                >
                  {resumeTemplates.map((template) => {
                    const TemplateComponent = template.component;
                    return (
                      <div
                        key={template.id}
                        className="flex-shrink-0 w-48 sm:w-56 lg:w-60 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                      >
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden">
                          {/* Template Preview - Carousel Version (Larger) */}
                          <div className="h-64 sm:h-72 lg:h-80 bg-white overflow-hidden relative">
                            <div
                              className="absolute top-0 left-1/2 transition-transform duration-500 group-hover:scale-110"
                              style={{
                                transform: "translateX(-50%) scale(0.235)",
                                transformOrigin: "top center",
                                width: "850px",
                              }}
                            >
                              <div className="w-[850px] bg-white">
                                <TemplateComponent
                                  resumeData={sampleResumeData}
                                />
                              </div>
                            </div>
                            {/* Gradient Overlay for visual appeal */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-5 mix-blend-multiply pointer-events-none transition-opacity duration-300 group-hover:opacity-10`}
                            ></div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out pointer-events-none"></div>
                          </div>

                          {/* Template Name */}
                          <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-indigo-900/20">
                            <div className="flex items-center justify-between">
                              <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:to-purple-600">
                                {template.name}
                              </span>
                              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            </div>
                          </div>

                          {/* Hover Highlight */}
                          <div className="absolute inset-0 border-2 border-blue-500 dark:border-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollCarousel("right")}
                  className="flex-shrink-0 p-1.5 sm:p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
                  aria-label="Next templates"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Subtle bounce */}
      <div className="hidden lg:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-subtle-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Hide scrollbar for carousel */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-subtle-bounce {
          animation: subtleBounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
