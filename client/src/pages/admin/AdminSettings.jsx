import {useState, useEffect} from "react";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Server,
  Shield,
  Zap,
  Mail,
  Database,
  Users,
  TrendingUp,
  Clock,
  HardDrive,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getSettings,
  updateSettings,
  resetSettings,
  getSystemStats,
  updateAIQuotaLimits,
  toggleFeature,
  updateRateLimits,
} from "../../services/admin.api";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, statsRes] = await Promise.all([
        getSettings(),
        getSystemStats(),
      ]);
      setSettings(settingsRes.data.settings);
      setSystemStats(statsRes.data.stats);
      setError(null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSettings(settings);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all settings to defaults?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await resetSettings();
      setSuccess("Settings reset to defaults successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeature = async (feature) => {
    try {
      const newValue = !settings.features[feature];
      await toggleFeature(feature, newValue);
      setSettings({
        ...settings,
        features: {...settings.features, [feature]: newValue},
      });
      setSuccess(`Feature '${feature}' ${newValue ? "enabled" : "disabled"}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to toggle feature");
    }
  };

  const handleUpdateAIQuota = async (tier) => {
    try {
      setSaving(true);
      await updateAIQuotaLimits({
        tier,
        daily: settings.aiQuota[tier].daily,
        monthly: settings.aiQuota[tier].monthly,
      });
      setSuccess(`AI quota limits updated for ${tier} tier`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update AI quota");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRateLimit = async (category) => {
    try {
      setSaving(true);
      await updateRateLimits({
        category,
        windowMs: settings.rateLimits[category].windowMs,
        max: settings.rateLimits[category].max,
      });
      setSuccess(`Rate limits updated for ${category}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update rate limits");
    } finally {
      setSaving(false);
    }
  };

  const updateSettingValue = (path, value) => {
    const keys = path.split(".");
    const newSettings = {...settings};
    let current = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const tabs = [
    {id: "general", label: "General", icon: SettingsIcon},
    {id: "ai", label: "AI Quotas", icon: Zap},
    {id: "features", label: "Features", icon: ToggleRight},
    {id: "security", label: "Security", icon: Shield},
    {id: "rate-limits", label: "Rate Limits", icon: TrendingUp},
    {id: "storage", label: "Storage", icon: Database},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleResetSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-gray-900 dark:text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-gray-900 dark:text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* System Stats */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-1">
                  {systemStats.users.active}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 mt-1">
                  of {systemStats.users.total} total
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI Usage Today
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-1">
                  {systemStats.ai.todayUsage}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 mt-1">
                  {systemStats.ai.totalUsage} total
                </p>
              </div>
              <Zap className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-1">
                  {systemStats.ai.avgResponseTime}ms
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-1">
                  {systemStats.storage.used} MB
                </p>
              </div>
              <HardDrive className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <SettingsIcon className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
            Settings Management
          </h3>
          <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-6">
            Configure system-wide settings and preferences
          </p>
          {settings && (
            <div className="text-left max-w-2xl mx-auto space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                  General Settings
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Site: {settings.siteName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: {settings.contactEmail}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                  AI Quotas
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Free: {settings.aiQuota.free.daily} daily,{" "}
                  {settings.aiQuota.free.monthly} monthly
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium: {settings.aiQuota.premium.daily} daily,{" "}
                  {settings.aiQuota.premium.monthly} monthly
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                  Features
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>Note:</strong> Full settings editor with tabs coming
                  soon. Current display shows read-only values.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
