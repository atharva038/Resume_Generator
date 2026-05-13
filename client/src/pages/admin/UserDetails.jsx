import {useCallback, useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  History,
  Mail,
  RefreshCw,
  RotateCcw,
  Shield,
  Sparkles,
  User,
  UserCheck,
  UserX,
  Wallet,
} from "lucide-react";
import {
  getUserDetails,
  resetUserDailyQuota,
  resetUserExtractionCounter,
  updateUserRole,
  updateUserStatus,
} from "@/api/admin.api";
import {ConfirmationModal} from "@/components/common/modals";
import {parseValidationErrors} from "@/utils/errorHandler";

const tabs = [
  {id: "overview", label: "Overview", icon: User},
  {id: "usage", label: "Usage & Quotas", icon: BarChart3},
  {id: "ai", label: "AI Activity", icon: Brain},
  {id: "resumes", label: "Resumes", icon: FileText},
  {id: "interviews", label: "Interviews", icon: Sparkles},
  {id: "activity", label: "Activity", icon: History},
];

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const formatShortDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCost = (value) => `$${Number(value || 0).toFixed(4)}`;

const formatDuration = (seconds) => {
  const total = Number(seconds || 0);
  if (total <= 0) return "0m";
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const titleCase = (value) =>
  String(value || "unknown")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const statusVariant = (status) => {
  if (["active", "success", "completed"].includes(status)) return "success";
  if (["disabled", "error", "failed", "abandoned"].includes(status)) {
    return "danger";
  }
  if (["pending", "trial", "in-progress", "paused", "timeout"].includes(status)) {
    return "warning";
  }
  return "default";
};

const Badge = ({children, variant = "default"}) => {
  const variants = {
    default:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10",
    success:
      "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
    warning:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    primary:
      "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const InfoCard = ({label, value, icon: Icon, helper, tone = "cyan"}) => {
  const tones = {
    cyan: "from-cyan-500 to-blue-500 shadow-cyan-500/20",
    green: "from-green-500 to-emerald-500 shadow-green-500/20",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/20",
    violet: "from-violet-500 to-fuchsia-500 shadow-violet-500/20",
    rose: "from-rose-500 to-red-500 shadow-rose-500/20",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-black">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {helper && (
            <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-500">
              {helper}
            </p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

const Section = ({title, children, action}) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const EmptyState = ({icon: Icon = Activity, message}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-white/10">
    <Icon className="h-8 w-8 text-gray-400" />
    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

const QuotaBar = ({label, value}) => {
  const used = Number(value?.used || 0);
  const unlimited = value?.unlimited;
  const limit = Number(value?.limit || 0);
  const percentage = unlimited || !limit ? 0 : Math.min(100, (used / limit) * 100);

  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatNumber(used)} / {unlimited ? "Unlimited" : formatNumber(limit)}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{width: `${unlimited ? 100 : percentage}%`}}
        />
      </div>
      {value?.lastReset && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Last reset: {formatDate(value.lastReset)}
        </p>
      )}
    </div>
  );
};

const UserDetails = () => {
  const {userId} = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingAction, setPendingAction] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserDetails(userId);
      setDetails(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.response?.data?.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const user = details?.user;
  const subscription = details?.subscription?.current || user?.subscription || {};
  const aiTotals = details?.aiSummary?.totals || {};
  const usageLimits = details?.usageLimits || {};

  const overviewCounts = useMemo(
    () => ({
      resumes: details?.resumeSummary?.total || details?.resumes?.length || 0,
      aiCalls: aiTotals.calls || details?.aiUsage?.length || 0,
      interviews: details?.interviews?.summary?.total || 0,
      subscriptionTier: subscription?.tier || "free",
    }),
    [details, aiTotals.calls, subscription?.tier]
  );

  const runAction = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "status") {
        await updateUserStatus(userId, pendingAction.value);
      }
      if (pendingAction.type === "role") {
        await updateUserRole(userId, pendingAction.value);
      }
      if (pendingAction.type === "quota") {
        await resetUserDailyQuota(userId);
      }
      if (pendingAction.type === "extraction") {
        await resetUserExtractionCounter(userId);
      }

      toast.success(pendingAction.successMessage);
      setPendingAction(null);
      await fetchDetails();
    } catch (err) {
      toast.error(parseValidationErrors(err));
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500" />
          <p className="font-medium text-gray-500 dark:text-gray-400">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </button>
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-500">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const initials = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-bold text-white dark:bg-white dark:text-black">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <Badge variant={statusVariant(user.status)}>
                    {titleCase(user.status)}
                  </Badge>
                  <Badge variant="primary">{titleCase(user.role)}</Badge>
                  <Badge>{titleCase(subscription?.tier || "free")}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    {titleCase(user.provider || "local")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {formatShortDate(user.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Last login {formatShortDate(user.lastLogin)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setPendingAction({
                    type: "status",
                    value: user.status === "active" ? "disabled" : "active",
                    title:
                      user.status === "active" ? "Disable User" : "Enable User",
                    message: `This will ${
                      user.status === "active" ? "disable" : "enable"
                    } ${user.name}.`,
                    confirmText:
                      user.status === "active" ? "Disable User" : "Enable User",
                    successMessage: "User status updated",
                    icon: user.status === "active" ? UserX : UserCheck,
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
              >
                {user.status === "active" ? (
                  <UserX className="h-4 w-4 text-red-500" />
                ) : (
                  <UserCheck className="h-4 w-4 text-green-500" />
                )}
                {user.status === "active" ? "Disable" : "Enable"}
              </button>

              <select
                value={user.role}
                onChange={(event) =>
                  setPendingAction({
                    type: "role",
                    value: event.target.value,
                    title: "Change User Role",
                    message: `Change ${user.name}'s role to ${event.target.value}?`,
                    confirmText: "Change Role",
                    successMessage: "User role updated",
                    icon: Shield,
                  })
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-white/10 dark:bg-black dark:text-white"
              >
                <option value="user" className="bg-white dark:bg-[#1a1a1a]">
                  User
                </option>
                <option value="admin" className="bg-white dark:bg-[#1a1a1a]">
                  Admin
                </option>
              </select>

              <button
                onClick={() =>
                  setPendingAction({
                    type: "quota",
                    title: "Reset Usage Quotas",
                    message:
                      "This will reset the user's daily and monthly quota counters. Historical AI usage records are preserved for analytics.",
                    confirmText: "Reset Quotas",
                    successMessage: "Usage quotas reset",
                    icon: RotateCcw,
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Quotas
              </button>

              <button
                onClick={() =>
                  setPendingAction({
                    type: "extraction",
                    title: "Reset AI Extraction Counter",
                    message:
                      "This will reset today's AI resume extraction counter for this user.",
                    confirmText: "Reset Extraction",
                    successMessage: "AI extraction counter reset",
                    icon: RefreshCw,
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-500/20 dark:text-violet-300"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Extraction
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-black">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Resumes"
              value={formatNumber(overviewCounts.resumes)}
              icon={FileText}
              tone="cyan"
            />
            <InfoCard
              label="AI Calls"
              value={formatNumber(overviewCounts.aiCalls)}
              icon={Brain}
              helper={`${formatNumber(aiTotals.tokens)} tokens`}
              tone="violet"
            />
            <InfoCard
              label="Interviews"
              value={formatNumber(overviewCounts.interviews)}
              icon={Sparkles}
              tone="amber"
            />
            <InfoCard
              label="AI Cost"
              value={formatCost(aiTotals.cost)}
              icon={Wallet}
              tone="green"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Section title="Account Details">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Name" value={user.name} />
                <Detail label="Email" value={user.email} />
                <Detail label="Provider" value={titleCase(user.provider)} />
                <Detail label="Status" value={titleCase(user.status)} />
                <Detail label="Role" value={titleCase(user.role)} />
                <Detail label="Currency" value={user.preferences?.currency || "INR"} />
                <Detail label="Created" value={formatDate(user.createdAt)} />
                <Detail label="Updated" value={formatDate(user.updatedAt)} />
              </dl>
            </Section>

            <Section title="Subscription Snapshot">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Tier" value={titleCase(subscription?.tier || "free")} />
                <Detail
                  label="Plan"
                  value={subscription?.plan ? titleCase(subscription.plan) : "Not available"}
                />
                <Detail
                  label="Status"
                  value={titleCase(subscription?.status || "active")}
                />
                <Detail
                  label="Auto Renew"
                  value={subscription?.autoRenew ? "Enabled" : "Disabled"}
                />
                <Detail label="Start Date" value={formatDate(subscription?.startDate)} />
                <Detail label="End Date" value={formatDate(subscription?.endDate)} />
                <Detail label="Payment ID" value={subscription?.paymentId || "Not available"} />
                <Detail label="Order ID" value={subscription?.orderId || "Not available"} />
              </dl>
            </Section>
          </div>
        </div>
      )}

      {activeTab === "usage" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <QuotaBar label="Resumes Per Month" value={usageLimits.resumesPerMonth} />
            <QuotaBar
              label="Downloads Per Month"
              value={usageLimits.resumeDownloadsPerMonth}
            />
            <QuotaBar label="ATS Scans Per Month" value={usageLimits.atsScansPerMonth} />
            <QuotaBar label="Job Matches Per Day" value={usageLimits.jobMatchesPerDay} />
            <QuotaBar
              label="Cover Letters Per Month"
              value={usageLimits.coverLettersPerMonth}
            />
            <QuotaBar
              label="AI Generations Per Month"
              value={usageLimits.aiGenerationsPerMonth}
            />
            <QuotaBar
              label="AI Resume Extractions Per Day"
              value={usageLimits.aiResumeExtractionsPerDay}
            />
          </div>

          <Section
            title="Stored Counters"
            action={
              <Link
                to="/admin/ai-quota"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
              >
                Open AI quota page
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Object.entries(user.usage || {}).map(([key, value]) => (
                <Detail
                  key={key}
                  label={titleCase(key)}
                  value={key.toLowerCase().includes("date") || key.toLowerCase().includes("reset") ? formatDate(value) : formatNumber(value)}
                />
              ))}
            </div>
          </Section>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Total Calls" value={formatNumber(aiTotals.calls)} icon={Brain} tone="violet" />
            <InfoCard label="Successful" value={formatNumber(aiTotals.success)} icon={CheckCircle} tone="green" />
            <InfoCard label="Errors" value={formatNumber(aiTotals.errors)} icon={Activity} tone="rose" />
            <InfoCard label="Tokens" value={formatNumber(aiTotals.tokens)} icon={BarChart3} tone="cyan" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SummaryList title="By Feature" rows={details.aiSummary?.byFeature || []} />
            <SummaryList title="By Provider" rows={details.aiSummary?.byProvider || []} />
          </div>

          <Section title="Recent AI Requests">
            {details.aiUsage?.length ? (
              <ResponsiveTable
                headers={["Feature", "Provider", "Status", "Tokens", "Cost", "Created"]}
                rows={details.aiUsage.map((usage) => [
                  titleCase(usage.feature),
                  titleCase(usage.aiProvider),
                  <Badge key="status" variant={statusVariant(usage.status)}>
                    {titleCase(usage.status)}
                  </Badge>,
                  formatNumber(usage.tokensUsed),
                  formatCost(usage.cost),
                  formatDate(usage.createdAt),
                ])}
              />
            ) : (
              <EmptyState icon={Brain} message="No AI usage records for this user." />
            )}
          </Section>
        </div>
      )}

      {activeTab === "resumes" && (
        <Section title="Resume Summaries">
          {details.resumes?.length ? (
            <ResponsiveTable
              headers={["Title", "Resume Name", "Template", "Theme", "Created", "Updated"]}
              rows={details.resumes.map((resume) => [
                resume.resumeTitle || "Untitled Resume",
                resume.name || "Not available",
                titleCase(resume.templateId || "classic"),
                resume.colorTheme || "Default",
                formatDate(resume.createdAt),
                formatDate(resume.updatedAt),
              ])}
            />
          ) : (
            <EmptyState icon={FileText} message="No resumes created by this user." />
          )}
        </Section>
      )}

      {activeTab === "interviews" && (
        <Section title="Interview Sessions">
          {details.interviews?.sessions?.length ? (
            <ResponsiveTable
              headers={["Role", "Type", "Status", "Progress", "Score", "Duration", "Created"]}
              rows={details.interviews.sessions.map((session) => [
                session.role || "Not available",
                titleCase(session.interviewType),
                <Badge key="status" variant={statusVariant(session.status)}>
                  {titleCase(session.status)}
                </Badge>,
                `${session.progress || 0}%`,
                session.averageScore ? `${session.averageScore}%` : "Not scored",
                formatDuration(session.totalDurationSeconds),
                formatDate(session.createdAt),
              ])}
            />
          ) : (
            <EmptyState icon={Sparkles} message="No interview sessions for this user." />
          )}
        </Section>
      )}

      {activeTab === "activity" && (
        <div className="space-y-6">
          <Section title="Admin Activity">
            {details.activity?.length ? (
              <div className="space-y-3">
                {details.activity.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 p-4 dark:border-white/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {titleCase(item.action)} by{" "}
                          {item.adminId?.name || item.adminId?.email || "Unknown admin"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={History} message="No admin activity for this user yet." />
            )}
          </Section>

          <Section title="Subscription History">
            {details.subscription?.history?.length ? (
              <ResponsiveTable
                headers={["Tier", "Plan", "Status", "Amount", "Start", "End"]}
                rows={details.subscription.history.map((subscriptionRecord) => [
                  titleCase(subscriptionRecord.tier),
                  titleCase(subscriptionRecord.plan),
                  <Badge
                    key="status"
                    variant={statusVariant(subscriptionRecord.status)}
                  >
                    {titleCase(subscriptionRecord.status)}
                  </Badge>,
                  `${subscriptionRecord.currency || "INR"} ${formatNumber(subscriptionRecord.amount)}`,
                  formatDate(subscriptionRecord.startDate),
                  formatDate(subscriptionRecord.endDate),
                ])}
              />
            ) : (
              <EmptyState icon={Wallet} message="No subscription history for this user." />
            )}
          </Section>
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={runAction}
        title={pendingAction?.title || "Confirm Action"}
        message={pendingAction?.message || "Are you sure?"}
        confirmText={pendingAction?.confirmText || "Confirm"}
        cancelText="Cancel"
        type={pendingAction?.type === "status" && pendingAction?.value === "disabled" ? "danger" : "warning"}
        icon={pendingAction?.icon || Shield}
      />
    </div>
  );
};

const Detail = ({label, value}) => (
  <div className="min-w-0 rounded-lg bg-gray-50 p-3 dark:bg-white/5">
    <dt className="text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
      {label}
    </dt>
    <dd className="mt-1 break-words text-sm font-medium text-gray-900 dark:text-white">
      {value ?? "Not available"}
    </dd>
  </div>
);

const SummaryList = ({title, rows}) => (
  <Section title={title}>
    {rows.length ? (
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row._id || "unknown"}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-white/10"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {titleCase(row._id)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatNumber(row.totalTokens)} tokens
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatNumber(row.count)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCost(row.totalCost)}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState message={`No ${title.toLowerCase()} data available.`} />
    )}
  </Section>
);

const ResponsiveTable = ({headers, rows}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[720px] text-left">
      <thead>
        <tr className="border-b border-gray-200 dark:border-white/10">
          {headers.map((header) => (
            <th
              key={header}
              className="px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-white/5">
            {row.map((cell, cellIndex) => (
              <td
                key={`${rowIndex}-${cellIndex}`}
                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserDetails;
