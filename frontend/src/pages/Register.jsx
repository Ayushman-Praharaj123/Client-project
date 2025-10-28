import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    workerType: "",
    password: "",
    confirmPassword: "",
    membershipType: "annual",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.address ||
      !formData.workerType ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderRes = await axiosInstance.post("/auth/create-order", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        workerType: formData.workerType,
        password: formData.password,
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

      // Razorpay options with UPI prioritized for easy Scan & Pay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount * 100,
        currency: "INR",
        name: "All India Labour Union",
        description: "Registration Fee",
        order_id: orderRes.data.order.id,

        // Configure payment methods - UPI first for labour workers
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
            // Complete registration
            const registrationRes = await axiosInstance.post("/auth/complete-registration", {
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
              toast.success("Registration successful! Welcome to AILU");
              await checkAuth();
              navigate("/");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
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
      toast.error(error.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-[#FF6B35] transition"
        >
          <Home size={20} />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-center text-gray-900">
            Register as a Member
          </h1>
          <p className="mb-8 text-center text-gray-600">
            Join All India Labour Union
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="10-digit mobile number"
                maxLength="10"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="Enter your complete address"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
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

            {/* Membership Type Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
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

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Proceed to Payment (₹250)"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#FF6B35] font-semibold hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

