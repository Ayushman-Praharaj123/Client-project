import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Search, Receipt, TrendingUp } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const AdminTransactions = () => {
  const [filters, setFilters] = useState({
    membershipType: "all",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Fetch transactions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.membershipType !== "all") params.append("membershipType", filters.membershipType);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      
      const res = await axiosInstance.get(`/admin/transactions?${params.toString()}`);
      return res.data;
    },
  });

  // Fetch summary
  const { data: summaryData } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/transactions/summary");
      return res.data;
    },
  });

  const handleDownloadReceipt = async (transaction) => {
    try {
      const pdf = new jsPDF();

      // Add header
      pdf.setFillColor(255, 107, 53);
      pdf.rect(0, 0, 210, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text('ALL INDIA LABOUR UNION', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('Payment Receipt', 105, 30, { align: 'center' });

      // Add receipt details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      let y = 60;

      pdf.setFont(undefined, 'bold');
      pdf.text('Receipt Details:', 20, y);
      y += 10;

      pdf.setFont(undefined, 'normal');
      pdf.text(`Transaction ID: ${transaction.orderId}`, 20, y);
      y += 8;
      pdf.text(`Payment ID: ${transaction.paymentId}`, 20, y);
      y += 8;
      pdf.text(`Date: ${new Date(transaction.paymentDate).toLocaleDateString()}`, 20, y);
      y += 15;

      pdf.setFont(undefined, 'bold');
      pdf.text('Member Details:', 20, y);
      y += 10;

      pdf.setFont(undefined, 'normal');
      pdf.text(`Name: ${transaction.userId?.fullName || 'N/A'}`, 20, y);
      y += 8;
      pdf.text(`User ID: ${transaction.userId?.userId || 'N/A'}`, 20, y);
      y += 8;
      pdf.text(`Email: ${transaction.userId?.email || 'N/A'}`, 20, y);
      y += 8;
      pdf.text(`Phone: ${transaction.userId?.phoneNumber || 'N/A'}`, 20, y);
      y += 15;

      pdf.setFont(undefined, 'bold');
      pdf.text('Payment Details:', 20, y);
      y += 10;

      pdf.setFont(undefined, 'normal');
      pdf.text(`Membership Type: ${transaction.membershipType === 'annual' ? 'Annual (1 Year)' : 'Permanent (Lifetime)'}`, 20, y);
      y += 8;
      pdf.text(`Amount Paid: ₹${transaction.amount}`, 20, y);
      y += 8;
      pdf.text(`Added By: ${transaction.addedBy}`, 20, y);
      y += 8;
      pdf.text(`Status: ${transaction.status}`, 20, y);
      y += 20;

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });
      pdf.text('For any queries, please contact All India Labour Union.', 105, 285, { align: 'center' });

      pdf.save(`AILU_Receipt_${transaction.orderId}.pdf`);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handleExportCSV = () => {
    if (!data?.transactions?.length) {
      toast.error("No transactions to export");
      return;
    }

    const csvContent = [
      ["Date", "User ID", "Name", "Email", "Phone", "Membership Type", "Amount", "Added By", "Status"],
      ...data.transactions.map(t => [
        new Date(t.paymentDate).toLocaleDateString(),
        t.userId?.userId || 'N/A',
        t.userId?.fullName || 'N/A',
        t.userId?.email || 'N/A',
        t.userId?.phoneNumber || 'N/A',
        t.membershipType === 'annual' ? 'Annual' : 'Permanent',
        `₹${t.amount}`,
        t.addedBy,
        t.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AILU_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      {summaryData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Fees Collected</p>
                <p className="text-2xl font-bold text-[#FF6B35]">
                  ₹{summaryData.summary.totalFees.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="text-[#FF6B35]" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summaryData.summary.totalTransactions}
                </p>
              </div>
              <Receipt className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-600 text-sm mb-2">By Membership Type</p>
              {summaryData.summary.byMembershipType.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="capitalize">{item._id}:</span>
                  <span className="font-semibold">₹{item.total} ({item.count})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-600 text-sm mb-2">By Source</p>
              {summaryData.summary.byAddedBy.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="capitalize">{item._id}:</span>
                  <span className="font-semibold">₹{item.total} ({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Type
            </label>
            <select
              value={filters.membershipType}
              onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="annual">Annual</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ membershipType: "all", startDate: "", endDate: "", search: "" })}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : data?.transactions?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                data?.transactions?.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.userId?.fullName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.userId?.userId || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.userId?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.membershipType === 'annual'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {transaction.membershipType === 'annual' ? 'Annual' : 'Permanent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.addedBy === 'self' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Self Registration
                        </span>
                      ) : transaction.addedBy?.startsWith('admin_') ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Admin: {transaction.addedBy.replace('admin_', '')}
                        </span>
                      ) : (
                        <span className="text-gray-500">{transaction.addedBy}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDownloadReceipt(transaction)}
                        className="text-[#FF6B35] hover:text-orange-700 font-medium flex items-center gap-1"
                      >
                        <Download size={16} />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;

