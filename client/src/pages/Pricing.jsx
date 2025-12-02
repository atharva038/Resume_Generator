import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  FaCheck,
  FaCrown,
  FaStar,
  FaRocket,
  FaGraduationCap,
  FaInfinity,
} from "react-icons/fa";
import {getPricing, getSubscriptionStatus} from "../services/subscription.api";
import PaymentModal from "../components/common/PaymentModal";
import toast from "react-hot-toast";

/**
 * Pricing Page Component
 * Displays all subscription tiers with features and pricing
 */
const Pricing = () => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);

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
      icon: <FaStar className="text-4xl text-gray-400 dark:text-gray-300" />,
      color: "gray",
      popular: false,
      bgGradient:
        "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
      borderColor: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    "one-time": {
      icon: <FaRocket className="text-4xl text-blue-500 dark:text-blue-400" />,
      color: "blue",
      popular: false,
      bgGradient:
        "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    pro: {
      icon: (
        <FaCrown className="text-4xl text-purple-500 dark:text-purple-400" />
      ),
      color: "purple",
      popular: true,
      bgGradient:
        "from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
      borderColor: "border-purple-300",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  };

  const handleSelectPlan = (tier, plan = "monthly") => {
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

    // Prevent Pro users from purchasing Pro again
    if (
      tier === "pro" &&
      currentSubscription?.tier === "pro" &&
      currentSubscription?.status === "active"
    ) {
      toast.error("You already have an active Pro subscription!");
      return;
    }

    // Open payment modal instead of navigating
    setPaymentData({tier, plan});
    setShowPaymentModal(true);
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

    // Pro has monthly/yearly options
    if (tier === "pro") {
      if (billingCycle === "yearly" && tierData.yearly) {
        const monthlyEquivalent = tierData.yearly.amount / 12;
        return (
          <>
            <span className="text-2xl">{formatPrice(monthlyEquivalent)}</span>
            <span className="text-base text-gray-600">/mo</span>
            <div className="text-sm text-green-600 mt-1">
              Billed {formatPrice(tierData.yearly.amount)}/year
            </div>
          </>
        );
      } else if (tierData.monthly) {
        return (
          <>
            <span className="text-2xl">
              {formatPrice(tierData.monthly.amount)}
            </span>
            <span className="text-base text-gray-600">/mo</span>
          </>
        );
      }
    }

    return formatPrice(tierData.amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading pricing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Get the perfect plan for your resume building needs
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === "yearly"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              Yearly
              <span className="ml-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          {pricing &&
            Object.entries(pricing).map(([tier, tierData]) => {
              const config = tierConfig[tier];
              if (!config) return null;

              const isPopular = config.popular;
              const showYearlyPrice =
                billingCycle === "yearly" && tier === "pro";

              return (
                <div
                  key={tier}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                    isPopular
                      ? "ring-4 ring-purple-400 dark:ring-purple-500"
                      : ""
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Card Header */}
                  <div
                    className={`bg-gradient-to-br ${config.bgGradient} p-6 text-center`}
                  >
                    <div className="mb-4 flex justify-center">
                      {config.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase mb-2">
                      {tier.replace("-", " ")}
                    </h3>
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                      {getDisplayPrice(tier, tierData)}
                    </div>
                    {tier === "one-time" && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        One-time payment
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="p-6">
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
                    <button
                      onClick={() =>
                        handleSelectPlan(
                          tier,
                          showYearlyPrice ? "yearly" : tierData.plan
                        )
                      }
                      className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
                        (tier === "free" &&
                          currentSubscription?.tier === "free") ||
                        (tier === "pro" &&
                          currentSubscription?.tier === "pro" &&
                          currentSubscription?.status === "active")
                          ? "bg-gray-400 cursor-not-allowed"
                          : config.buttonColor
                      }`}
                      disabled={
                        (tier === "free" &&
                          currentSubscription?.tier === "free") ||
                        (tier === "pro" &&
                          currentSubscription?.tier === "pro" &&
                          currentSubscription?.status === "active")
                      }
                    >
                      {tier === "free" && currentSubscription?.tier === "free"
                        ? "Current Plan"
                        : tier === "pro" &&
                          currentSubscription?.tier === "pro" &&
                          currentSubscription?.status === "active"
                        ? "Already Subscribed ✓"
                        : "Choose Plan"}
                    </button>

                    {/* Show message for Pro subscribers */}
                    {tier === "pro" &&
                      currentSubscription?.tier === "pro" &&
                      currentSubscription?.status === "active" && (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center justify-center">
                            <FaCrown className="mr-2" />
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Compare All Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
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
                    name: "Resumes per Month",
                    values: ["1", "1", "∞"],
                  },
                  {
                    name: "ATS Score Analysis",
                    values: ["✗", "1", "∞"],
                  },
                  {
                    name: "Job Matches per Day",
                    values: ["0", "3", "∞"],
                  },
                  {
                    name: "Cover Letters",
                    values: ["✗", "✗", "∞"],
                  },
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
                  {
                    name: "Advanced Analytics",
                    values: ["✗", "✗", "✓"],
                  },
                  {
                    name: "Priority Support",
                    values: ["✗", "✗", "✓"],
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-700 dark:text-gray-300">
                      {row.name}
                    </td>
                    {row.values.map((value, vIndex) => (
                      <td key={vIndex} className="py-4 px-4 text-center">
                        {value === "✓" ? (
                          <FaCheck className="text-green-500 dark:text-green-400 mx-auto" />
                        ) : value === "✗" ? (
                          <span className="text-gray-300 dark:text-gray-600">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
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
                unlimited job matches, advanced analytics, and priority support.
                It's the best value for serious job seekers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can cancel your subscription at any time from your
                dashboard. You'll continue to have access until the end of your
                billing period.
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need help choosing?{" "}
            <a
              href="/contact"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && paymentData && (
        <PaymentModal
          tier={paymentData.tier}
          plan={paymentData.plan}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentData(null);
          }}
        />
      )}
    </div>
  );
};

export default Pricing;
