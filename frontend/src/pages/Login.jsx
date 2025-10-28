import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("worker");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
                onClick={() => setLoginType("worker")}
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
                onClick={() => setLoginType("admin")}
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
                onClick={() => setLoginType("superadmin")}
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

            {loginType === "worker" && (
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
              {loading ? "Logging in..." : "Login"}
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

