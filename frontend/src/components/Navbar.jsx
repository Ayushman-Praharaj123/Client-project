import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#FF6B35] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold hidden sm:block">
              ODIA INTERSTATE MIGRANT WORKERS UNION
            </span>
            <span className="text-lg sm:hidden"> ODIA INTERSTATE MIGRANT WORKERS UNION</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-200 transition">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-gray-200 transition">
              Contact Us
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:text-gray-200 transition"
                >
                  <UserCircle size={32} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                    <Link
                      to={role === "worker" ? "/profile" : "/admin/dashboard"}
                      className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} />
                      <span>{role === "worker" ? "Your Profile" : "Dashboard"}</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/register"
                  className="bg-white text-[#FF6B35] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#FF6B35] transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              className="block hover:text-gray-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block hover:text-gray-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block hover:text-gray-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>

            {user ? (
              <>
                <Link
                  to={role === "worker" ? "/profile" : "/admin/dashboard"}
                  className="block hover:text-gray-200 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {role === "worker" ? "Your Profile" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left hover:text-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/register"
                  className="bg-white text-[#FF6B35] px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-white hover:text-[#FF6B35] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

