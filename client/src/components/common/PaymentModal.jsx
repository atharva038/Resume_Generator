import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  FaTimes,
  FaCreditCard,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import {Sparkles} from "lucide-react";
import {
  createPaymentOrder,
  verifyPayment,
  getPricing,
<<<<<<< HEAD
} from "../../services/subscription.api";
import toast from "react-hot-toast";
=======
} from "@/api/subscription.api";
import toast from "react-hot-toast";
import {useToggle} from "@/hooks";
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

/**
 * Payment Modal Component
 * Handles Razorpay checkout integration
 */
const PaymentModal = ({tier: propTier, plan: propPlan, onClose}) => {
  const navigate = useNavigate();

  // Use props if provided, otherwise fall back to route state for backwards compatibility
  const tier = propTier;
  const plan = propPlan;

<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
  const [loading, toggleLoading, setLoadingTrue, setLoadingFalse] =
    useToggle(false);
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
  const [pricing, setPricing] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!tier || !plan) {
      toast.error("Invalid payment request");
      if (onClose) {
        onClose();
      } else {
        navigate("/pricing");
      }
      return;
    }

    fetchPricingDetails();
  }, [tier, plan]);

  const fetchPricingDetails = async () => {
    try {
      const data = await getPricing();
      // Backend returns {success: true, pricing: {...}}
      const pricingData = data.pricing || data;
      setPricing(pricingData[tier]);
      console.log("Payment modal pricing:", pricingData[tier]);
    } catch (error) {
      toast.error("Failed to load pricing details");
      console.error("Pricing fetch error:", error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.getElementById("razorpay-checkout-js");
      if (script) {
        resolve(true);
        return;
      }

      const newScript = document.createElement("script");
      newScript.id = "razorpay-checkout-js";
      newScript.src = "https://checkout.razorpay.com/v1/checkout.js";
      newScript.onload = () => resolve(true);
      newScript.onerror = () => resolve(false);
      document.body.appendChild(newScript);
    });
  };

  const handlePayment = async () => {
    try {
<<<<<<< HEAD
      setLoading(true);
=======
      setLoadingTrue();
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        return;
      }

      // Create order
      const orderData = await createPaymentOrder(tier, plan);
      setOrderDetails(orderData);

      // Get user details
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ATS Resume Generator",
        description: `${tier.toUpperCase()} - ${plan} subscription`,
        order_id: orderData.order.orderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        notes: {
          tier,
          plan,
          userId: user._id || user.id,
        },
        theme: {
          color: "#9333EA", // Purple
        },
        modal: {
          ondismiss: () => {
<<<<<<< HEAD
            setLoading(false);
=======
            setLoadingFalse();
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            toast.info("Payment cancelled");
          },
        },
        handler: async (response) => {
          try {
            console.log("🎉 Razorpay payment success response:", response);
            console.log("🔍 Response keys:", Object.keys(response));
            console.log(
              "🔍 Full response JSON:",
              JSON.stringify(response, null, 2)
            );
            console.log("💼 Order details saved:", orderData);
            console.log(
              "💼 Order details JSON:",
              JSON.stringify(orderData, null, 2)
            );

            // Get the amount from orderDetails
            const paymentAmount =
              orderData?.order?.amount || getAmount(tier, plan, pricing);

            // Extract Razorpay response fields
            // For UPI payments, Razorpay only returns razorpay_payment_id
            // We need to use the orderId from our saved orderData
            const orderId =
              response.razorpay_order_id ||
              response.order_id ||
              orderData?.order?.orderId;
            const paymentId =
              response.razorpay_payment_id || response.payment_id;
            const signature =
              response.razorpay_signature ||
              response.signature ||
              "UPI_PAYMENT";

            console.log("🔍 Extracted fields:", {
              orderId,
              paymentId,
              signature,
              fromOrderData: orderData?.order?.orderId,
              orderDataKeys: orderData ? Object.keys(orderData) : "null",
              orderKeys: orderData?.order
                ? Object.keys(orderData.order)
                : "null",
            });

            // If signature is missing (common with UPI), we'll skip signature verification
            // and rely on Razorpay's payment verification API instead
            if (!signature || signature === "UPI_PAYMENT") {
              console.log(
                "⚠️ Signature missing (likely UPI payment). Using payment ID verification."
              );
            }

            // Verify payment
            const verifyData = {
              orderId: orderId,
              paymentId: paymentId,
              signature: signature,
              tier: tier,
              plan: plan,
              amount: paymentAmount,
            };

            console.log("Verifying payment with data:", verifyData);
            console.log("🔍 Verify data validation:", {
              hasOrderId: !!verifyData.orderId,
              hasPaymentId: !!verifyData.paymentId,
              hasSignature: !!verifyData.signature,
              hasTier: !!verifyData.tier,
              hasPlan: !!verifyData.plan,
              hasAmount: !!verifyData.amount,
            });

            const result = await verifyPayment(verifyData);

            // Update local user data
            if (result.user) {
              localStorage.setItem("user", JSON.stringify(result.user));
            }

            toast.success(
              "Payment successful! Your subscription is now active."
            );

            // Close modal and navigate to subscription dashboard
            if (onClose) {
              onClose();
            }

            // Always navigate to subscription page with success state
            navigate("/subscription", {
              state: {subscriptionActivated: true},
              replace: true,
            });
          } catch (error) {
            console.error("Payment verification error:", error);
            console.error(
              "Payment verification error details:",
              error.response?.data
            );
            console.error("Payment verification error message:", error.message);
            toast.error(
              error.response?.data?.message ||
                error.error ||
                "Payment verification failed. Please contact support."
            );
            navigate("/subscription");
          }
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        toast.error(
          `Payment failed: ${response.error.description || "Please try again"}`
        );
<<<<<<< HEAD
        setLoading(false);
=======
        setLoadingFalse();
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.error || "Failed to initiate payment. Please try again."
      );
<<<<<<< HEAD
      setLoading(false);
=======
      setLoadingFalse();
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAmount = () => {
    if (!pricing) return 0;

    // For tiers with simple amount field
    if (tier === "one-time") {
      return pricing.amount || 0;
    }

    // For pro tier with monthly/yearly options
    if (tier === "pro") {
      if (plan === "yearly" && pricing.yearly) {
        return pricing.yearly.amount || pricing.yearly || 0;
      }
      if (plan === "monthly" && pricing.monthly) {
        return pricing.monthly.amount || pricing.monthly || 0;
      }
    }

    return pricing.amount || 0;
  };

  const getPlanName = () => {
    if (tier === "one-time") return "One-Time";
    if (tier === "lifetime") return "Lifetime";
    if (plan === "monthly") return "Monthly";
    if (plan === "yearly") return "Yearly";
    return plan;
  };

  if (!tier || !plan) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900/90 dark:backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-[0_20px_70px_rgba(0,0,0,0.6)] max-w-lg w-full max-h-[90vh] overflow-y-auto border dark:border-white/10 transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 p-5 sticky top-0 z-10 backdrop-blur-xl">
          <button
            onClick={onClose || (() => navigate("/pricing"))}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaCreditCard className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complete Payment
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-zinc-800/50 dark:to-zinc-800/30 dark:backdrop-blur-xl rounded-xl p-4 mb-5 border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              Order Summary
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Plan:
                </span>
                <span className="font-semibold text-sm text-gray-900 dark:text-white bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border dark:border-white/10">
                  {tier.toUpperCase()} - {getPlanName()}
                </span>
              </div>
              {pricing && (
                <>
                  <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 dark:border-white/10">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Total Amount:
                    </span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {formatPrice(getAmount())}
                    </span>
                  </div>
                  {plan === "yearly" && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-700">
                      <Sparkles size={14} />
                      Save 16% with yearly billing!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Features */}
          {pricing?.features && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2 text-sm">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                What you'll get:
              </h3>
              <ul className="space-y-2">
                {pricing.features.slice(0, 4).map((feature, index) => (
                  <li
                    key={index}
                    className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 group"
                  >
                    <span className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0">
                      <FaCheckCircle size={14} />
                    </span>
                    <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Info */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/10 dark:backdrop-blur-xl border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <div className="w-7 h-7 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center mr-2">
                <FaShieldAlt size={14} />
              </div>
              <div>
                <span className="text-xs font-semibold block">
                  Secure Payment
                </span>
                <p className="text-[10px] text-blue-700 dark:text-blue-400">
                  Encrypted and secure
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all transform shadow-lg text-sm ${
              loading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-500 dark:via-pink-500 dark:to-purple-500 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:via-pink-600 dark:hover:to-purple-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl dark:hover:shadow-purple-500/30"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaLock className="text-xs" />
                <span>Pay {formatPrice(getAmount())}</span>
              </div>
            )}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose || (() => navigate("/pricing"))}
            className="w-full mt-2.5 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-zinc-800/50 dark:backdrop-blur-xl px-5 py-3 border-t border-gray-200 dark:border-white/10">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            By completing this payment, you agree to our{" "}
            <a
              href="/terms"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline font-medium transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline font-medium transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
