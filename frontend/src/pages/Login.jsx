import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";

const Login = () => {
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("worker");
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState(""); // To show which email OTP was sent to
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP for login (Worker only - only phone number required)
  const handleSendLoginOTP = async () => {
    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/send-login-otp", {
        phoneNumber: formData.phoneNumber,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setMaskedEmail(res.data.email || "");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Login with OTP (Worker only)
  const handleLoginWithOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login-with-otp", {
        phoneNumber: formData.phoneNumber,
        otp,
      });

      if (res.data.success) {
        toast.success("Login successful!");
        await checkAuth();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For OTP login (Worker only)
    if (loginType === "worker" && loginMethod === "otp") {
      if (!otpSent) {
        await handleSendLoginOTP();
      } else {
        await handleLoginWithOTP();
      }
      return;
    }

    // For password login (All types)
    if (!formData.phoneNumber || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.phoneNumber, formData.password, loginType);

      if (result.success) {
        if (result.role === "worker") {
          navigate("/");
        } else if (result.role === "admin" || result.role === "superadmin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-[#FF6B35] transition"
        >
          <Home size={20} />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Login
          </h1>

          {/* Login Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login As
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLoginType("worker");
                  setLoginMethod("password");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`py-2 px-4 rounded-lg font-medium transition ${
                  loginType === "worker"
                    ? "bg-[#FF6B35] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Worker
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType("admin");
                  setLoginMethod("password");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`py-2 px-4 rounded-lg font-medium transition ${
                  loginType === "admin"
                    ? "bg-[#FF6B35] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType("superadmin");
                  setLoginMethod("password");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`py-2 px-4 rounded-lg font-medium transition text-sm ${
                  loginType === "superadmin"
                    ? "bg-[#FF6B35] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* Login Method Selection - Only for Workers */}
          {loginType === "worker" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className={`py-2 px-4 rounded-lg font-medium transition ${
                    loginMethod === "password"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp");
                    setFormData({ ...formData, password: "" });
                  }}
                  className={`py-2 px-4 rounded-lg font-medium transition ${
                    loginMethod === "otp"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  OTP
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your phone number"
                maxLength="10"
              />
            </div>

            {/* Info message for OTP login */}
            {loginType === "worker" && loginMethod === "otp" && !otpSent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> OTP will be sent to the email address linked with your phone number.
                </p>
              </div>
            )}

            {/* Show masked email after OTP is sent */}
            {loginType === "worker" && loginMethod === "otp" && otpSent && maskedEmail && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>OTP sent to:</strong> {maskedEmail}
                </p>
              </div>
            )}

            {/* Password field - Show only if password method OR admin/superadmin */}
            {(loginMethod === "password" || loginType !== "worker") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            )}

            {/* OTP field - Show only if OTP method and worker */}
            {loginType === "worker" && loginMethod === "otp" && otpSent && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Enter OTP
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
                  <button
                    type="button"
                    onClick={handleSendLoginOTP}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {loginType === "worker" && loginMethod === "password" && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#FF6B35] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : loginType === "worker" && loginMethod === "otp" && !otpSent
                ? "Send OTP"
                : loginType === "worker" && loginMethod === "otp" && otpSent
                ? "Verify OTP & Login"
                : "Login"}
            </button>
          </form>

          {loginType === "worker" && (
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#FF6B35] font-semibold hover:underline">
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

