import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, CreditCard } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

const AdminAddWorker = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    workerType: "",
    password: "",
    membershipType: "annual",
  });
  const [loading, setLoading] = useState(false);

  const workerTypes = [
    "Domestic Worker",
    "Saloon Worker",
    "Rickshaw Driver",
    "Auto Driver",
    "Construction Worker",
    "Factory Worker",
    "Agricultural Worker",
    "Other",
  ];

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.email ||
        !formData.address || !formData.workerType || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderRes = await axiosInstance.post("/admin/create-worker-order", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        membershipType: formData.membershipType,
      });

      if (!orderRes.data.success) {
        toast.error("Failed to create payment order");
        setLoading(false);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      // Razorpay options with UPI prioritized
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount * 100,
        currency: "INR",
        name: "All India Labour Union",
        description: "Worker Registration Fee (Admin)",
        order_id: orderRes.data.order.id,

        // Configure payment methods - UPI first
        config: {
          display: {
            sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet"],
            preferences: {
              show_default_blocks: true
            }
          }
        },

        handler: async function (response) {
          try {
            // Complete worker addition
            const registrationRes = await axiosInstance.post("/admin/complete-worker-addition", {
              fullName: formData.fullName,
              phoneNumber: formData.phoneNumber,
              email: formData.email,
              address: formData.address,
              workerType: formData.workerType,
              password: formData.password,
              membershipType: formData.membershipType,
              amount: orderRes.data.amount,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (registrationRes.data.success) {
              toast.success(`Worker added successfully! User ID: ${registrationRes.data.user.userId}`);
              // Reset form
              setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                address: "",
                workerType: "",
                password: "",
                membershipType: "annual",
              });
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add worker");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: {
          color: "#FF6B35",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-[#FF6B35]" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Add New Worker</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Enter full address"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worker Type *
            </label>
            <select
              name="workerType"
              value={formData.workerType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="">Select worker type</option>
              {workerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          {/* Membership Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, membershipType: "annual" })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.membershipType === "annual"
                    ? "border-[#FF6B35] bg-orange-50"
                    : "border-gray-300 hover:border-[#FF6B35]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Annual Membership</h3>
                  <input
                    type="radio"
                    name="membershipType"
                    value="annual"
                    checked={formData.membershipType === "annual"}
                    onChange={handleChange}
                    className="text-[#FF6B35]"
                  />
                </div>
                <p className="text-2xl font-bold text-[#FF6B35]">₹250</p>
                <p className="text-sm text-gray-600 mt-1">Valid for 1 year</p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, membershipType: "permanent" })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.membershipType === "permanent"
                    ? "border-[#FF6B35] bg-orange-50"
                    : "border-gray-300 hover:border-[#FF6B35]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Permanent Membership</h3>
                  <input
                    type="radio"
                    name="membershipType"
                    value="permanent"
                    checked={formData.membershipType === "permanent"}
                    onChange={handleChange}
                    className="text-[#FF6B35]"
                  />
                </div>
                <p className="text-2xl font-bold text-[#FF6B35]">₹1000</p>
                <p className="text-sm text-gray-600 mt-1">Lifetime validity</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {loading ? "Processing..." : `Add Worker & Pay ₹${formData.membershipType === "permanent" ? "1000" : "250"}`}
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                address: "",
                workerType: "",
                password: "",
                membershipType: "annual",
              })}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Payment Required:</strong> Admin must complete payment (₹{formData.membershipType === "permanent" ? "1000" : "250"})
            to add a worker. The transaction will be recorded in the Transaction History with your admin details for proper accounting and records.
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Note:</strong> Payment can be made via UPI (Scan & Pay), Cards, Net Banking, or Wallets.
            A unique User ID will be generated automatically after successful payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAddWorker;

