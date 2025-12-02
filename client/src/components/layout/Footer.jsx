import {Link} from "react-router-dom";
import {
  Sparkles,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Github,
  Shield,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {threshold: 0.1}
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const productLinks = [
    {name: "AI Resume Builder", path: "/upload"},
    {name: "ATS Checker", path: "/upload"},
    {name: "Resume Templates", path: "/templates"},
    {name: "AI Enhancer", path: "/upload"},
    {name: "Pricing", path: "/pricing"},
  ];

  // Legal & Policies (REQUIRED FOR RAZORPAY APPROVAL)
  const resourceLinks = [
    {name: "Terms & Conditions", path: "/terms-and-conditions"},
    {name: "Privacy Policy", path: "/privacy-policy"},
    {name: "Refund Policy", path: "/refund-policy"},
    {name: "Shipping Policy", path: "/shipping-policy"},
  ];

  // Hidden until connected to real data
  const socialLinks = [
    // {
    //   name: "LinkedIn",
    //   icon: Linkedin,
    //   url: "https://linkedin.com/company/smartnshine",
    //   color: "hover:text-blue-400",
    // },
    // {
    //   name: "Twitter",
    //   icon: Twitter,
    //   url: "https://twitter.com/smartnshine",
    //   color: "hover:text-sky-400",
    // },
    // {
    //   name: "GitHub",
    //   icon: Github,
    //   url: "https://github.com/smartnshine",
    //   color: "hover:text-purple-400",
    // },
  ];

  return (
    <footer
      ref={footerRef}
      className={`bg-gradient-to-b from-slate-900 to-slate-800 text-gray-300 transition-all duration-1000 no-print ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 blur-md bg-blue-500/30 group-hover:bg-blue-500/50 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                SmartNShine
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Build resumes that shine in every interview. Powered by AI to help
              you land your dream job.
            </p>
            {/* Social Media Icons - Hidden until connected to real data */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-slate-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:bg-slate-700 hover:scale-110 hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies Column (REQUIRED FOR RAZORPAY) */}
          {resourceLinks.length > 0 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Legal & Policies
              </h3>
              <ul className="space-y-3">
                {resourceLinks.map((link) => {
                  const isHash = link.path.startsWith("/#");
                  return (
                    <li key={link.name}>
                      {isHash ? (
                        <a
                          href={link.path}
                          className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-pink-400" />
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="relative">
                    Contact Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@smartnshine.app"
                  className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative">
                    support@smartnshine.app
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              {/* Hidden until connected to real data */}
              {/* <li>
                <a
                  href="https://discord.gg/smartnshine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative">
                    Join Our Community
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 lg:mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} SmartNShine. All rights reserved.
            </p>

            {/* Built with Love */}
            <p className="text-sm text-gray-400 flex items-center gap-2">
              Built with
              <span className="text-red-400 animate-pulse">❤️</span>
              for job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
