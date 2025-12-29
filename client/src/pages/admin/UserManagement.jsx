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
} from "@/api/admin.api";
import {parseValidationErrors} from "@/utils/errorHandler";
import {ConfirmationModal} from "@/components/common/modals";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-3">
            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">
              User Management
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all"
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
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
            >
              <option value="" className="bg-[#1a1a1a]">
                All Roles
              </option>
              <option value="user" className="bg-[#1a1a1a]">
                User
              </option>
              <option value="admin" className="bg-[#1a1a1a]">
                Admin
              </option>
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
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
            >
              <option value="" className="bg-[#1a1a1a]">
                All Status
              </option>
              <option value="active" className="bg-[#1a1a1a]">
                Active
              </option>
              <option value="disabled" className="bg-[#1a1a1a]">
                Disabled
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                        >
                          <option value="user" className="bg-[#1a1a1a]">
                            User
                          </option>
                          <option value="admin" className="bg-[#1a1a1a]">
                            Admin
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            user.status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400">
                              {user.resumeCount || 0}
                            </span>{" "}
                            resumes
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400">
                              {user.aiUsageCount || 0}
                            </span>{" "}
                            AI calls
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
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
                            className={`p-2 rounded-lg transition-all ${
                              user.status === "active"
                                ? "text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                                : "text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20"
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
                            className="p-2 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
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
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
              <div className="text-sm text-gray-400">
                Showing {(pagination.page - 1) * filters.limit + 1} to{" "}
                {Math.min(pagination.page * filters.limit, pagination.total)} of{" "}
                {pagination.total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <span className="text-sm text-gray-300 px-3">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
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
