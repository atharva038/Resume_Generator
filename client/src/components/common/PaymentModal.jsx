import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FaTimes, FaCreditCard, FaShieldAlt, FaLock} from "react-icons/fa";
import {
  createPaymentOrder,
  verifyPayment,
  getPricing,
} from "../../services/subscription.api";
import toast from "react-hot-toast";

/**
 * Payment Modal Component
 * Handles Razorpay checkout integration
 */
const PaymentModal = ({tier: propTier, plan: propPlan, onClose}) => {
  const navigate = useNavigate();

  // Use props if provided, otherwise fall back to route state for backwards compatibility
  const tier = propTier;
  const plan = propPlan;

  const [loading, setLoading] = useState(false);
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
      setLoading(true);

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
            setLoading(false);
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
        setLoading(false);
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.error || "Failed to initiate payment. Please try again."
      );
      setLoading(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose || (() => navigate("/pricing"))}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
          <div className="flex items-center mb-2">
            <FaCreditCard className="text-3xl mr-3" />
            <h2 className="text-2xl font-bold">Complete Payment</h2>
          </div>
          <p className="text-purple-100">Secure payment powered by Razorpay</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {tier.toUpperCase()} - {getPlanName()}
                </span>
              </div>
              {pricing && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                      {formatPrice(getAmount())}
                    </span>
                  </div>
                  {plan === "yearly" && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      Save 16% with yearly billing!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Features */}
          {pricing?.features && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What you'll get:
              </h3>
              <ul className="space-y-1">
                {pricing.features.slice(0, 5).map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                  >
                    <span className="text-green-500 dark:text-green-400 mr-2">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Info */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-6">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <FaShieldAlt className="mr-2" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-6">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all transform shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaLock className="mr-2" />
                Pay {formatPrice(getAmount())}
              </div>
            )}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose || (() => navigate("/pricing"))}
            className="w-full mt-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By completing this payment, you agree to our{" "}
            <a
              href="/terms"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-purple-600 dark:text-purple-400 hover:underline"
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
