import {useState, useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Server,
  Database,
  Cpu,
  Zap,
  Activity,
  History,
  Lock,
  Search,
  Sliders,
  LogOut,
  Sparkles,
  Mail,
  CreditCard,
  Radio,
  FileCode,
  Layers,
  Clock,
  ArrowUpRight,
  Loader2,
  HelpCircle,
  HardDrive,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getEnvVariables,
  updateEnvVariables,
  updateRawEnv,
  testApiKey,
  getEnvBackups,
  restoreEnvBackup,
  getSystemStatus,
  changeSuperAdminPassword,
  superAdminStorage,
} from "@/api/superAdmin.api";

export default function SuperAdminEnvPanel() {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rawSaving, setRawSaving] = useState(false);
  const [envData, setEnvData] = useState(null);
  const [variablesMap, setVariablesMap] = useState({});
  const [originalMap, setOriginalMap] = useState({});
  const [rawContent, setRawContent] = useState("");
  const [systemStatus, setSystemStatus] = useState(null);
  const [backups, setBackups] = useState([]);
  const [activeTab, setActiveTab] = useState("visual"); // 'visual' | 'raw' | 'diagnostics' | 'backups'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleValues, setVisibleValues] = useState({}); // { KEY: boolean }
  const [copiedKey, setCopiedKey] = useState(null);

  // Testing State
  const [testingService, setTestingService] = useState(null);
  const [testResults, setTestResults] = useState({});

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [newVarCategory, setNewVarCategory] = useState("Custom & Additional");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [envRes, sysRes, backupsRes] = await Promise.all([
        getEnvVariables(),
        getSystemStatus().catch(() => ({success: false, runtime: null})),
        getEnvBackups().catch(() => ({success: false, backups: []})),
      ]);

      if (envRes.success) {
        setEnvData(envRes);
        setRawContent(envRes.rawContent || "");

        // Build flat key-value map
        const map = {};
        envRes.variables.forEach((v) => {
          map[v.key] = v.value;
        });
        setVariablesMap(map);
        setOriginalMap({...map});
      }

      if (sysRes.success) {
        setSystemStatus(sysRes);
      }

      if (backupsRes.success) {
        setBackups(backupsRes.backups || []);
      }
    } catch (err) {
      console.error("Failed to load super admin data:", err);
      toast.error(err.response?.data?.error || "Failed to load environment data");
    } finally {
      setLoading(false);
    }
  };

  // Check dirty changes
  const modifiedCount = useMemo(() => {
    let count = 0;
    Object.keys(variablesMap).forEach((k) => {
      if (variablesMap[k] !== originalMap[k]) count++;
    });
    return count;
  }, [variablesMap, originalMap]);

  // Copy helper
  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast.success(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Toggle mask
  const toggleVisibility = (key) => {
    setVisibleValues((prev) => ({...prev, [key]: !prev[key]}));
  };

  // Update value in map
  const handleValueChange = (key, val) => {
    setVariablesMap((prev) => ({...prev, [key]: val}));
  };

  // Save all variables
  const handleSaveVariables = async () => {
    try {
      setSaving(true);
      const res = await updateEnvVariables(variablesMap);
      if (res.success) {
        toast.success("✅ Environment variables saved and hot-reloaded into runtime!");
        setOriginalMap({...variablesMap});
        // Refresh backups list
        const bRes = await getEnvBackups().catch(() => null);
        if (bRes?.backups) setBackups(bRes.backups);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save environment variables");
    } finally {
      setSaving(false);
    }
  };

  // Save raw content
  const handleSaveRaw = async () => {
    try {
      setRawSaving(true);
      const res = await updateRawEnv(rawContent);
      if (res.success) {
        toast.success("✅ Raw .env saved and hot-reloaded!");
        fetchAllData();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save raw .env");
    } finally {
      setRawSaving(false);
    }
  };

  // Add new variable
  const handleAddVariable = () => {
    const cleanKey = newVarKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    if (!cleanKey) {
      toast.error("Please provide a valid variable name");
      return;
    }

    setVariablesMap((prev) => ({...prev, [cleanKey]: newVarValue}));
    setShowAddModal(false);
    setNewVarKey("");
    setNewVarValue("");
    toast.success(`Added ${cleanKey}. Click 'Save All Changes' to apply.`);
  };

  // Delete variable
  const handleDeleteVariable = (key) => {
    if (confirm(`Are you sure you want to remove variable '${key}'?`)) {
      setVariablesMap((prev) => {
        const next = {...prev};
        delete next[key];
        return next;
      });
      toast.success(`Removed ${key}. Click 'Save All Changes' to apply.`);
    }
  };

  // 1-Click Key Testing
  const handleTestKey = async (service) => {
    try {
      setTestingService(service);
      let apiKey = null;
      let secondaryKey = null;

      if (service === "openai") apiKey = variablesMap["OPENAI_API_KEY"];
      if (service === "sarvam") apiKey = variablesMap["SARVAM_API_KEY"];
      if (service === "razorpay") {
        apiKey = variablesMap["RAZORPAY_KEY_ID"];
        secondaryKey = variablesMap["RAZORPAY_KEY_SECRET"];
      }
      if (service === "mongodb") apiKey = variablesMap["MONGODB_URI"];
      if (service === "smtp") {
        apiKey = variablesMap["EMAIL_USER"];
        secondaryKey = variablesMap["EMAIL_PASSWORD"];
      }

      const res = await testApiKey(service, apiKey, secondaryKey);
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: true,
          latencyMs: res.latencyMs,
          message: res.message,
          timestamp: new Date().toLocaleTimeString(),
          sampleOutput: res.sampleOutput,
        },
      }));
      toast.success(`⚡ ${service.toUpperCase()} test passed (${res.latencyMs}ms)!`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Test failed";
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: false,
          latencyMs: err.response?.data?.latencyMs,
          error: errMsg,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
      toast.error(`❌ ${service.toUpperCase()} test failed: ${errMsg}`);
    } finally {
      setTestingService(null);
    }
  };

  // Restore backup
  const handleRestoreBackup = async (filename) => {
    if (!confirm(`Restore .env to previous snapshot '${filename}'? Current state will be backed up.`)) {
      return;
    }

    try {
      const res = await restoreEnvBackup(filename);
      if (res.success) {
        toast.success(res.message);
        fetchAllData();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to restore backup");
    }
  };

  // Change master password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await changeSuperAdminPassword(newPassword, currentPassword);
      if (res.success) {
        toast.success("✅ Super Admin master password updated successfully!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Logout
  const handleLogout = () => {
    superAdminStorage.clearToken();
    toast.success("Logged out from Super Admin session");
    navigate("/super-admin/login");
  };

  // Filtered variables list
  const categoriesList = envData?.categories ? Object.keys(envData.categories) : [];
  const displayVariables = useMemo(() => {
    if (!envData?.variables) return [];

    return envData.variables.filter((v) => {
      const matchesSearch =
        v.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.label && v.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" || v.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [envData, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-zinc-950" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            Connecting to Super Admin Environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">
                  Super Admin • Environment Control
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {envData?.envPath || ".env on server"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 transition-all"
              title="Change master password"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Password</span>
            </button>

            <button
              onClick={fetchAllData}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 transition-all"
              title="Refresh values from disk"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleSaveVariables}
              disabled={saving || modifiedCount === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>
                {saving
                  ? "Saving to VPS..."
                  : modifiedCount > 0
                  ? `Save ${modifiedCount} Changes`
                  : "Saved"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* SYSTEM STATUS BANNER */}
        {systemStatus?.runtime && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono mb-1">
                <span>SERVER RUNTIME</span>
                <Server className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-white">
                Node {systemStatus.runtime.nodeVersion}
              </div>
              <div className="text-[10px] text-zinc-500 capitalize">
                {systemStatus.runtime.platform} • {systemStatus.runtime.arch}
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono mb-1">
                <span>HEAP MEMORY</span>
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-sm font-bold text-white">
                {systemStatus.memory?.heapUsedMb} MB / {systemStatus.memory?.heapTotalMb} MB
              </div>
              <div className="text-[10px] text-emerald-400">
                {systemStatus.memory?.heapUsagePercent}% active utilization
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono mb-1">
                <span>PROCESS UPTIME</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-sm font-bold text-white">
                {systemStatus.runtime.uptimeFormatted}
              </div>
              <div className="text-[10px] text-zinc-500">
                PID: {systemStatus.runtime.pid} • {systemStatus.runtime.nodeEnv}
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono mb-1">
                <span>MONGODB & BACKUPS</span>
                <Database className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    systemStatus.database?.connected
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                  }`}
                />
                <span>{systemStatus.database?.connected ? "Connected" : "Disconnected"}</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                {backups.length} automatic snapshots
              </div>
            </div>
          </div>
        )}

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === "visual"
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Key-Value Manager</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                {envData?.totalVariables || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === "diagnostics"
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>API Diagnostics Lab</span>
            </button>

            <button
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === "raw"
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw .env Editor</span>
            </button>

            <button
              onClick={() => setActiveTab("backups")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === "backups"
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Snapshots & Rollback ({backups.length})</span>
            </button>
          </div>

          {activeTab === "visual" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variable</span>
            </button>
          )}
        </div>

        {/* ==================================================== */}
        {/* TAB 1: VISUAL KEY-VALUE MANAGER */}
        {/* ==================================================== */}
        {activeTab === "visual" && (
          <div className="space-y-6">
            {/* Search & Category Filter Pills */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search API keys, secrets, hostnames, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === "all"
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  All Categories
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-zinc-700 text-white"
                        : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayVariables.map((v) => {
                const currentVal = variablesMap[v.key] ?? "";
                const isModified = currentVal !== originalMap[v.key];
                const isVisible = visibleValues[v.key];
                const isTested = testResults[v.testable];

                return (
                  <div
                    key={v.key}
                    className={`p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border transition-all relative ${
                      isModified
                        ? "border-amber-500/50 bg-amber-950/10 shadow-lg shadow-amber-500/5"
                        : "border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    {/* Header: Label, Category, and Tag */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {v.label || v.key}
                          </span>
                          {isModified && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                              MODIFIED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                          {v.key}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50 shrink-0">
                        {v.category}
                      </span>
                    </div>

                    {/* Description */}
                    {v.description && (
                      <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                        {v.description}
                      </p>
                    )}

                    {/* Input Field with Mask & Action Buttons */}
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={v.isSensitive && !isVisible ? "password" : "text"}
                          value={currentVal}
                          onChange={(e) => handleValueChange(v.key, e.target.value)}
                          placeholder={`Set ${v.key}...`}
                          className={`w-full pl-3.5 pr-20 py-2.5 bg-zinc-950 border rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                            isModified
                              ? "border-amber-500/50 bg-amber-950/20"
                              : "border-zinc-800 focus:border-emerald-500"
                          }`}
                        />

                        {/* Right inline tools inside input */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {v.isSensitive && (
                            <button
                              type="button"
                              onClick={() => toggleVisibility(v.key)}
                              aria-label={isVisible ? "Hide value" : "Reveal value"}
                              className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                              title={isVisible ? "Hide secret" : "Reveal secret"}
                            >
                              {isVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopy(v.key, currentVal)}
                            aria-label="Copy to clipboard"
                            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedKey === v.key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 1-Click Test Button for supported keys */}
                      {v.testable && (
                        <button
                          type="button"
                          onClick={() => handleTestKey(v.testable)}
                          disabled={testingService === v.testable || !currentVal}
                          className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-zinc-700 disabled:opacity-40"
                          title={`Test live connectivity with ${v.testable}`}
                        >
                          {testingService === v.testable ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span className="hidden sm:inline">Test</span>
                        </button>
                      )}

                      {/* Delete Custom Variable Button */}
                      {v.category === "Custom & Additional" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVariable(v.key)}
                          className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 transition-all"
                          title="Remove custom variable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Test result feedback badge */}
                    {v.testable && isTested && (
                      <div
                        className={`mt-2.5 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center justify-between gap-2 ${
                          isTested.success
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isTested.success ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          )}
                          <span className="truncate">
                            {isTested.success
                              ? isTested.message
                              : isTested.error}
                          </span>
                        </div>
                        {isTested.latencyMs && (
                          <span className="shrink-0 text-zinc-400">
                            {isTested.latencyMs}ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {displayVariables.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-bold">
                  No environment variables found matching &quot;{searchQuery}&quot;
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Try adjusting your search query or category filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: API KEY DIAGNOSTICS LAB */}
        {/* ==================================================== */}
        {activeTab === "diagnostics" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Live API & Service Diagnostic Laboratory
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Execute real test requests to verify if keys have active quota,
                correct format, and fast network latency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* OpenAI Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-teal-400" />
                      OpenAI GPT-4o
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      gpt-4o-mini
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Powers conversational AI interviews and feedback generation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    Key: {variablesMap["OPENAI_API_KEY"] ? `${variablesMap["OPENAI_API_KEY"].slice(0, 10)}...` : "NOT CONFIGURED"}
                  </div>

                  <button
                    onClick={() => handleTestKey("openai")}
                    disabled={testingService === "openai" || !variablesMap["OPENAI_API_KEY"]}
                    className="w-full py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-zinc-950 border border-teal-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "openai" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Run OpenAI Ping</span>
                  </button>

                  {testResults["openai"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["openai"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["openai"].success ? "PASSED" : "FAILED"}</span>
                        <span>{testResults["openai"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["openai"].message || testResults["openai"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sarvam AI Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-indigo-400" />
                      Sarvam AI Voice
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      Saaras & Bulbul
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Production voice synthesis & Indian multilingual transcription.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    Key: {variablesMap["SARVAM_API_KEY"] ? `${variablesMap["SARVAM_API_KEY"].slice(0, 10)}...` : "NOT CONFIGURED"}
                  </div>

                  <button
                    onClick={() => handleTestKey("sarvam")}
                    disabled={testingService === "sarvam" || !variablesMap["SARVAM_API_KEY"]}
                    className="w-full py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-zinc-950 border border-indigo-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "sarvam" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Run Sarvam AI Ping</span>
                  </button>

                  {testResults["sarvam"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["sarvam"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["sarvam"].success ? "PASSED" : "FAILED"}</span>
                        <span>{testResults["sarvam"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["sarvam"].message || testResults["sarvam"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Local Whisper STT Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      Local Whisper STT
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      port 5001
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Offline speech-to-text Python microservice running on localhost.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    URL: {variablesMap["VOICE_SERVICE_URL"] || "http://localhost:5001"}
                  </div>

                  <button
                    onClick={() => handleTestKey("whisper")}
                    disabled={testingService === "whisper"}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "whisper" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Ping Whisper Service</span>
                  </button>

                  {testResults["whisper"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["whisper"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["whisper"].success ? "ONLINE" : "OFFLINE"}</span>
                        <span>{testResults["whisper"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["whisper"].message || testResults["whisper"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Local Chatterbox TTS Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-400" />
                      Local Chatterbox TTS
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      port 5002
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Offline text-to-speech Python microservice running on localhost.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    URL: {variablesMap["CHATTERBOX_SERVICE_URL"] || "http://localhost:5002"}
                  </div>

                  <button
                    onClick={() => handleTestKey("chatterbox")}
                    disabled={testingService === "chatterbox"}
                    className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-zinc-950 border border-purple-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "chatterbox" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Ping Chatterbox Service</span>
                  </button>

                  {testResults["chatterbox"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["chatterbox"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["chatterbox"].success ? "ONLINE" : "OFFLINE"}</span>
                        <span>{testResults["chatterbox"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["chatterbox"].message || testResults["chatterbox"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Razorpay Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      Razorpay Gateway
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      Orders & Subscriptions
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Processes ₹9 one-time passes and monthly Pro upgrades.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    ID: {variablesMap["RAZORPAY_KEY_ID"] || "NOT CONFIGURED"}
                  </div>

                  <button
                    onClick={() => handleTestKey("razorpay")}
                    disabled={
                      testingService === "razorpay" ||
                      !variablesMap["RAZORPAY_KEY_ID"] ||
                      !variablesMap["RAZORPAY_KEY_SECRET"]
                    }
                    className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-zinc-950 border border-blue-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "razorpay" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Test Razorpay Auth</span>
                  </button>

                  {testResults["razorpay"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["razorpay"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["razorpay"].success ? "CONNECTED" : "FAILED"}</span>
                        <span>{testResults["razorpay"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["razorpay"].message || testResults["razorpay"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* MongoDB Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      MongoDB Database
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      Atlas Cluster
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Stores user profiles, resumes, templates, and interview logs.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    Status: {systemStatus?.database?.connected ? "CONNECTED" : "OFFLINE"}
                  </div>

                  <button
                    onClick={() => handleTestKey("mongodb")}
                    disabled={testingService === "mongodb"}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "mongodb" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Ping MongoDB Admin</span>
                  </button>

                  {testResults["mongodb"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["mongodb"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["mongodb"].success ? "PASSED" : "FAILED"}</span>
                        <span>{testResults["mongodb"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["mongodb"].message || testResults["mongodb"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email SMTP Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      Email / SMTP Host
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                      Nodemailer
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Sends OTP codes, payment receipts, and password resets.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
                    User: {variablesMap["EMAIL_USER"] || "NOT CONFIGURED"}
                  </div>

                  <button
                    onClick={() => handleTestKey("smtp")}
                    disabled={
                      testingService === "smtp" ||
                      !variablesMap["EMAIL_USER"] ||
                      !variablesMap["EMAIL_PASSWORD"]
                    }
                    className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {testingService === "smtp" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>Verify SMTP Credentials</span>
                  </button>

                  {testResults["smtp"] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-mono ${
                        testResults["smtp"].success
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{testResults["smtp"].success ? "VERIFIED" : "FAILED"}</span>
                        <span>{testResults["smtp"].latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-1 text-zinc-400">
                        {testResults["smtp"].message || testResults["smtp"].error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: RAW .ENV EDITOR */}
        {/* ==================================================== */}
        {activeTab === "raw" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  Direct Raw .env Code Editor
                </h2>
                <p className="text-xs text-zinc-400">
                  Direct text editor. Automatic backup will be created on save.
                </p>
              </div>

              <button
                onClick={handleSaveRaw}
                disabled={rawSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {rawSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{rawSaving ? "Saving..." : "Save Raw .env"}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono shadow-2xl">
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                rows={22}
                spellCheck={false}
                className="w-full bg-transparent text-emerald-400 text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-emerald-500 selection:text-black"
                placeholder="# Paste or type your .env configuration here..."
              />
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: SNAPSHOTS & ROLLBACK */}
        {/* ==================================================== */}
        {activeTab === "backups" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Historical .env Snapshots ({backups.length})
                </h2>
                <p className="text-xs text-zinc-400">
                  Every time you save or update keys, a safety snapshot is preserved
                  in <code className="text-emerald-400">server/backups/env-backups/</code>.
                </p>
              </div>
            </div>

            {backups.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <History className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-bold">No backups recorded yet</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Backups will be created automatically whenever you make changes.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 overflow-hidden">
                {backups.map((b) => (
                  <div
                    key={b.filename}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>{b.filename}</span>
                        <span className="text-[10px] text-zinc-500">
                          ({(b.sizeBytes / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>Created on {new Date(b.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestoreBackup(b.filename)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all shrink-0"
                    >
                      Restore Snapshot
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================== */}
      {/* MODAL: ADD CUSTOM VARIABLE */}
      {/* ==================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Environment Variable
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                  Variable Name / Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. CUSTOM_API_URL"
                  value={newVarKey}
                  onChange={(e) => setNewVarKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                  Variable Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://api.custom.com/v1"
                  value={newVarValue}
                  onChange={(e) => setNewVarValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVariable}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-all"
              >
                Add Variable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: CHANGE SUPER ADMIN MASTER PASSWORD */}
      {/* ==================================================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Change Master Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                  Current Master Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                  New Master Password (Min 8 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new master password..."
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs transition-all disabled:opacity-50"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
