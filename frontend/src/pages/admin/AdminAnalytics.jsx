import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import axiosInstance from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminAnalytics = () => {
  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics-detailed"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/analytics?days=30");
      return res.data;
    },
  });

  // Fetch all users for worker type distribution
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users?limit=1000");
      return res.data;
    },
  });

  // Format monthly registration data
  const monthlyData = analyticsData?.analytics?.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    const existing = acc.find(d => d.month === month);
    if (existing) {
      existing.registrations += item.registrations;
    } else {
      acc.push({ month, registrations: item.registrations });
    }
    return acc;
  }, []) || [];

  // Calculate worker type distribution
  const workerTypeData = usersData?.users?.reduce((acc, user) => {
    const type = user.workerType || "Other";
    const existing = acc.find(d => d.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#FF6B35', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  if (analyticsLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-[#FF6B35]" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
      </div>

      {/* Monthly Registration Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Registrations</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="registrations" stroke="#FF6B35" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Worker Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Worker Type Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={workerTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {workerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Workers by Category</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={workerTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Workers</h3>
          <p className="text-3xl font-bold text-gray-900">{usersData?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Worker Categories</h3>
          <p className="text-3xl font-bold text-gray-900">{workerTypeData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">This Month</h3>
          <p className="text-3xl font-bold text-gray-900">
            {monthlyData[monthlyData.length - 1]?.registrations || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

