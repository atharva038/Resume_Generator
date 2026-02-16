import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {User, CreditCard, Shield, ChevronRight} from "lucide-react";
import SubscriptionDashboard from "./SubscriptionDashboard";

/**
 * Profile Page Component
 * Displays user profile with tabs for different sections
 */
const Profile = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");

  const tabs = [
    {id: "subscription", label: "Subscription", icon: CreditCard},
    {id: "profile", label: "Profile Settings", icon: User},
    {id: "security", label: "Security", icon: Shield},
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account, subscription, and settings
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200/50 dark:border-white/10 p-6 sm:p-8 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {user?.name || "User"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200/50 dark:border-white/10">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                      transition-all duration-200 border-b-2 relative group
                      ${
                        activeTab === tab.id
                          ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-white/5"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "subscription" && (
              <div className="p-6 sm:p-8">
                <SubscriptionDashboard embedded={true} />
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Profile Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200/50 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200/50 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Profile editing will be available in a future update.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-800/30 rounded-xl p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Security settings including password change and
                        two-factor authentication will be available soon.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
