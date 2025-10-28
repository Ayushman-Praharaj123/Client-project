import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/send-otp", { phoneNumber });
      if (res.data.success) {
        toast.success("OTP sent to your email and phone");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/verify-otp", { phoneNumber, otp });
      if (res.data.success) {
        toast.success("OTP verified successfully");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        phoneNumber,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successful! Please login");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Reset Password
          </h1>

          {/* Step 1: Enter Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter your registered phone number"
                  maxLength="10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
                <p className="text-sm text-gray-600 mt-2">
                  OTP sent to your email and phone number
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[#FF6B35] hover:underline"
              >
                Back
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 mt-6">
            Remember your password?{" "}
            <a href="/login" className="text-[#FF6B35] font-semibold hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

