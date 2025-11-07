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
  const [registrationMethod, setRegistrationMethod] = useState("password"); // "password" or "otp"
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    workerType: "",
    password: "",
    confirmPassword: "",
    membershipType: "monthly",
  });

  // Membership plans with fees
  const membershipPlans = [
    { value: "monthly", label: "Monthly", fee: 150, duration: "1 Month" },
    { value: "quarterly", label: "Quarterly", fee: 250, duration: "3 Months" },
    { value: "halfyearly", label: "Half-Yearly", fee: 350, duration: "6 Months" },
    { value: "yearly", label: "Yearly", fee: 650, duration: "12 Months" },
  ];

  // Get selected plan details
  const selectedPlan = membershipPlans.find(plan => plan.value === formData.membershipType) || membershipPlans[0];

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

  // Send OTP for registration
  const handleSendOTP = async () => {
    // Basic validation
    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/send-registration-otp", {
        phoneNumber: formData.phoneNumber,
        email: formData.email || null,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        phoneNumber: formData.phoneNumber,
        otp,
      });

      if (res.data.success) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.workerType
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Password method validation
    if (registrationMethod === "password") {
      if (!formData.password || !formData.confirmPassword) {
        toast.error("Password and confirm password are required");
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
    }

    // OTP method validation
    if (registrationMethod === "otp" && !otpVerified) {
      toast.error("Please verify OTP first");
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
        email: formData.email || null,
        address: formData.address,
        workerType: formData.workerType,
        password: registrationMethod === "password" ? formData.password : null,
        membershipType: formData.membershipType,
        registrationMethod,
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
        name: "ODIA INTERSTATE MIGRANT WORKERS UNION",
        description: `${selectedPlan.label} Membership Fee`,
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
              email: formData.email || null,
              address: formData.address,
              workerType: formData.workerType,
              password: registrationMethod === "password" ? formData.password : null,
              membershipType: formData.membershipType,
              registrationMethod,
              amount: orderRes.data.amount,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (registrationRes.data.success) {
              toast.success("Registration successful! Welcome to OIMWU");
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
            Join ODIA INTERSTATE MIGRANT WORKERS UNION
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
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                placeholder="your.email@example.com (optional)"
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

            {/* Registration Method Selection */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Registration Method *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div
                  onClick={() => {
                    setRegistrationMethod("password");
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp("");
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    registrationMethod === "password"
                      ? "border-[#FF6B35] bg-orange-50"
                      : "border-gray-300 hover:border-[#FF6B35]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Set Password</h3>
                    <input
                      type="radio"
                      name="registrationMethod"
                      value="password"
                      checked={registrationMethod === "password"}
                      onChange={() => setRegistrationMethod("password")}
                      className="text-[#FF6B35]"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Create a password for your account</p>
                </div>

                <div
                  onClick={() => {
                    setRegistrationMethod("otp");
                    setFormData({ ...formData, password: "", confirmPassword: "" });
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    registrationMethod === "otp"
                      ? "border-[#FF6B35] bg-orange-50"
                      : "border-gray-300 hover:border-[#FF6B35]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Verify with OTP</h3>
                    <input
                      type="radio"
                      name="registrationMethod"
                      value="otp"
                      checked={registrationMethod === "otp"}
                      onChange={() => setRegistrationMethod("otp")}
                      className="text-[#FF6B35]"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Verify via OTP sent to phone/email</p>
                </div>
              </div>
            </div>

            {/* Password Fields - Only show if password method selected */}
            {registrationMethod === "password" && (
              <>
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
              </>
            )}

            {/* OTP Fields - Only show if OTP method selected */}
            {registrationMethod === "otp" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || !formData.phoneNumber}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : !otpVerified ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Enter OTP *
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">OTP Verified Successfully!</span>
                  </div>
                )}
              </div>
            )}

            {/* Membership Plan Selection */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Select Membership Plan *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membershipPlans.map((plan) => (
                  <div
                    key={plan.value}
                    onClick={() => setFormData({ ...formData, membershipType: plan.value })}
                    className={`p-5 border-2 rounded-lg cursor-pointer transition ${
                      formData.membershipType === plan.value
                        ? "border-[#FF6B35] bg-orange-50 shadow-md"
                        : "border-gray-300 hover:border-[#FF6B35] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{plan.label}</h3>
                      <input
                        type="radio"
                        name="membershipType"
                        value={plan.value}
                        checked={formData.membershipType === plan.value}
                        onChange={handleChange}
                        className="text-[#FF6B35] w-5 h-5"
                      />
                    </div>
                    <p className="text-3xl font-bold text-[#FF6B35] mb-1">₹{plan.fee}</p>
                    <p className="text-sm text-gray-600">Valid for {plan.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (registrationMethod === "otp" && !otpVerified)}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Proceed to Payment - ₹${selectedPlan.fee}`}
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

