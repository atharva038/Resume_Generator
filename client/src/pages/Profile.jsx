import {useState} from "react";
<<<<<<< HEAD
import {useAuth} from "../context/AuthContext";
=======
import {useAuth} from "@/context/AuthContext";
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
import {FaUser, FaCreditCard, FaHistory, FaKey} from "react-icons/fa";
import SubscriptionDashboard from "./SubscriptionDashboard";

/**
 * Profile Page Component
 * Displays user profile with tabs for different sections
 */
const Profile = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");

  const tabs = [
    {id: "subscription", label: "Subscription", icon: FaCreditCard},
    {id: "profile", label: "Profile Settings", icon: FaUser},
    {id: "security", label: "Security", icon: FaKey},
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, subscription, and settings
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-zinc-800">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                      transition-all duration-200 border-b-2
                      ${
                        activeTab === tab.id
                          ? "border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-zinc-700"
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
              // Subscription Dashboard has its own styling, render with consistent padding
              <div className="p-6">
                <SubscriptionDashboard embedded={true} />
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
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
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Profile editing will be available in a future update.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Security settings including password change and two-factor
                      authentication will be available soon.
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
