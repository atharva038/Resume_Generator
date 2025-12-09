import {useNavigate} from "react-router-dom";
import {X, Sparkles, Crown, Zap} from "lucide-react";

/**
 * UpgradeRequiredModal - Shows when user needs to upgrade to access a feature
 */
const UpgradeRequiredModal = ({isOpen, onClose, message, title, feature}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {title || "Upgrade Required"}
                  </h2>
                  {feature && (
                    <p className="text-purple-100 text-sm mt-1">{feature}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {message ||
                "This feature is only available for Pro, Premium, and Lifetime subscribers. Upgrade your plan to unlock unlimited AI-powered features!"}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              What You'll Get with Pro:
            </h3>
            <ul className="space-y-2">
              {[
                "Unlimited AI-powered resume parsing",
                "AI content enhancement & suggestions",
                "Professional summary generation",
                "Skills categorization & optimization",
                "Advanced ATS analysis & scoring",
                "Priority customer support",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Upgrade Now
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Badge */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Secure payment • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeRequiredModal;
