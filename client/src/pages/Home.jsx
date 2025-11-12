import {Link} from "react-router-dom";
import {useState} from "react";
import {HeroSection} from "../components/layout";

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Enhancement",
      description:
        "Let Google's Gemini AI analyze and enhance your resume with role-specific suggestions, powerful action verbs, and quantifiable achievements.",
    },
    {
      icon: "🎯",
      title: "ATS Optimization",
      description:
        "Beat the bots! Our system ensures your resume passes Applicant Tracking Systems with optimized formatting and keyword placement.",
    },
    {
      icon: "📊",
      title: "Smart Scoring & Insights",
      description:
        "Get instant ATS scores and job-match ratings. Know exactly how your resume performs against real job descriptions and tech stacks.",
    },
    {
      icon: "🎨",
      title: "Professional Templates",
      description:
        "Choose from 8+ sleek, recruiter-approved templates. From Classic to Creative — all ATS-friendly and beautifully designed.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload & Connect",
      description:
        "Upload your existing resume (PDF/DOCX) or connect your LinkedIn profile in seconds.",
      icon: "📤",
    },
    {
      step: "2",
      title: "AI Analysis",
      description:
        "SmartNShine analyzes your content and suggests powerful enhancements tailored to your target role.",
      icon: "🧠",
    },
    {
      step: "3",
      title: "Customize & Perfect",
      description:
        "Choose your template, review AI suggestions, and customize every detail to match your style.",
      icon: "✨",
    },
    {
      step: "4",
      title: "Score & Optimize",
      description:
        "Get your ATS score and job-match insights. Make real-time improvements with AI-powered recommendations.",
      icon: "📈",
    },
    {
      step: "5",
      title: "Download & Shine",
      description:
        "Export your polished, recruiter-ready resume instantly. Share, print, or apply with confidence!",
      icon: "🚀",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Google",
      quote:
        "SmartNShine transformed my resume in minutes. The AI suggestions were spot-on, and I landed 3 interviews in a week!",
      avatar: "👩‍💻",
    },
    {
      name: "Rahul Mehta",
      role: "Product Manager",
      company: "Amazon",
      quote:
        "The ATS scoring feature is a game-changer. I finally understood what recruiters were looking for. Got my dream job!",
      avatar: "👨‍💼",
    },
    {
      name: "Sarah Johnson",
      role: "UX Designer",
      company: "Meta",
      quote:
        "Beautiful templates, powerful AI, and so easy to use. SmartNShine made me stand out from hundreds of applicants.",
      avatar: "👩‍🎨",
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

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* WHO Section - Target Audience */}
      <section id="who" className="py-16 relative">
        {/* Subtle overlay for slight differentiation */}
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Who is SmartNShine For?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Whether you're just starting out or climbing the corporate ladder,
              SmartNShine empowers you to shine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "🎓",
                title: "Students & Freshers",
                desc: "Land your first job with a polished, professional resume that stands out from the crowd.",
              },
              {
                icon: "💻",
                title: "Developers & Engineers",
                desc: "Showcase your tech stack and projects with ATS-optimized formatting that recruiters love.",
              },
              {
                icon: "💼",
                title: "Working Professionals",
                desc: "Climb the ladder faster with AI-enhanced achievements and quantifiable metrics.",
              },
              {
                icon: "🔄",
                title: "Career Switchers",
                desc: "Reposition your skills for a new role with smart, targeted content that highlights transferable skills.",
              },
            ].map((audience, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{audience.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {audience.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {audience.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT Section - Feature Highlights */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Makes SmartNShine Different?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Not just a resume builder — it's your AI-powered career
              advancement partner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-700/50"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Import Feature Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
                    <span className="text-2xl">🚀</span>
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      New Feature
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Import Your GitHub Profile
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Automatically extract your projects, skills, and
                    contributions from GitHub. Let AI transform your code into
                    compelling resume content.
                  </p>
                  <Link
                    to="/github-import"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span>🔗</span>
                    Try GitHub Import
                    <span>→</span>
                  </Link>
                </div>
                <div className="w-full md:w-auto">
                  <div className="relative w-48 h-48 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-20 blur-2xl animate-pulse"></div>
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                      <div className="text-6xl mb-2 text-center">🐙</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          GitHub
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Data Extraction
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHEN Section - Speed & Efficiency */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ⚡ Create Your Resume in Just 5 Minutes
            </h2>
            <p className="text-xl mb-8 opacity-90">
              No more hours of formatting struggles. SmartNShine's AI does the
              heavy lifting while you focus on what matters — getting hired.
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-5xl font-bold mb-2">5</div>
                <div className="text-sm opacity-80">Minutes to Create</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-sm opacity-80">ATS Pass Rate</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">3x</div>
                <div className="text-sm opacity-80">More Interviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHERE Section - Accessibility */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              🌍 Accessible Anywhere, Anytime
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Fully online — no downloads, no installations. Create and edit
              your resume from any device, whether you're at home, in a café, or
              on the go.
            </p>
            <div className="flex justify-center gap-8 text-6xl">
              <span title="Desktop">🖥️</span>
              <span title="Laptop">💻</span>
              <span title="Tablet">📱</span>
              <span title="Mobile">📲</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY Section - Benefits & Emotional Value */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SmartNShine?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Because your career deserves more than a generic template.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Beat the Competition
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stand out with AI-crafted content that hiring managers can't
                ignore. Your resume, but better.
              </p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Gain Confidence
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Know exactly where you stand with instant scoring and job-match
                insights. Apply with certainty.
              </p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Save Time & Stress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stop wrestling with formatting. Focus on your career while AI
                handles the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW Section - Step-by-Step Process */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How SmartNShine Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Five simple steps to your dream job.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl group-hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{step.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/upload"
              className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Building Now — It's Free! 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Don't Just Take Our Word For It
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of successful job seekers who found their dream
              roles with SmartNShine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border-2 border-white/20 dark:border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full px-6 py-5 flex justify-between items-center bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-colors duration-200"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                      {faq.question}
                    </span>
                    <span
                      className={`text-2xl text-blue-600 transform transition-transform duration-300 ${
                        openFAQ === idx ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === idx ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-4 bg-white/50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 leading-relaxed backdrop-blur-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Shine in Your Next Interview?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join 10,000+ professionals who transformed their careers with
              SmartNShine.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link
                to="/upload"
                className="group relative px-10 py-5 bg-white/95 dark:bg-white/90 text-blue-600 dark:text-blue-700 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 backdrop-blur-md border border-white/50"
              >
                Build My Resume — Free Forever 🚀
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <span className="text-green-300 text-xl">✓</span>
                <span>Takes only 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300 text-xl">✓</span>
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300 text-xl">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>
    </div>
  );
};

export default Home;
