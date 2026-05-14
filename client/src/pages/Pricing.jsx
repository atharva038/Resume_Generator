import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
  FaCheck,
  FaCrown,
  FaStar,
  FaRocket,
  FaLock,
  FaFileAlt,
} from "react-icons/fa";
import {getPricing, getSubscriptionStatus} from "@/api/subscription.api";
import {resumeAPI} from "@/api/api";
import PaymentModal from "@/components/common/PaymentModal";
import toast from "react-hot-toast";
import {useToggle} from "@/hooks";

/**
 * Pricing Page Component
 * Displays all subscription tiers with features and pricing
 */
const Pricing = () => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [
    showPaymentModal,
    ,
    setShowPaymentModalTrue,
    setShowPaymentModalFalse,
  ] = useToggle(false);
  const [paymentData, setPaymentData] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [resumeChooserOpen, setResumeChooserOpen] = useState(false);
  const [selectableResumes, setSelectableResumes] = useState([]);
  const [pendingOneTimePlan, setPendingOneTimePlan] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    fetchPricing();
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Not logged in, skip

      const response = await getSubscriptionStatus();
      setCurrentSubscription(response.subscription || null);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      // Don't show error to user, just continue without blocking
    }
  };

  const fetchPricing = async () => {
    try {
      const data = await getPricing();
      // Backend returns {success: true, pricing: {...}}
      setPricing(data.pricing || data);
      console.log("Pricing data loaded:", data);
    } catch (error) {
      toast.error("Failed to load pricing information");
      console.error("Pricing fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tier configurations with icons and highlights
  const tierConfig = {
    free: {
      icon: <FaStar className="text-4xl text-gray-600 dark:text-gray-300" />,
      color: "gray",
      popular: false,
      bgGradient: "bg-gray-50 dark:bg-zinc-900/30",
      borderColor: "border-gray-200 dark:border-white/10",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    "one-time": {
      icon: <FaRocket className="text-4xl text-blue-500 dark:text-blue-400" />,
      color: "blue",
      popular: false,
      bgGradient: "bg-blue-50 dark:bg-zinc-900/30",
      borderColor: "border-blue-200 dark:border-white/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    pro: {
      icon: (
        <FaCrown className="text-4xl text-indigo-500 dark:text-indigo-400" />
      ),
      color: "indigo",
      popular: true,
      bgGradient: "bg-indigo-50 dark:bg-zinc-900/30",
      borderColor: "border-indigo-200 dark:border-white/10",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    },
  };

  const handleSelectPlan = async (tier, plan = "monthly") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to subscribe");
      navigate("/login", {state: {from: "/pricing"}});
      return;
    }

    if (tier === "free") {
      toast.info("You are already on the free plan");
      return;
    }

    // Prevent users from purchasing their current active plan
    const isCurrentActivePlan =
      currentSubscription?.tier === tier &&
      tier === "pro" &&
      currentSubscription?.status === "active";

    if (isCurrentActivePlan) {
      toast.error(
        `You already have an active ${tier.replace("-", " ")} subscription!`
      );
      return;
    }

    if (tier === "one-time") {
      try {
        setLoadingResumes(true);
        const response = await resumeAPI.list();
        const resumes = response.data.resumes || [];

        if (resumes.length === 0) {
          toast.error("Create or upload a resume before buying one-time access");
          navigate("/upload");
          return;
        }

        setSelectableResumes(resumes);
        setPendingOneTimePlan({tier, plan});
        setResumeChooserOpen(true);
      } catch (error) {
        toast.error("Failed to load your resumes");
        console.error(error);
      } finally {
        setLoadingResumes(false);
      }
      return;
    }

    setPaymentData({tier, plan});
    setShowPaymentModalTrue();
  };

  const handleChooseResumeForOneTime = (resume) => {
    setResumeChooserOpen(false);
    setPaymentData({
      ...pendingOneTimePlan,
      resumeId: resume._id,
      resumeTitle: resume.resumeTitle || resume.name || "Untitled Resume",
    });
    setShowPaymentModalTrue();
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDisplayPrice = (tier, tierData) => {
    if (tier === "free") return "Free";
    if (tier === "one-time") return formatPrice(tierData.amount);

    // Pro has monthly pricing
    if (tier === "pro" && tierData.monthly) {
      return (
        <>
          <span className="text-2xl">
            {formatPrice(tierData.monthly.amount)}
          </span>
          <span className="text-base text-gray-600 dark:text-gray-400">
            /mo
          </span>
        </>
      );
    }

    return formatPrice(tierData.amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading pricing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags & Schema.org Structured Data */}
      <Helmet>
        <title>Pricing Plans - SmartNShine AI Resume Builder</title>
        <meta
          name="description"
          content="Choose from Free, One-Time, or Pro subscription plans. Build ATS-optimized resumes with AI assistance starting at ₹49 one-time or ₹199/month."
        />
        <meta
          name="keywords"
          content="resume builder pricing, ATS resume cost, subscription plans, resume builder plans, professional resume pricing"
        />
        <link rel="canonical" href="https://www.smartnshine.app/pricing" />

        {/* Schema.org Product/Service Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "SmartNShine Resume Builder",
            description:
              "AI-powered ATS resume builder with professional templates, job matching, and interview preparation",
            brand: {
              "@type": "Brand",
              name: "SmartNShine",
            },
            offers: [
              {
                "@type": "Offer",
                name: "Free Plan",
                price: "0",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                description:
                  "1 resume per month, 10 AI generations, and 1 AI resume extraction per day",
              },
              {
                "@type": "Offer",
                name: "One-Time Plan",
                price: "49",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                description:
                  "1 resume, 150 AI requests, 1 ATS scan, and 21-day access",
              },
              {
                "@type": "Offer",
                name: "Pro Subscription",
                price: "199",
                priceCurrency: "INR",
                priceValidUntil: "2026-12-31",
                availability: "https://schema.org/InStock",
                description:
                  "Unlimited everything! Priority support, advanced AI models, voice CV analysis",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "1250",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-14">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-14">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
              Pricing Plans
            </h1>
            <p className="text-lg sm:text-xl font-light text-gray-600 dark:text-gray-400">
              Choose the plan that fits your resume-building workflow.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {pricing &&
              Object.entries(pricing).map(([tier, tierData]) => {
                const config = tierConfig[tier];
                if (!config) return null;

                const isPopular = config.popular;
                const isCurrentPlan = currentSubscription?.tier === tier;
                const isActivePlan =
                  isCurrentPlan &&
                  (tier === "free" ||
                    (tier === "pro" &&
                      currentSubscription?.status === "active"));

                return (
                  <div
                    key={tier}
                    className={`relative bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-md ${
                      isPopular
                        ? "ring-2 ring-indigo-300 dark:ring-indigo-500"
                        : ""
                    }`}
                  >
                    {/* Current Plan Badge */}
                    {isActivePlan && (
                      <div className="absolute top-0 left-0 bg-green-600 text-white px-4 py-1 rounded-br-lg font-semibold text-sm z-10 flex items-center gap-1">
                        <FaCheck className="text-sm" />
                        CURRENT PLAN
                      </div>
                    )}

                    {/* Popular Badge */}
                    {isPopular && !isActivePlan && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                        MOST POPULAR
                      </div>
                    )}

                    {/* Card Header */}
                    <div
                      className={`${config.bgGradient} p-6 text-center border-b ${config.borderColor}`}
                    >
                      <div className="mb-4 flex justify-center">
                        {config.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase mb-2">
                        {tier.replace("-", " ")}
                      </h3>
                      <div className="text-4xl font-extrabold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                        {getDisplayPrice(tier, tierData)}
                      </div>
                      {tier === "one-time" && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          One-time payment
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="p-6 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                      <ul className="space-y-3 mb-6">
                        {tierData.features?.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {tier === "pro" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            onClick={() => handleSelectPlan(tier, "monthly")}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${
                              isActivePlan
                                ? "bg-gray-400 dark:bg-zinc-700 cursor-not-allowed"
                                : config.buttonColor
                            }`}
                            disabled={isActivePlan}
                          >
                            {isActivePlan ? "Current Plan ✓" : "Monthly"}
                          </button>
                          <button
                            onClick={() => handleSelectPlan(tier, "yearly")}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${
                              isActivePlan
                                ? "bg-gray-400 dark:bg-zinc-700 cursor-not-allowed"
                                : "bg-purple-700 hover:bg-purple-800"
                            }`}
                            disabled={isActivePlan}
                          >
                            {isActivePlan ? "Current Plan ✓" : "Yearly"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectPlan(tier, tierData.plan)}
                          className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${
                            isActivePlan
                              ? "bg-gray-400 dark:bg-zinc-700 cursor-not-allowed"
                              : config.buttonColor
                          }`}
                          disabled={isActivePlan}
                        >
                          {isActivePlan
                            ? "Current Plan ✓"
                            : tier === "free"
                              ? "Get Started Free"
                              : "Choose Plan"}
                        </button>
                      )}

                      {/* Show message for active subscribers */}
                      {isActivePlan && tier !== "free" && (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center">
                            <FaCheck className="mr-2" />
                            You're on our best plan!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-white/10 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Compare All Features
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-white/10">
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Feature
                    </th>
                    <th className="py-4 px-4 text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Free
                    </th>
                    <th className="py-4 px-4 text-center text-gray-700 dark:text-gray-300 font-semibold">
                      One-Time
                    </th>
                    <th className="py-4 px-4 text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "AI Requests",
                      values: ["10/month", "150/21 days", "∞"],
                    },
                    {
                      name: "Resumes per Month",
                      values: ["1", "1", "∞"],
                    },
                    {
                      name: "ATS Score Analysis",
                      values: ["✗", "1", "∞"],
                    },
                    // TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE
                    // {
                    //   name: "Job Matches per Day",
                    //   values: ["0", "3", "∞"],
                    // },
                    // TEMPORARILY HIDDEN - Cover Letters feature not yet implemented
                    // {
                    //   name: "Cover Letters",
                    //   values: ["✗", "✗", "∞"],
                    // },
                    {
                      name: "AI Model",
                      values: ["Gemini", "GPT-4o", "GPT-4o"],
                    },
                    {
                      name: "AI Resume Extraction",
                      values: ["✗", "✗", "2/day"],
                    },
                    {
                      name: "All Templates",
                      values: ["✗", "✓", "✓"],
                    },
                    {
                      name: "Portfolio Builder",
                      values: ["✗", "✗", "✓"],
                    },
                    // TEMPORARILY HIDDEN - Analytics feature to be enabled later
                    // {
                    //   name: "Advanced Analytics",
                    //   values: ["✗", "✗", "✓"],
                    // },
                    {
                      name: "Priority Support",
                      values: ["✗", "✗", "✓"],
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <td className="py-4 px-4 font-medium text-gray-700 dark:text-gray-300">
                        {row.name}
                      </td>
                      {row.values.map((value, vIndex) => (
                        <td key={vIndex} className="py-4 px-4 text-center">
                          {value === "✓" ? (
                            <FaCheck className="text-green-500 dark:text-green-400 mx-auto" />
                          ) : value === "✗" ? (
                            <span className="text-gray-400 dark:text-gray-600">
                              ✗
                            </span>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-black rounded-3xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What's special about the Pro plan?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pro plan gives you unlimited access to everything - unlimited
                  resumes, GPT-4o AI (premium quality), unlimited ATS scans,
                  {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE */}
                  {/* unlimited job matches, */}
                  {/* TEMPORARILY HIDDEN - Analytics feature */}
                  {/* advanced analytics, and */}
                  and priority support. It's the best value for serious job
                  seekers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can cancel your subscription at any time from your
                  dashboard. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Is there a refund policy?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 7-day money-back guarantee for all paid plans. If
                  you're not satisfied, contact us for a full refund.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit/debit cards, UPI, net banking, and
                  wallets through Razorpay.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-4">
              Need help choosing?{" "}
              <a
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>

        {resumeChooserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950">
              <div className="border-b border-gray-200 p-5 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                      Choose Resume to Unlock
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      One-time access applies to one resume for 21 days.
                    </p>
                  </div>
                  <button
                    onClick={() => setResumeChooserOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
                {loadingResumes ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Loading resumes...
                  </p>
                ) : (
                  selectableResumes.map((resume) => {
                    const isLocked = resume.access?.upgradeRequired;
                    return (
                      <button
                        key={resume._id}
                        onClick={() => handleChooseResumeForOneTime(resume)}
                        className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-primary-400/50 dark:hover:bg-primary-500/10"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                          {isLocked ? <FaLock /> : <FaFileAlt />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold text-gray-950 dark:text-white">
                              {resume.resumeTitle || resume.name || "Untitled Resume"}
                            </p>
                            {isLocked && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                                Locked
                              </span>
                            )}
                          </div>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            Updated{" "}
                            {new Date(resume.updatedAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && paymentData && (
          <PaymentModal
            tier={paymentData.tier}
            plan={paymentData.plan}
            resumeId={paymentData.resumeId}
            resumeTitle={paymentData.resumeTitle}
            onClose={() => {
              setShowPaymentModalFalse();
              setPaymentData(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Pricing;
