import {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {
  Archive,
  Bell,
  Check,
  CheckCheck,
  CreditCard,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  archiveNotification,
  deleteNotification,
  getAdminNotificationStats,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/admin.api";
import {parseValidationErrors} from "@/utils/errorHandler";

const typeOptions = [
  {value: "", label: "All Types"},
  {value: "user", label: "Users"},
  {value: "ai", label: "AI"},
  {value: "payment", label: "Payments"},
  {value: "quota", label: "Quota"},
  {value: "system", label: "System"},
  {value: "contact", label: "Contact"},
  {value: "feedback", label: "Feedback"},
  {value: "security", label: "Security"},
];

const severityOptions = [
  {value: "", label: "All Severity"},
  {value: "info", label: "Info"},
  {value: "warning", label: "Warning"},
  {value: "error", label: "Error"},
  {value: "critical", label: "Critical"},
];

const statusOptions = [
  {value: "", label: "All Status"},
  {value: "unread", label: "Unread"},
  {value: "read", label: "Read"},
  {value: "archived", label: "Archived"},
];

const typeIcons = {
  user: UserPlus,
  ai: Sparkles,
  payment: CreditCard,
  quota: ShieldAlert,
  system: XCircle,
  contact: MessageSquare,
  feedback: MessageSquare,
  security: ShieldAlert,
};

const severityClasses = {
  info: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  error: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  critical:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const titleCase = (value) =>
  String(value || "unknown")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const StatCard = ({label, value, icon: Icon, tone}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          {value || 0}
        </p>
      </div>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    severity: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [notificationResponse, statsResponse] = await Promise.all([
        getAdminNotifications(filters),
        getAdminNotificationStats(),
      ]);
      setNotifications(notificationResponse.data.data.notifications);
      setPagination(notificationResponse.data.data.pagination);
      setStats(statsResponse.data.data);
    } catch (error) {
      toast.error(parseValidationErrors(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  };

  const runNotificationAction = async (action, id, successMessage) => {
    try {
      setActionLoading(id || action);
      if (action === "read") await markNotificationRead(id);
      if (action === "archive") await archiveNotification(id);
      if (action === "delete") await deleteNotification(id);
      if (action === "read-all") await markAllNotificationsRead();
      toast.success(successMessage);
      await fetchNotifications();
    } catch (error) {
      toast.error(parseValidationErrors(error));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
            <Bell className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">
              Admin Notifications
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notification Center
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track signups, failures, support messages, and platform alerts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchNotifications}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-black dark:text-gray-300 dark:hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() =>
              runNotificationAction(
                "read-all",
                null,
                "All notifications marked as read"
              )
            }
            disabled={actionLoading === "read-all"}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Unread"
          value={stats?.unread}
          icon={Bell}
          tone="bg-gradient-to-br from-cyan-500 to-blue-500"
        />
        <StatCard
          label="Critical"
          value={stats?.critical}
          icon={ShieldAlert}
          tone="bg-gradient-to-br from-rose-500 to-red-500"
        />
        <StatCard
          label="Errors"
          value={stats?.errors}
          icon={XCircle}
          tone="bg-gradient-to-br from-orange-500 to-red-500"
        />
        <StatCard
          label="Today"
          value={stats?.today}
          icon={Check}
          tone="bg-gradient-to-br from-green-500 to-emerald-500"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-black dark:text-white"
            />
          </div>

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 dark:border-white/10 dark:bg-black dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 dark:border-white/10 dark:bg-black dark:text-white"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.severity}
            onChange={(event) => updateFilter("severity", event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 dark:border-white/10 dark:bg-black dark:text-white"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-black">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-gray-400" />
            <p className="mt-3 font-medium text-gray-900 dark:text-white">
              No notifications found
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              New platform events will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              const isUnread = notification.status === "unread";

              return (
                <article
                  key={notification._id}
                  className={`p-5 transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                    isUnread ? "bg-cyan-500/[0.04]" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h2>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              severityClasses[notification.severity]
                            }`}
                          >
                            {titleCase(notification.severity)}
                          </span>
                          {isUnread && (
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-500">
                          <span>{titleCase(notification.type)}</span>
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.userId && (
                            <span>
                              {notification.userId.name} ({notification.userId.email})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                        >
                          View
                        </Link>
                      )}
                      {isUnread && (
                        <button
                          onClick={() =>
                            runNotificationAction(
                              "read",
                              notification._id,
                              "Notification marked as read"
                            )
                          }
                          disabled={actionLoading === notification._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-600 transition hover:bg-green-500/20 dark:text-green-400"
                        >
                          <Check className="h-4 w-4" />
                          Read
                        </button>
                      )}
                      {notification.status !== "archived" && (
                        <button
                          onClick={() =>
                            runNotificationAction(
                              "archive",
                              notification._id,
                              "Notification archived"
                            )
                          }
                          disabled={actionLoading === notification._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() =>
                          runNotificationAction(
                            "delete",
                            notification._id,
                            "Notification deleted"
                          )
                        }
                        disabled={actionLoading === notification._id}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-white/10">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page - 1,
                  }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 dark:border-white/10 dark:text-gray-300"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page + 1,
                  }))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 dark:border-white/10 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
