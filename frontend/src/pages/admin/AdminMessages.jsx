import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, CheckCircle, Mail, Phone, User } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminMessages = () => {
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/contacts");
      return res.data;
    },
  });

  // Resolve contact mutation
  const resolveContactMutation = useMutation({
    mutationFn: async (contactId) => {
      const res = await axiosInstance.put(`/admin/contacts/${contactId}/resolve`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact marked as resolved");
      queryClient.invalidateQueries(["admin-contacts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to resolve contact");
    },
  });

  const handleResolve = (contactId) => {
    resolveContactMutation.mutate(contactId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const unresolvedContacts = contactsData?.contacts?.filter(c => !c.isResolved) || [];
  const resolvedContacts = contactsData?.contacts?.filter(c => c.isResolved) || [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-[#FF6B35]" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Messages</h3>
          <p className="text-3xl font-bold text-gray-900">{contactsData?.contacts?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Unresolved</h3>
          <p className="text-3xl font-bold text-orange-600">{unresolvedContacts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">{resolvedContacts.length}</p>
        </div>
      </div>

      {/* Unresolved Messages */}
      {unresolvedContacts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Unresolved Messages</h2>
          <div className="space-y-4">
            {unresolvedContacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={18} className="text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={16} />
                        <span>{contact.phoneNumber}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{contact.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Received: {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleResolve(contact._id)}
                    className="ml-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <CheckCircle size={18} />
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved Messages */}
      {resolvedContacts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resolved Messages</h2>
          <div className="space-y-4">
            {resolvedContacts.map((contact) => (
              <div key={contact._id} className="bg-gray-50 rounded-lg shadow p-6 border-l-4 border-green-500 opacity-75">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={18} className="text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Resolved
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={16} />
                        <span>{contact.phoneNumber}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{contact.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Received: {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contactsData?.contacts?.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-600">No messages yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

