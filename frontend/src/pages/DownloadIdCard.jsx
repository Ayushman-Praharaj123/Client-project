import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const DownloadIdCard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get(`/users/download-id-card/${userId}`);
      if (res.data.success) {
        setUser(res.data.user);
        // Auto-download after 2 seconds
        setTimeout(() => {
          generateIdCard(res.data.user);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateIdCard = (userData) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98], // Standard ID card size
    });

    // Background
    doc.setFillColor(255, 107, 53);
    doc.rect(0, 0, 85.6, 15, "F");

    // Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ODIA INTERSTATE MIGRANT", 42.8, 6, { align: "center" });
    doc.text("WORKERS UNION", 42.8, 11, { align: "center" });

    // Content area
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("MEMBER ID CARD", 42.8, 20, { align: "center" });

    // User details
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    
    const startY = 26;
    const lineHeight = 4.5;

    doc.setFont("helvetica", "bold");
    doc.text("ID:", 8, startY);
    doc.setFont("helvetica", "normal");
    doc.text(userData.userId, 20, startY);

    doc.setFont("helvetica", "bold");
    doc.text("Name:", 8, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(userData.fullName, 20, startY + lineHeight);

    doc.setFont("helvetica", "bold");
    doc.text("Phone:", 8, startY + lineHeight * 2);
    doc.setFont("helvetica", "normal");
    doc.text(userData.phoneNumber, 20, startY + lineHeight * 2);

    doc.setFont("helvetica", "bold");
    doc.text("Type:", 8, startY + lineHeight * 3);
    doc.setFont("helvetica", "normal");
    doc.text(userData.workerType, 20, startY + lineHeight * 3);

    doc.setFont("helvetica", "bold");
    doc.text("Plan:", 8, startY + lineHeight * 4);
    doc.setFont("helvetica", "normal");
    doc.text(userData.membershipType.charAt(0).toUpperCase() + userData.membershipType.slice(1), 20, startY + lineHeight * 4);

    doc.setFont("helvetica", "bold");
    doc.text("Valid Until:", 8, startY + lineHeight * 5);
    doc.setFont("helvetica", "normal");
    const expiryDate = new Date(userData.membershipExpiry).toLocaleDateString('en-IN');
    doc.text(expiryDate, 28, startY + lineHeight * 5);

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated ID card", 42.8, 52, { align: "center" });

    // Save PDF
    doc.save(`OIMWU_ID_Card_${userData.userId}.pdf`);
    toast.success("ID Card downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ID card...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ID Card Ready!</h2>
          <p className="text-gray-600">Your ID card download should start automatically.</p>
        </div>

        {user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {user.fullName}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>ID:</strong> {user.userId}</p>
            <p className="text-sm text-gray-600"><strong>Plan:</strong> {user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)}</p>
          </div>
        )}

        <button
          onClick={() => user && generateIdCard(user)}
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

export default DownloadIdCard;

