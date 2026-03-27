import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {User, CreditCard, Shield, ArrowRight, CheckCircle2} from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-14 space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 max-w-2xl">
            Manage your account details, subscription, and security settings.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 break-all">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-none">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400 mb-4">
              Account Snapshot
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                <span className="text-gray-600 dark:text-gray-400">Profile</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                <span className="text-gray-600 dark:text-gray-400">Subscription</span>
                <span className="font-semibold text-gray-900 dark:text-white">Managed</span>
              </div>
              <div className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                <span className="text-gray-600 dark:text-gray-400">Security</span>
                <span className="font-semibold text-gray-900 dark:text-white">Standard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="border-b border-gray-200 dark:border-white/10 px-3 sm:px-6">
            <nav className="flex gap-2 sm:gap-3 overflow-x-auto py-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white"
                        : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="min-h-[420px] p-6 sm:p-8">
            {activeTab === "subscription" && <SubscriptionDashboard embedded={true} />}

            {activeTab === "profile" && (
              <div>
                <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                  Profile Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-8">
                  Personal information synced from your account.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold tracking-[0.14em] uppercase text-gray-500 dark:text-gray-400 mb-2.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold tracking-[0.14em] uppercase text-gray-500 dark:text-gray-400 mb-2.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl p-4 sm:p-5">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Profile editing will be available in a future update.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                  Security Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light mb-8">
                  Password, multi-factor auth, and sign-in controls.
                </p>

                <div className="border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/70 dark:bg-yellow-950/20 rounded-2xl p-4 sm:p-5">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Security settings including password change and two-factor authentication will be available soon.
                  </p>
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
