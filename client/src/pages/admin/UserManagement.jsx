import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  Shield,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "../../services/admin.api";
import {parseValidationErrors} from "../../utils/errorHandler";
import {ConfirmationModal} from "../../components/common/modals";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: null,
    loading: false,
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(filters);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      fetchUsers();
      toast.success(
        <div>
          <div className="font-semibold">Status Updated!</div>
          <div className="text-sm opacity-90">
            User {newStatus === "active" ? "activated" : "deactivated"}{" "}
            successfully
          </div>
        </div>,
        {
          icon: newStatus === "active" ? "✅" : "🚫",
          duration: 2500,
          style: {
            borderRadius: "12px",
          },
        }
      );
    } catch (err) {
      toast.error(
        <div>
          <div className="font-semibold">Failed to Update Status</div>
          <div className="text-sm opacity-90">{parseValidationErrors(err)}</div>
        </div>,
        {
          icon: "❌",
          duration: 4000,
          style: {
            borderRadius: "12px",
          },
        }
      );
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers();
      toast.success(
        <div>
          <div className="font-semibold">Role Updated!</div>
          <div className="text-sm opacity-90">
            User role changed to {newRole} successfully
          </div>
        </div>,
        {
          icon: "👤",
          duration: 2500,
          style: {
            borderRadius: "12px",
          },
        }
      );
    } catch (err) {
      toast.error(
        <div>
          <div className="font-semibold">Failed to Update Role</div>
          <div className="text-sm opacity-90">{parseValidationErrors(err)}</div>
        </div>,
        {
          icon: "❌",
          duration: 4000,
          style: {
            borderRadius: "12px",
          },
        }
      );
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Open confirmation modal
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
      loading: false,
    });
  };

  const confirmDeleteUser = async () => {
    const {userId, userName} = deleteModal;

    try {
      // Set loading state
      setDeleteModal((prev) => ({...prev, loading: true}));

      await deleteUser(userId);

      // Close modal
      setDeleteModal({
        isOpen: false,
        userId: null,
        userName: null,
        loading: false,
      });

      // Refresh users list
      fetchUsers();

      // Show success toast
      toast.success(
        <div>
          <div className="font-semibold">User Deleted Successfully!</div>
          <div className="text-sm opacity-90">
            {userName} has been removed from the system
          </div>
        </div>,
        {
          icon: "🗑️",
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        }
      );
    } catch (err) {
      // Keep modal open but remove loading state
      setDeleteModal((prev) => ({...prev, loading: false}));

      toast.error(
        <div>
          <div className="font-semibold">Failed to Delete User</div>
          <div className="text-sm opacity-90">{parseValidationErrors(err)}</div>
        </div>,
        {
          icon: "❌",
          duration: 4000,
          style: {
            borderRadius: "12px",
          },
        }
      );
    }
  };

  const closeDeleteModal = () => {
    if (!deleteModal.loading) {
      setDeleteModal({
        isOpen: false,
        userId: null,
        userName: null,
        loading: false,
      });
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({...prev, page: newPage}));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({...prev, role: e.target.value, page: 1}))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-500 dark:text-gray-400">
            No users found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                        <div>
                          {user.resumeCount || 0} resumes
                          <br />
                          {user.aiUsageCount || 0} AI calls
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(
                                user._id,
                                user.status === "active" ? "disabled" : "active"
                              )
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "active"
                                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            }`}
                            title={
                              user.status === "active" ? "Disable" : "Enable"
                            }
                          >
                            {user.status === "active" ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {(pagination.page - 1) * filters.limit + 1} to{" "}
                {Math.min(pagination.page * filters.limit, pagination.total)} of{" "}
                {pagination.total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={
          deleteModal.userName ? (
            <div className="space-y-3">
              <div className="text-base">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {deleteModal.userName}
                </span>
                ?
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                This will delete:
              </div>
              <ul className="text-sm text-left list-disc list-inside text-gray-600 dark:text-gray-600 dark:text-gray-400 space-y-1">
                <li>User account and profile</li>
                <li>All resumes created by this user</li>
                <li>AI usage history and records</li>
              </ul>
              <div className="text-sm font-semibold text-red-600 dark:text-red-400 mt-3">
                ⚠️ This action cannot be undone!
              </div>
            </div>
          ) : (
            "Are you sure you want to delete this user?"
          )
        }
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
        icon={Trash2}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default UserManagement;
