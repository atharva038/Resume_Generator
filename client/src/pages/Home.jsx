import {Link} from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import {motion} from "framer-motion";
import SEO from "../components/common/SEO";
import {
  Sparkles,
  Upload,
  Brain,
  Wand2,
  TrendingUp,
  Download,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  ChevronDown,
  GitBranch,
  Briefcase,
  GraduationCap,
  Code,
  TrendingUpIcon,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const featuresScrollRef = useRef(null);
  const templatesScrollRef = useRef(null);

  // Auto-scroll for features carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuresScrollRef.current) {
        const container = featuresScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // If we're at the end, scroll back to start
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({left: 0, behavior: "smooth"});
        } else {
          // Scroll to next card
          container.scrollBy({left: 470, behavior: "smooth"});
        }
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll for templates carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (templatesScrollRef.current) {
        const container = templatesScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // If we're at the end, scroll back to start
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({left: 0, behavior: "smooth"});
        } else {
          // Scroll to next template
          container.scrollBy({left: 300, behavior: "smooth"});
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollFeatures = (direction) => {
    if (featuresScrollRef.current) {
      const scrollAmount = 470; // width of card + gap
      featuresScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollTemplates = (direction) => {
    if (templatesScrollRef.current) {
      const scrollAmount = 300; // Adjust based on template card width
      templatesScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Enhancement",
      description:
        "Google's Gemini AI analyzes and enhances your resume with role-specific suggestions, powerful action verbs, and quantifiable achievements.",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "ATS Optimization",
      description:
        "Beat applicant tracking systems with optimized formatting and keyword matching.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Smart Scoring & Insights",
      description:
        "Get detailed feedback on every section with actionable improvements.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Wand2,
      title: "Professional Templates",
      description: "Choose from 8 ATS-friendly templates designed by experts.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description:
        "Start free forever or upgrade to Pro at just ₹199/month. No hidden fees, cancel anytime.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload & Connect",
      description:
        "Upload your existing resume (PDF/DOCX) or connect your LinkedIn profile in seconds.",
      icon: Upload,
      color: "blue",
    },
    {
      step: "2",
      title: "AI Analysis",
      description:
        "SmartNShine analyzes your content and suggests powerful enhancements tailored to your target role.",
      icon: Brain,
      color: "purple",
    },
    {
      step: "3",
      title: "Customize & Perfect",
      description:
        "Choose your template, review AI suggestions, and customize every detail to match your style.",
      icon: Wand2,
      color: "violet",
    },
    {
      step: "4",
      title: "Score & Optimize",
      description:
        "Get your ATS score. Make real-time improvements with AI-powered recommendations.",
      icon: TrendingUp,
      color: "cyan",
    },
    {
      step: "5",
      title: "Download & Shine",
      description:
        "Export your polished, recruiter-ready resume instantly. Share, print, or apply with confidence!",
      icon: Download,
      color: "green",
    },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: "Beat the Competition",
      description:
        "Stand out with AI-crafted content that hiring managers can't ignore. Your resume, but better.",
    },
    {
      icon: Shield,
      title: "Gain Confidence",
      description:
        "Know exactly where you stand with instant ATS scoring insights. Apply with certainty.",
    },
    {
      icon: Clock,
      title: "Save Time & Stress",
      description:
        "Stop wrestling with formatting. Focus on your career while AI handles the rest.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Startup",
      quote:
        "SmartNShine transformed my resume in minutes. The AI suggestions were spot-on, and I landed multiple interviews within a week!",
      initial: "S",
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "SaaS Company",
      quote:
        "The ATS scoring feature is a game-changer. I finally understood what recruiters were looking for and got my dream job!",
      initial: "M",
    },
    {
      name: "Emily Thompson",
      role: "UX Designer",
      company: "Design Agency",
      quote:
        "Beautiful templates, powerful AI, and so easy to use. SmartNShine made me stand out from hundreds of applicants.",
      initial: "E",
    },
  ];

  const faqs = [
    {
      question: "Is my resume data safe and private?",
      answer:
        "Absolutely! We use bank-level encryption to protect your data. Your resume is stored securely and never shared with third parties. You can delete your data anytime.",
    },
    {
      question: "Is SmartNShine really free?",
      answer:
        "Yes! Our free plan includes AI-powered parsing, basic enhancements, and access to all templates. Premium features like advanced AI scoring and unlimited downloads are available in our Pro plan.",
    },
    {
      question: "How does the AI enhancement work?",
      answer:
        "We use Google's Gemini 2.5 Flash AI to analyze your resume content and suggest improvements. It adds action verbs, quantifies achievements, optimizes for ATS, and tailors content to your target role.",
    },
    {
      question: "Will my resume pass ATS systems?",
      answer:
        "Yes! All our templates are ATS-optimized with proper formatting, no complex graphics, and keyword-friendly structure. Our scoring system tells you exactly how ATS-friendly your resume is.",
    },
    {
      question: "Can I edit my resume after downloading?",
      answer:
        "Of course! You can edit your resume anytime by logging in. All changes are auto-saved, and you can download updated versions whenever you need.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "We support PDF and DOCX files. Our AI extracts text from both formats and converts them into editable, structured resume data.",
    },
  ];

  const targetAudience = [
    {
      icon: GraduationCap,
      title: "Students & Freshers",
      desc: "Land your first job with a polished, professional resume that stands out from the crowd.",
    },
    {
      icon: Code,
      title: "Developers & Engineers",
      desc: "Showcase your tech stack and projects with ATS-optimized formatting that recruiters love.",
    },
    {
      icon: Briefcase,
      title: "Working Professionals",
      desc: "Climb the ladder faster with AI-enhanced achievements and quantifiable metrics.",
    },
    {
      icon: TrendingUpIcon,
      title: "Career Switchers",
      desc: "Reposition your skills for a new role with smart, targeted content that highlights transferable skills.",
    },
  ];

  return (
    <>
      <SEO
        title="AI-Powered ATS Resume Builder - Create Professional Resumes"
        description="Create professional, ATS-optimized resumes in minutes with AI assistance. Choose from 20+ templates, analyze job matches, and prepare for interviews with SmartNShine."
        keywords="resume builder, ATS optimization, AI resume, job application, career tools, professional resume templates, resume maker, CV builder, job search"
        url="https://www.smartnshine.app"
      />

      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] overflow-x-hidden">
        {/* Subtle grid background pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Hero Section - Premium Style */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Ambient gradient blur effects */}
          <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute top-60 right-20 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:backdrop-blur-xl border border-purple-500/20 dark:border-white/10 rounded-full text-sm font-medium text-purple-600 dark:text-purple-300 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Powered by Google Gemini & OpenAI
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
                className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] text-gray-900 dark:text-white tracking-tight"
              >
                Your resume,
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  10x better
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
              >
                AI-powered resume builder that beats ATS systems and lands
                interviews. Upload your resume, get instant improvements.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.3}}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link
                  to="/upload"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                >
                  Start Building Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:backdrop-blur-xl text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                >
                  See How It Works
                </a>
              </motion.div>
            </div>

            {/* Hero Visual - Glassmorphism Card */}
            <motion.div
              initial={{opacity: 0, y: 40}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, delay: 0.5}}
              className="mt-20 relative"
            >
              <div className="relative max-w-5xl mx-auto">
                {/* Floating ATS Score Badge - Glassmorphism */}
                <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 dark:backdrop-blur-xl text-gray-900 dark:text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-200 dark:border-white/20 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm font-medium">ATS Score: 94%</span>
                </div>

                {/* Resume Preview - Premium Impressive Design */}
                <motion.div
                  className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/5 dark:to-white/[0.02] dark:backdrop-blur-xl rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/10 p-6 aspect-[16/10] overflow-hidden"
                  animate={{
                    boxShadow: [
                      "0 8px 48px rgba(0,0,0,0.1)",
                      "0 12px 56px rgba(168,85,247,0.2)",
                      "0 8px 48px rgba(59,130,246,0.15)",
                      "0 8px 48px rgba(0,0,0,0.1)",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Animated background particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0.2, 0.5, 0.2],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  <div className="h-full bg-white dark:bg-gradient-to-br dark:from-zinc-900/95 dark:via-zinc-900/90 dark:to-black/95 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden relative">
                    {/* Animated gradient overlays */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 pointer-events-none"
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Premium Resume Content */}
                    <div className="h-full p-8 overflow-hidden relative z-10 flex flex-col">
                      {/* Header with gradient name */}
                      <motion.div
                        className="relative mb-6 pb-5"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                      >
                        <div
                          className="border-b-2 border-gradient-to-r from-purple-500 via-blue-500 to-pink-500 pb-4"
                          style={{
                            borderImage:
                              "linear-gradient(to right, rgb(168, 85, 247), rgb(59, 130, 246), rgb(236, 72, 153)) 1",
                          }}
                        >
                          <motion.h1
                            className="text-3xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight"
                            animate={{
                              backgroundPosition: [
                                "0% 50%",
                                "100% 50%",
                                "0% 50%",
                              ],
                            }}
                            style={{
                              backgroundSize: "200% auto",
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            ALEX RIVERA
                          </motion.h1>
                          <p className="text-base font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                            Senior Product Designer • UX Leader
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-300">
                            <motion.span
                              className="flex items-center gap-1.5"
                              whileHover={{scale: 1.05}}
                            >
                              <span className="text-purple-500">✉</span>{" "}
                              alex.rivera@designpro.com
                            </motion.span>
                            <motion.span
                              className="flex items-center gap-1.5"
                              whileHover={{scale: 1.05}}
                            >
                              <span className="text-blue-500">📱</span> +1 (555)
                              987-6543
                            </motion.span>
                            <motion.span
                              className="flex items-center gap-1.5"
                              whileHover={{scale: 1.05}}
                            >
                              <span className="text-pink-500">🌐</span>{" "}
                              alexrivera.design
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Two Column Layout */}
                      <div className="flex-1 grid grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="col-span-2 space-y-5">
                          <motion.div
                            initial={{opacity: 0, x: -30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.4}}
                          >
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
                              About
                            </h2>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                              Award-winning Product Designer with{" "}
                              <strong>10+ years</strong> crafting user-centric
                              experiences. Led design teams at Fortune 500
                              companies, specializing in{" "}
                              <strong>SaaS platforms</strong>.
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{opacity: 0, x: -30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.6}}
                          >
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500"></span>
                              Experience
                            </h2>
                            <div className="space-y-3">
                              <motion.div
                                className="relative pl-4 border-l-2 border-purple-400 dark:border-purple-500"
                                whileHover={{x: 4}}
                              >
                                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                                <div className="flex justify-between mb-1">
                                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Lead Product Designer
                                  </h3>
                                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded">
                                    2021 - Now
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                                  InnovateLabs • San Francisco
                                </p>
                                <ul className="text-[10px] text-gray-600 dark:text-gray-400 space-y-1">
                                  <li className="flex gap-2">
                                    <span className="text-purple-500">▸</span>
                                    <span>
                                      Led redesign increasing user engagement by{" "}
                                      <strong>60%</strong>
                                    </span>
                                  </li>
                                  <li className="flex gap-2">
                                    <span className="text-purple-500">▸</span>
                                    <span>
                                      Managed team of 8 designers across 3
                                      products
                                    </span>
                                  </li>
                                </ul>
                              </motion.div>

                              <motion.div
                                className="relative pl-4 border-l-2 border-blue-400 dark:border-blue-500"
                                whileHover={{x: 4}}
                              >
                                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                                <div className="flex justify-between mb-1">
                                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Senior UX Designer
                                  </h3>
                                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                                    2018 - 2021
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                                  TechFlow • New York
                                </p>
                                <ul className="text-[10px] text-gray-600 dark:text-gray-400">
                                  <li className="flex gap-2">
                                    <span className="text-blue-500">▸</span>
                                    <span>
                                      Designed app with{" "}
                                      <strong>2M+ downloads</strong> & 4.8★
                                      rating
                                    </span>
                                  </li>
                                </ul>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                          <motion.div
                            initial={{opacity: 0, x: 30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.8}}
                          >
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                              Skills
                            </h2>
                            <div className="space-y-2">
                              {[
                                {name: "UI/UX", level: 95, color: "purple"},
                                {name: "Figma", level: 90, color: "blue"},
                                {name: "Prototyping", level: 85, color: "pink"},
                                {name: "Research", level: 88, color: "indigo"},
                              ].map((skill, idx) => (
                                <motion.div
                                  key={skill.name}
                                  initial={{opacity: 0, x: 20}}
                                  animate={{opacity: 1, x: 0}}
                                  transition={{delay: 1 + idx * 0.1}}
                                >
                                  <div className="flex justify-between mb-1">
                                    <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                                      {skill.name}
                                    </span>
                                    <span className="text-[9px] text-gray-500 dark:text-gray-400">
                                      {skill.level}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full"
                                      initial={{width: 0}}
                                      animate={{width: `${skill.level}%`}}
                                      transition={{
                                        duration: 1,
                                        delay: 1.2 + idx * 0.1,
                                      }}
                                      style={{
                                        background: `linear-gradient(to right, ${
                                          skill.color === "purple"
                                            ? "rgb(168, 85, 247), rgb(192, 132, 252)"
                                            : skill.color === "blue"
                                              ? "rgb(59, 130, 246), rgb(96, 165, 250)"
                                              : skill.color === "pink"
                                                ? "rgb(236, 72, 153), rgb(244, 114, 182)"
                                                : "rgb(99, 102, 241), rgb(129, 140, 248)"
                                        })`,
                                      }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{opacity: 0, x: 30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 1.0}}
                          >
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                              Highlights
                            </h2>
                            <div className="space-y-2">
                              {[
                                {icon: "🏆", text: "Awwwards 2023"},
                                {icon: "🎨", text: "Adobe Jam Winner"},
                                {icon: "📱", text: "2M+ Downloads"},
                              ].map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  className="flex items-center gap-2 text-[10px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10"
                                  initial={{opacity: 0, scale: 0.8}}
                                  animate={{opacity: 1, scale: 1}}
                                  transition={{delay: 1.4 + idx * 0.1}}
                                  whileHover={{scale: 1.05, x: 4}}
                                >
                                  <span className="text-sm">{item.icon}</span>
                                  <span>{item.text}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{opacity: 0, x: 30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 1.2}}
                          >
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                              Tools
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "Figma",
                                "Sketch",
                                "XD",
                                "Framer",
                                "Principle",
                              ].map((tool, idx) => (
                                <motion.span
                                  key={tool}
                                  className="px-2 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 text-gray-700 dark:text-gray-300 text-[9px] font-semibold rounded-md border border-purple-300/30 dark:border-purple-500/30"
                                  initial={{opacity: 0, scale: 0.8}}
                                  animate={{opacity: 1, scale: 1}}
                                  transition={{delay: 1.6 + idx * 0.08}}
                                  whileHover={{
                                    scale: 1.15,
                                    boxShadow:
                                      "0 4px 12px rgba(168,85,247,0.4)",
                                    y: -2,
                                  }}
                                >
                                  {tool}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-lg shadow-lg"
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 4px 20px rgba(168,85,247,0.3)",
                          "0 8px 30px rgba(168,85,247,0.6)",
                          "0 4px 20px rgba(168,85,247,0.3)",
                        ],
                      }}
                      transition={{duration: 3, repeat: Infinity}}
                    >
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          animate={{rotate: [0, 360]}}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                        <span className="text-[10px] font-bold text-white tracking-wide">
                          AI ENHANCED
                        </span>
                      </div>
                    </motion.div>

                    {/* Corner accents */}
                    <motion.div
                      className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent rounded-tl-xl pointer-events-none"
                      animate={{opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1]}}
                      transition={{duration: 4, repeat: Infinity}}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-500/20 via-blue-500/10 to-transparent rounded-br-xl pointer-events-none"
                      animate={{opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1]}}
                      transition={{duration: 4, repeat: Infinity, delay: 2}}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Target Audience Section - Glassmorphism */}
        <section className="relative py-20 px-4 border-t border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                Who is SmartNShine For?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                Whether you're just starting out or climbing the corporate
                ladder, SmartNShine empowers you to shine.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {targetAudience.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: idx * 0.1}}
                    className="group p-6 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 shadow-md dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-lg dark:hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
                  >
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 dark:backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm dark:shadow-lg">
                        <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section - Glassmorphism Style */}
        <section
          id="features"
          className="relative py-20 px-4 bg-gray-50 dark:bg-[#0C0C0C] border-t border-gray-200 dark:border-white/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                What Makes SmartNShine Different?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                Not just a resume builder — it's your AI-powered career
                advancement partner.
              </p>
            </div>

            {/* Horizontal Scrollable Container - Glassmorphism Cards */}
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scrollFeatures("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-full border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scrollFeatures("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-full border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </button>

              <div
                ref={featuresScrollRef}
                className="overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
                style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
              >
                <div className="flex gap-6 min-w-max px-2">
                  {/* AI-Powered Enhancement - Glassmorphism Card */}
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                    className="group relative w-[450px] flex-shrink-0 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(168,85,247,0.4)]"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03] pointer-events-none"></div>

                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center border border-purple-200 dark:border-purple-500/20 dark:backdrop-blur-sm shadow-lg shadow-purple-500/20">
                          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                          AI-Powered Enhancement
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm font-light">
                        Get intelligent suggestions to improve your resume
                        content with cutting-edge AI technology.
                      </p>
                    </div>
                    {/* Visual Mockup */}
                    <div className="relative px-6 pb-6">
                      <div className="relative bg-gray-50 dark:bg-black/40 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-md dark:shadow-2xl">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-500/30 shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              AI Suggestion
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Your experience bullet point:
                            </div>
                            <div className="text-xs bg-gray-100 dark:bg-white/5 dark:backdrop-blur-sm rounded p-2 mb-2 line-through text-gray-500 border border-gray-200 dark:border-white/10">
                              "Worked on projects and helped team"
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Enhanced version:
                            </div>
                            <div className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-500/10 dark:to-blue-500/10 dark:backdrop-blur-sm border border-purple-300 dark:border-purple-500/30 rounded p-2 text-gray-700 dark:text-gray-200 shadow-inner">
                              "Led cross-functional team of 5 to deliver 3
                              high-impact projects, increasing efficiency by
                              40%"
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs rounded-lg font-medium hover:from-purple-500 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-purple-500/30">
                            Apply
                          </button>
                          <button className="px-3 py-1.5 border border-gray-300 dark:border-white/20 dark:backdrop-blur-sm text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:border-gray-400 dark:hover:border-white/30 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300">
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ATS Optimization - Glassmorphism Card */}
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: 0.1}}
                    className="group relative w-[450px] flex-shrink-0 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(59,130,246,0.4)]"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-cyan-500/[0.03] pointer-events-none"></div>

                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 dark:backdrop-blur-sm shadow-lg shadow-blue-500/20">
                          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                          ATS Optimization
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm font-light">
                        Beat applicant tracking systems with optimized
                        formatting and keyword matching.
                      </p>
                    </div>
                    {/* Visual Mockup */}
                    <div className="relative px-6 pb-6">
                      <div className="relative bg-gray-50 dark:bg-black/40 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-lg dark:shadow-2xl">
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ATS Score
                            </span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              92%
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 dark:backdrop-blur-sm shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-lg shadow-green-500/50"
                              style={{width: "92%"}}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-500/50"></div>
                            <span className="text-gray-600 dark:text-gray-300 font-light">
                              Keywords matched: 18/20
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-500/50"></div>
                            <span className="text-gray-600 dark:text-gray-300 font-light">
                              Format optimized
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50"></div>
                            <span className="text-gray-600 dark:text-gray-300 font-light">
                              2 suggestions available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Smart Scoring - Glassmorphism Card */}
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="group relative w-[450px] flex-shrink-0 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-500 overflow-hidden shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(249,115,22,0.4)]"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-red-500/[0.03] pointer-events-none"></div>

                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center border border-orange-200 dark:border-orange-500/20 dark:backdrop-blur-sm shadow-lg shadow-orange-500/20">
                          <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                          Smart Scoring & Insights
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm font-light">
                        Get detailed feedback on every section with actionable
                        improvements.
                      </p>
                    </div>
                    {/* Visual Mockup */}
                    <div className="relative px-6 pb-6">
                      <div className="relative bg-gray-50 dark:bg-black/40 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-lg dark:shadow-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-light">
                            Experience
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 dark:backdrop-blur-sm">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full shadow-lg"
                                style={{width: "90%"}}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                              90%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-light">
                            Skills
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 dark:backdrop-blur-sm">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg"
                                style={{width: "85%"}}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                              85%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-light">
                            Education
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 dark:backdrop-blur-sm">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full shadow-lg"
                                style={{width: "70%"}}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                              70%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-light">
                            Summary
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 dark:backdrop-blur-sm">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-lg"
                                style={{width: "60%"}}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                              60%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Professional Templates - Glassmorphism Card */}
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: 0.3}}
                    className="group relative w-[450px] flex-shrink-0 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-500 overflow-hidden shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(16,185,129,0.4)]"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-green-500/[0.03] pointer-events-none"></div>

                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 dark:backdrop-blur-sm shadow-lg shadow-emerald-500/20">
                          <Wand2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                          Professional Templates
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm font-light">
                        Choose from 8 ATS-friendly templates designed by hiring
                        experts.
                      </p>
                    </div>
                    {/* Visual Mockup - Template Examples */}
                    <div className="relative px-6 pb-6">
                      <div
                        ref={templatesScrollRef}
                        className="relative overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <div className="flex gap-3 min-w-max">
                          {/* Modern Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex flex-col gap-2">
                                {/* Header */}
                                <div className="border-b border-gray-200 dark:border-white/10 pb-2">
                                  <div className="h-3 bg-emerald-500 dark:bg-emerald-400 rounded w-2/3 mb-1"></div>
                                  <div className="h-2 bg-gray-300 dark:bg-white/20 rounded w-1/2"></div>
                                </div>
                                {/* Content */}
                                <div className="space-y-2 flex-1">
                                  <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-4/5"></div>
                                  </div>
                                </div>
                                {/* Label */}
                                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 text-center">
                                  Modern
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Professional Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex flex-col gap-2">
                                {/* Header - Two Column */}
                                <div className="grid grid-cols-2 gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
                                  <div>
                                    <div className="h-2.5 bg-blue-500 dark:bg-blue-400 rounded mb-1"></div>
                                    <div className="h-1.5 bg-gray-300 dark:bg-white/20 rounded"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded w-full mb-0.5"></div>
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded w-3/4 ml-auto"></div>
                                  </div>
                                </div>
                                {/* Content */}
                                <div className="space-y-2 flex-1">
                                  <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-4/5"></div>
                                  </div>
                                </div>
                                {/* Label */}
                                <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 text-center">
                                  Professional
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Creative Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex gap-2">
                                {/* Sidebar */}
                                <div className="w-1/3 bg-purple-100 dark:bg-purple-500/20 rounded p-1.5 space-y-1.5">
                                  <div className="h-8 bg-purple-300 dark:bg-purple-400/40 rounded-full"></div>
                                  <div className="h-1 bg-purple-300 dark:bg-purple-400/30 rounded"></div>
                                  <div className="h-1 bg-purple-300 dark:bg-purple-400/30 rounded w-3/4"></div>
                                  <div className="h-1 bg-purple-300 dark:bg-purple-400/30 rounded w-2/3"></div>
                                </div>
                                {/* Main Content */}
                                <div className="flex-1 space-y-2">
                                  <div className="h-2.5 bg-purple-500 dark:bg-purple-400 rounded w-2/3"></div>
                                  <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                  </div>
                                  <div className="space-y-1 mt-2">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-4/5"></div>
                                  </div>
                                  {/* Label at bottom */}
                                  <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 text-center mt-auto pt-8">
                                    Creative
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Minimalist Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex flex-col gap-3">
                                {/* Minimalist Header */}
                                <div className="text-center">
                                  <div className="h-3 bg-gray-800 dark:bg-white/80 rounded w-3/4 mx-auto mb-1"></div>
                                  <div className="h-1.5 bg-gray-400 dark:bg-white/30 rounded w-1/2 mx-auto"></div>
                                </div>
                                {/* Divider */}
                                <div className="h-0.5 bg-gray-300 dark:bg-white/20 rounded"></div>
                                {/* Content */}
                                <div className="space-y-2.5 flex-1">
                                  <div>
                                    <div className="h-1.5 bg-gray-700 dark:bg-white/60 rounded w-1/3 mb-1"></div>
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                  </div>
                                  <div>
                                    <div className="h-1.5 bg-gray-700 dark:bg-white/60 rounded w-1/3 mb-1"></div>
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded w-4/5"></div>
                                  </div>
                                </div>
                                {/* Label */}
                                <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 text-center">
                                  Minimalist
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tech Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex flex-col gap-2">
                                {/* Tech Header with accent */}
                                <div className="relative pl-2 border-l-2 border-cyan-500 dark:border-cyan-400">
                                  <div className="h-2.5 bg-cyan-500 dark:bg-cyan-400 rounded w-2/3 mb-1"></div>
                                  <div className="h-1.5 bg-gray-300 dark:bg-white/20 rounded w-1/2"></div>
                                </div>
                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-1">
                                  <div className="h-1.5 bg-cyan-200 dark:bg-cyan-500/30 rounded-full w-8"></div>
                                  <div className="h-1.5 bg-cyan-200 dark:bg-cyan-500/30 rounded-full w-10"></div>
                                  <div className="h-1.5 bg-cyan-200 dark:bg-cyan-500/30 rounded-full w-7"></div>
                                </div>
                                {/* Content */}
                                <div className="space-y-2 flex-1">
                                  <div className="space-y-1">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                  </div>
                                </div>
                                {/* Label */}
                                <div className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 text-center">
                                  Tech
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Executive Template */}
                          <div className="w-[200px] flex-shrink-0">
                            <div className="aspect-[3/4] bg-white dark:bg-black/60 dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/10 p-3 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
                              <div className="h-full flex flex-col gap-2">
                                {/* Executive Header with underline */}
                                <div className="text-center border-b-2 border-amber-500 dark:border-amber-400 pb-2">
                                  <div className="h-3 bg-amber-600 dark:bg-amber-400 rounded w-3/4 mx-auto mb-1"></div>
                                  <div className="h-1.5 bg-gray-300 dark:bg-white/20 rounded w-1/2 mx-auto"></div>
                                </div>
                                {/* Two Column Layout */}
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                  <div className="col-span-2 space-y-2">
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-1 bg-amber-200 dark:bg-amber-500/20 rounded"></div>
                                    <div className="h-1 bg-amber-200 dark:bg-amber-500/20 rounded"></div>
                                  </div>
                                </div>
                                {/* Label */}
                                <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 text-center">
                                  Executive
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scroll Buttons */}
                      <div className="flex justify-center gap-2 mt-3">
                        <button
                          onClick={() => scrollTemplates("left")}
                          className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all"
                          aria-label="Scroll templates left"
                        >
                          <ChevronLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                        <button
                          onClick={() => scrollTemplates("right")}
                          className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all"
                          aria-label="Scroll templates right"
                        >
                          <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                      </div>

                      <div className="mt-3 text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                          8 professional ATS-friendly templates
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Affordable Pricing - Glassmorphism Card */}
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: 0.4}}
                    className="group relative w-[450px] flex-shrink-0 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-500 overflow-hidden shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(236,72,153,0.4)]"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.03] via-transparent to-rose-500/[0.03] pointer-events-none"></div>

                    <div className="relative p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center border border-pink-200 dark:border-pink-500/20 dark:backdrop-blur-sm shadow-lg shadow-pink-500/20">
                          <DollarSign className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                          Affordable Pricing
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm font-light">
                        Start free forever or upgrade to Pro at just ₹199/month.
                        No hidden fees, cancel anytime.
                      </p>
                    </div>
                    {/* Visual Mockup - Pricing Cards */}
                    <div className="relative px-6 pb-6">
                      <div className="relative bg-gray-50 dark:bg-black/40 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-lg dark:shadow-2xl space-y-3">
                        {/* Free Plan */}
                        <div className="p-3 bg-gray-100 dark:bg-white/5 dark:backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              Free
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹0
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                              <span className="text-gray-600 dark:text-gray-400 font-light">
                                1 Resume/month
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                              <span className="text-gray-600 dark:text-gray-400 font-light">
                                Gemini AI
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* One-Time Plan */}
                        <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:backdrop-blur-sm rounded-lg border border-blue-500/20 shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              One-Time
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                ₹49
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-light">
                                1 Premium Resume
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-light">
                                GPT-4o AI
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pro Plan - Featured */}
                        <div className="relative p-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 dark:backdrop-blur-sm rounded-lg border border-pink-500/30 shadow-lg shadow-pink-500/20">
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-white text-[10px] font-semibold shadow-lg">
                            Popular
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              Pro
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                ₹199
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                /mo
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-light">
                                Unlimited Resumes
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-light">
                                GPT-4o + All Features
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Glassmorphism */}
        <section className="relative py-20 px-4 border-t border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
                Five simple steps. One powerful result.
              </p>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-5 gap-3">
                {howItWorks.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{opacity: 0, y: 20}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{once: true}}
                      transition={{duration: 0.5, delay: idx * 0.1}}
                      className="relative flex flex-col items-start p-5 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-xl dark:hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
                    >
                      {/* Icon Container */}
                      <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-md dark:shadow-lg">
                        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:backdrop-blur-sm border border-purple-300 dark:border-white/20 rounded-lg flex items-center justify-center text-gray-900 dark:text-white text-xs font-semibold shadow-md dark:shadow-lg">
                        {step.step}
                      </div>

                      {/* Content */}
                      <div className="text-left">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Layout */}
            <div className="lg:hidden space-y-4">
              {howItWorks.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{opacity: 0, x: -20}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: idx * 0.1}}
                    className="flex gap-4 p-5 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                  >
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 bg-gray-100 dark:bg-white/5 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-md dark:shadow-lg">
                        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:backdrop-blur-sm border border-purple-300 dark:border-white/20 rounded-lg flex items-center justify-center text-gray-900 dark:text-white text-xs font-semibold">
                          {step.step}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                Start Building Now — It's Free!
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-light">
                ✓ No credit card required • ✓ Takes only 5 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section - Glassmorphism */}
        <section className="relative py-16 px-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/20 dark:to-blue-600/20 dark:backdrop-blur-xl border-y border-gray-200 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white dark:bg-white/5 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  5min
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-light">
                  Average Time
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-white/5 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-light">
                  ATS Pass Rate
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-white/5 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  3x
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-light">
                  More Interviews
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Glassmorphism */}
        <section className="relative py-20 px-4 border-t border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Loved by Job Seekers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                Join thousands of successful professionals who landed their
                dream roles
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{duration: 0.5, delay: idx * 0.1}}
                  className="p-8 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_48px_rgba(255,255,255,0.1)] transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white tracking-tight">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
                        {testimonial.role}
                      </div>
                      <div className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-4 font-light">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Glassmorphism */}
        <section className="relative py-20 px-4 border-t border-gray-200 dark:border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12 tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/5 dark:backdrop-blur-xl shadow-md dark:shadow-lg"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-white text-left tracking-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                        openFAQ === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === idx ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-4 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-white/10 font-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - Premium Glassmorphism */}
        <section className="relative py-24 px-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/10 dark:to-blue-600/10 border-t border-gray-200 dark:border-white/10 overflow-hidden">
          {/* Ambient decorative blurs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Ready to Shine in Your Next Interview?
            </h2>
            <p className="text-xl sm:text-2xl mb-8 text-gray-700 dark:text-gray-300 font-light">
              Join 10,000+ professionals who transformed their careers with
              SmartNShine.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xl font-bold rounded-xl shadow-2xl shadow-purple-500/40 hover:shadow-3xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                Build My Resume — Free Forever
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-700 dark:text-gray-300 font-light">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Takes only 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
