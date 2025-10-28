import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  MessageSquare,
  Trash2,
  LogOut,
  Menu,
  X,
  Receipt
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import LoadingSpinner from "../components/LoadingSpinner";

// Import section components
import AdminUsers from "./admin/AdminUsers";
import AdminAddWorker from "./admin/AdminAddWorker";
import AdminAddAdmin from "./admin/AdminAddAdmin";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminMessages from "./admin/AdminMessages";
import AdminDeleteRequests from "./admin/AdminDeleteRequests";
import AdminTransactions from "./admin/AdminTransactions";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const isSuperAdmin = user?.role === "superadmin";

  // Fetch analytics summary
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/analytics?days=30");
      return res.data;
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "View Users", icon: Users },
    { id: "add-worker", label: "Add Worker", icon: UserPlus },
    ...(isSuperAdmin ? [{ id: "add-admin", label: "Add Admin", icon: UserPlus }] : []),
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "transactions", label: "Transaction History", icon: Receipt },
    { id: "messages", label: "Messages", icon: MessageSquare },
    ...(isSuperAdmin ? [{ id: "delete-requests", label: "Delete Requests", icon: Trash2 }] : []),
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome, {user?.fullName || "Admin"}
            </h1>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF6B35]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsData?.summary?.totalUsers || 0}
                      </p>
                    </div>
                    <div className="bg-[#FF6B35] bg-opacity-10 p-3 rounded-lg">
                      <Users className="text-[#FF6B35]" size={32} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Contacts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsData?.summary?.totalContacts || 0}
                      </p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-10 p-3 rounded-lg">
                      <MessageSquare className="text-blue-500" size={32} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Unresolved Contacts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsData?.summary?.unresolvedContacts || 0}
                      </p>
                    </div>
                    <div className="bg-green-500 bg-opacity-10 p-3 rounded-lg">
                      <BarChart3 className="text-green-500" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection("users")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                >
                  <Users className="text-[#FF6B35] mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">View All Users</h3>
                  <p className="text-sm text-gray-600">Manage and search users</p>
                </button>

                <button
                  onClick={() => setActiveSection("add-worker")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                >
                  <UserPlus className="text-[#FF6B35] mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Add New Worker</h3>
                  <p className="text-sm text-gray-600">Register a new member</p>
                </button>

                <button
                  onClick={() => setActiveSection("analytics")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                >
                  <BarChart3 className="text-[#FF6B35] mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Registration trends & stats</p>
                </button>

                <button
                  onClick={() => setActiveSection("transactions")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                >
                  <Receipt className="text-[#FF6B35] mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Transaction History</h3>
                  <p className="text-sm text-gray-600">View all payments</p>
                </button>

                <button
                  onClick={() => setActiveSection("messages")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                >
                  <MessageSquare className="text-[#FF6B35] mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">View Messages</h3>
                  <p className="text-sm text-gray-600">Contact form submissions</p>
                </button>

                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => setActiveSection("add-admin")}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                    >
                      <UserPlus className="text-[#FF6B35] mb-2" size={24} />
                      <h3 className="font-semibold text-gray-900">Add Admin</h3>
                      <p className="text-sm text-gray-600">Create new admin account</p>
                    </button>

                    <button
                      onClick={() => setActiveSection("delete-requests")}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition text-left"
                    >
                      <Trash2 className="text-[#FF6B35] mb-2" size={24} />
                      <h3 className="font-semibold text-gray-900">Delete Requests</h3>
                      <p className="text-sm text-gray-600">Approve/reject requests</p>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "users":
        return <AdminUsers />;
      case "add-worker":
        return <AdminAddWorker />;
      case "add-admin":
        return <AdminAddAdmin />;
      case "analytics":
        return <AdminAnalytics />;
      case "transactions":
        return <AdminTransactions />;
      case "messages":
        return <AdminMessages />;
      case "delete-requests":
        return <AdminDeleteRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static lg:translate-x-0 z-30 w-64 bg-white h-full shadow-xl transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 bg-[#FF6B35]">
            <h6 className="text-2xl font-bold text-white"> All India Labour Union</h6>
            <p className="text-orange-100 text-sm">
              {isSuperAdmin ? "Super Admin" : "Admin"} Panel
            </p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                    activeSection === item.id
                      ? "bg-[#FF6B35] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-600">
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;

