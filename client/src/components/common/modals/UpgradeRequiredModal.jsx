import {useNavigate} from "react-router-dom";
import {X, Crown, CheckCircle2, Lock} from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm dark:bg-black/70 animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950 animate-slideUp">
        <div className="border-b border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-950 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-300">
                <Crown className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                  {title || "Upgrade Required"}
                </h2>
                {feature && (
                  <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {feature}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
              {message ||
                "This feature requires a Pro subscription to continue."}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-gray-950 dark:text-white">
              <Crown className="h-5 w-5 text-primary-600 dark:text-primary-300" />
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
                  className="flex items-start gap-3 text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600 dark:text-primary-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleUpgrade}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950"
            >
              <Crown className="h-5 w-5" />
              Upgrade Now
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15 dark:focus:ring-white/20 dark:focus:ring-offset-zinc-950"
            >
              Maybe Later
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Secure payment • Cancel anytime • 30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeRequiredModal;
