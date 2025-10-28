import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDeleteRequests = () => {
  const queryClient = useQueryClient();

  // Fetch delete requests
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["admin-delete-requests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/delete-requests");
      return res.data;
    },
  });

  // Process delete request mutation
  const processRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }) => {
      const res = await axiosInstance.post("/admin/process-delete-request", {
        requestId,
        action,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.action === "approve"
          ? "Delete request approved and user deleted"
          : "Delete request rejected"
      );
      queryClient.invalidateQueries(["admin-delete-requests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to process request");
    },
  });

  const handleApprove = (requestId) => {
    if (window.confirm("Are you sure you want to approve this delete request? This action cannot be undone.")) {
      processRequestMutation.mutate({ requestId, action: "approve" });
    }
  };

  const handleReject = (requestId) => {
    if (window.confirm("Are you sure you want to reject this delete request?")) {
      processRequestMutation.mutate({ requestId, action: "reject" });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const pendingRequests = requestsData?.deleteRequests?.filter(r => r.status === "pending") || [];
  const processedRequests = requestsData?.deleteRequests?.filter(r => r.status !== "pending") || [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="text-[#FF6B35]" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Delete Requests</h1>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Super Admin Only:</strong> Review and approve/reject user deletion requests from admins.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{requestsData?.deleteRequests?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Processed</h3>
          <p className="text-3xl font-bold text-green-600">{processedRequests.length}</p>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      User ID: {request.userId?.userId || "N/A"}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Name:</strong> {request.userId?.fullName || "N/A"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> {request.userId?.email || "N/A"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Phone:</strong> {request.userId?.phoneNumber || "N/A"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Requested by:</strong> Admin (Phone: {request.requestedBy?.phoneNumber || "N/A"})
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Requested: {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={processRequestMutation.isPending}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={processRequestMutation.isPending}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Processed Requests</h2>
          <div className="space-y-4">
            {processedRequests.map((request) => (
              <div
                key={request._id}
                className={`bg-gray-50 rounded-lg shadow p-6 border-l-4 ${
                  request.status === "approved" ? "border-green-500" : "border-red-500"
                } opacity-75`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        User ID: {request.userId?.userId || "Deleted"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      Processed: {new Date(request.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requestsData?.deleteRequests?.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Trash2 className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-600">No delete requests yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminDeleteRequests;

