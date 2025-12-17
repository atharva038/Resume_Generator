import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  Shield,
  RefreshCw,
  ArrowLeft,
  Mail,
} from "lucide-react";

const RateLimitExceeded = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState(15); // 15 minutes in minutes
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Get error details from location state
  const errorDetails = location.state?.errorDetails || {
    retryAfter: "15 minutes",
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  };

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else if (timeRemaining > 0) {
          setTimeRemaining((t) => t - 1);
          return 59;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleGoBack = () => {
    navigate("/login");
  };

  const handleContactSupport = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-950 dark:to-orange-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Rate Limit Exceeded
            </h1>
            <p className="text-red-100 text-lg">
              Too many login attempts detected
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Main Message */}
            <div className="mb-8">
              <div className="flex items-start gap-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                    Security Protection Activated
                  </h2>
                  <p className="text-gray-700 dark:text-gray-700 dark:text-gray-300 mb-2">
                    {errorDetails.message}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This is a security measure to protect your account from
                    unauthorized access attempts.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-6 text-center">
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                  Please Wait
                </h3>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                      {timeRemaining}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minutes
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-400">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                      {secondsRemaining.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      seconds
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can try logging in again after this time
                </p>
              </div>
            </div>

            {/* What You Can Do */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
                What you can do:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Wait for the timer to expire
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The restriction will automatically lift after{" "}
                      {errorDetails.retryAfter || "15 minutes"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Double-check your credentials
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Make sure you're using the correct email and password
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Reset your password if needed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      If you've forgotten your password, use the "Forgot
                      Password" option when you return
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGoBack}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Login
              </button>

              <button
                onClick={handleContactSupport}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                💡 <strong>Tip:</strong> If you're having trouble logging in,
                try resetting your password or contact our support team for
                assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This security measure helps protect your account and our platform
            from unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitExceeded;
