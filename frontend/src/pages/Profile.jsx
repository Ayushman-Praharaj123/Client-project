import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Briefcase, IdCard, Download, Camera, Receipt } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axiosInstance from "../lib/axios";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const idCardRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  });

  // Fetch user transaction
  const { data: transactionData } = useQuery({
    queryKey: ["user-transaction"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/transaction");
      return res.data;
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const res = await axiosInstance.post("/users/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      await checkAuth(); // Refresh user data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transactionData?.transaction) {
      toast.error("No transaction found");
      return;
    }

    setDownloading(true);
    try {
      const transaction = transactionData.transaction;
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
      pdf.text(`Name: ${user?.fullName}`, 20, y);
      y += 8;
      pdf.text(`User ID: ${user?.userId}`, 20, y);
      y += 8;
      pdf.text(`Email: ${user?.email}`, 20, y);
      y += 8;
      pdf.text(`Phone: ${user?.phoneNumber}`, 20, y);
      y += 15;

      pdf.setFont(undefined, 'bold');
      pdf.text('Payment Details:', 20, y);
      y += 10;

      pdf.setFont(undefined, 'normal');
      const membershipLabels = {
        monthly: 'Monthly (1 Month)',
        quarterly: 'Quarterly (3 Months)',
        halfyearly: 'Half-Yearly (6 Months)',
        yearly: 'Yearly (12 Months)',
      };
      pdf.text(`Membership Type: ${membershipLabels[transaction.membershipType] || transaction.membershipType}`, 20, y);
      y += 8;
      pdf.text(`Amount Paid: ₹${transaction.amount}`, 20, y);
      y += 8;
      pdf.text(`Status: ${transaction.status}`, 20, y);
      y += 20;

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });
      pdf.text('For any queries, please contact All India Labour Union.', 105, 285, { align: 'center' });

      pdf.save(`AILU_Receipt_${user?.userId}.pdf`);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to download receipt');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadID = async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Credit card size
      });

      // Set background color
      pdf.setFillColor(255, 107, 53); // Orange
      pdf.rect(0, 0, 85.6, 53.98, 'F');

      // Add white card area
      pdf.setFillColor(255, 255, 255);
      pdf.rect(2, 2, 81.6, 49.98, 'F');

      // Add orange header
      pdf.setFillColor(255, 107, 53);
      pdf.rect(2, 2, 81.6, 12, 'F');

      // Add title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('ODIA INTERSTATE MIGRANT WORKERS UNION', 42.8, 7, { align: 'center' });
      pdf.setFontSize(7);
      pdf.text('MEMBER ID CARD', 42.8, 11, { align: 'center' });

      // Add user details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('ID:', 5, 20);
      pdf.setFont(undefined, 'normal');
      pdf.text(user?.userId || 'N/A', 15, 20);

      pdf.setFont(undefined, 'bold');
      pdf.text('Name:', 5, 26);
      pdf.setFont(undefined, 'normal');
      pdf.text(user?.fullName || 'N/A', 15, 26);

      pdf.setFont(undefined, 'bold');
      pdf.text('Phone:', 5, 32);
      pdf.setFont(undefined, 'normal');
      pdf.text(user?.phoneNumber || 'N/A', 15, 32);

      pdf.setFont(undefined, 'bold');
      pdf.text('Type:', 5, 38);
      pdf.setFont(undefined, 'normal');
      pdf.text(user?.workerType || 'N/A', 15, 38);

      pdf.setFont(undefined, 'bold');
      pdf.text('Email:', 5, 44);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(6);
      pdf.text(user?.email || 'N/A', 15, 44);

      // Add membership validity
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('Plan:', 5, 50);
      pdf.setFont(undefined, 'normal');
      pdf.text(user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1) || 'N/A', 15, 50);

      pdf.setFont(undefined, 'bold');
      pdf.text('Valid From:', 5, 56);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(6);
      pdf.text(user?.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString("en-IN") : 'N/A', 20, 56);

      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('Valid Until:', 5, 62);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(6);
      pdf.text(user?.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString("en-IN") : 'N/A', 20, 62);

      // Add footer
      pdf.setFontSize(5);
      pdf.setTextColor(100, 100, 100);
      pdf.text('This is an official member ID card', 42.8, 68, { align: 'center' });

      // Save the PDF
      pdf.save(`OIMWU_ID_${user?.userId}.pdf`);
      toast.success('ID Card downloaded successfully!');
    } catch (error) {
      console.error('Error generating ID card:', error);
      toast.error('Failed to download ID card');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#FF6B35] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {user?.profilePic ? (
                    <img
                      src={`http://localhost:5001${user.profilePic}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#FF6B35] text-3xl font-bold">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white text-[#FF6B35] p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                  <p className="text-orange-100">{user?.workerType}</p>
                  {user?.membershipType && (
                    <p className="text-orange-100 text-sm">
                      {user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)} Member
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Upload Preview */}
            {selectedFile && (
              <div className="mt-4 bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">New Profile Photo</p>
                      <p className="text-gray-600 text-sm">{selectedFile.name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUploadPhoto}
                      disabled={uploading}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <IdCard className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-semibold text-gray-900">{user?.userId}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-900">{user?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-900">{user?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Briefcase className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Worker Type</p>
                      <p className="font-semibold text-gray-900">{user?.workerType}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:col-span-2">
                    <MapPin className="text-[#FF6B35] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">{user?.address}</p>
                    </div>
                  </div>
                </div>

                {/* Membership Details Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Membership Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-[#FF6B35]">
                      <p className="text-sm text-gray-600 mb-1">Membership Plan</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1)}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-[#FF6B35]">
                      <p className="text-sm text-gray-600 mb-1">Valid From</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {user?.membershipStartDate
                          ? new Date(user.membershipStartDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-[#FF6B35]">
                      <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {user?.membershipExpiry
                          ? new Date(user.membershipExpiry).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                      {user?.membershipExpiry && new Date(user.membershipExpiry) < new Date() && (
                        <p className="text-sm text-red-600 font-semibold mt-1">Expired</p>
                      )}
                      {user?.membershipExpiry && new Date(user.membershipExpiry) >= new Date() && (
                        <p className="text-sm text-green-600 font-semibold mt-1">Active</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e55a2b] transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/renew-membership')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Renew Membership
                  </button>
                  <button
                    onClick={handleDownloadID}
                    disabled={downloading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={20} />
                    {downloading ? 'Generating...' : 'Download ID Card'}
                  </button>
                  {transactionData?.transaction && (
                    <button
                      onClick={handleDownloadReceipt}
                      disabled={downloading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Receipt size={20} />
                      {downloading ? 'Generating...' : 'Download Receipt'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

