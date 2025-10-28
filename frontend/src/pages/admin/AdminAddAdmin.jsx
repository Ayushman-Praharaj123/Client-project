import { useState } from "react";
import { Shield } from "lucide-react";
import toast from "react-hot-toast";

const AdminAddAdmin = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.info("This feature requires super admin privileges and backend implementation");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-[#FF6B35]" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Add New Admin</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Super Admin Only:</strong> Only super admins can add new admin accounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter admin phone number"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2b] transition"
          >
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddAdmin;

