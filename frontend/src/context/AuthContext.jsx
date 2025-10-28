import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
      setRole(res.data.role);
    } catch (error) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login
  const login = async (phoneNumber, password, loginType) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        phoneNumber,
        password,
        loginType,
      });
      
      if (res.data.success) {
        setUser(res.data.user || res.data.admin);
        setRole(res.data.role);
        toast.success("Login successful!");
        return { success: true, role: res.data.role };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setRole(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    try {
      const res = await axiosInstance.put("/users/profile", data);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile updated successfully");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

