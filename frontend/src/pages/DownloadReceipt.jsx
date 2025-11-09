import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const DownloadReceipt = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceiptData();
  }, [userId]);

  const fetchReceiptData = async () => {
    try {
      const res = await axiosInstance.get(`/users/download-receipt/${userId}`);
      if (res.data.success) {
        setData(res.data);
        // Auto-download after 2 seconds
        setTimeout(() => {
          generateReceipt(res.data);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch receipt data");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (receiptData) => {
    const { transaction, user } = receiptData;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(255, 107, 53);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ODIA INTERSTATE MIGRANT", 105, 15, { align: "center" });
    doc.text("WORKERS UNION", 105, 25, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("PAYMENT RECEIPT", 105, 35, { align: "center" });

    // Receipt details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt Details", 20, 55);

    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, 190, 58);

    // Transaction info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    let yPos = 70;
    const lineHeight = 8;

    doc.setFont("helvetica", "bold");
    doc.text("Transaction ID:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(transaction.orderId, 70, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Payment ID:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(transaction.paymentId || "N/A", 70, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 20, yPos);
    doc.setFont("helvetica", "normal");
    const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(date, 70, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Status:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(transaction.status.toUpperCase(), 70, yPos);

    // Member details
    yPos += lineHeight * 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Member Details", 20, yPos);
    doc.line(20, yPos + 3, 190, yPos + 3);

    yPos += lineHeight + 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(user.fullName, 70, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("User ID:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(user.userId, 70, yPos);

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(user.phoneNumber, 70, yPos);

    if (user.email) {
      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text("Email:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(user.email, 70, yPos);
    }

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Address:", 20, yPos);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(user.address, 120);
    doc.text(addressLines, 70, yPos);

    // Payment details
    yPos += lineHeight * (addressLines.length + 1);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 30, "F");

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Membership Plan:", 25, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(transaction.membershipType.charAt(0).toUpperCase() + transaction.membershipType.slice(1), 70, yPos);

    yPos += lineHeight;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Amount Paid:", 25, yPos);
    doc.setTextColor(255, 107, 53);
    doc.text(`₹${transaction.amount}`, 70, yPos);

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text("This is a computer-generated receipt and does not require a signature.", 105, 280, { align: "center" });
    doc.text("For any queries, please contact OIMWU support.", 105, 285, { align: "center" });

    // Save PDF
    doc.save(`OIMWU_Receipt_${transaction.orderId}.pdf`);
    toast.success("Receipt downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Receipt Ready!</h2>
          <p className="text-gray-600">Your payment receipt download should start automatically.</p>
        </div>

        {data && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {data.user.fullName}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Amount:</strong> ₹{data.transaction.amount}</p>
            <p className="text-sm text-gray-600"><strong>Plan:</strong> {data.transaction.membershipType.charAt(0).toUpperCase() + data.transaction.membershipType.slice(1)}</p>
          </div>
        )}

        <button
          onClick={() => data && generateReceipt(data)}
          className="w-full bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition mb-3"
        >
          Download Again
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default DownloadReceipt;

