import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Edit, Trash2, X, Save } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const queryClient = useQueryClient();

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm, page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/admin/users?search=${searchTerm}&page=${page}&limit=10`
      );
      return res.data;
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }) => {
      const res = await axiosInstance.put(`/admin/users/${userId}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      setEditingUser(null);
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      const res = await axiosInstance.post("/admin/delete-request", {
        userId,
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Delete request sent to super admin");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send delete request");
    },
  });

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  };

  const handleSave = () => {
    updateUserMutation.mutate({
      userId: editingUser,
      data: editForm,
    });
  };

  const handleDeleteRequest = (userId) => {
    const reason = prompt("Enter reason for deletion:");
    if (reason) {
      deleteRequestMutation.mutate({ userId, reason });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, phone, or user ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.users?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {editingUser === user._id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.workerType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X size={18} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.workerType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-[#FF6B35] hover:text-[#e55a2b] mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Page {data.currentPage} of {data.totalPages} ({data.total} total users)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

