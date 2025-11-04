import {X, AlertTriangle, Trash2, UserX, CheckCircle} from "lucide-react";

/**
 * Reusable Confirmation Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {function} onConfirm - Function to call when confirmed
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} type - Type of action: "danger", "warning", "success" (default: "danger")
 * @param {React.Component} icon - Custom icon component (optional)
 * @param {boolean} loading - Show loading state on confirm button
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  icon: CustomIcon,
  loading = false,
}) => {
  if (!isOpen) return null;

  // Determine colors and icon based on type
  const config = {
    danger: {
      bgColor: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      buttonBg: "bg-red-600 hover:bg-red-700",
      buttonDisabledBg: "bg-red-400",
      Icon: CustomIcon || Trash2,
    },
    warning: {
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      buttonDisabledBg: "bg-yellow-400",
      Icon: CustomIcon || AlertTriangle,
    },
    success: {
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      buttonBg: "bg-green-600 hover:bg-green-700",
      buttonDisabledBg: "bg-green-400",
      Icon: CustomIcon || CheckCircle,
    },
  };

  const {bgColor, iconColor, buttonBg, buttonDisabledBg, Icon} =
    config[type] || config.danger;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div
            className={`${bgColor} rounded-full p-4 mb-4 animate-bounce-once`}
          >
            <Icon className={`w-12 h-12 ${iconColor}`} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>

          {/* Message */}
          <div className="text-center text-gray-600 dark:text-gray-400 px-6 mb-6">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none ${
              loading ? buttonDisabledBg : buttonBg
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>

      {/* Add custom animations using regular style tag */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce-once {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
