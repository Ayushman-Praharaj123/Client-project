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
              <Link
                to="/login"
                className="border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#FF6B35] transition"
              >
                Login
              </Link>
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

        {/* Mobile Navigation - Slide from left */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#FF6B35] z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden shadow-2xl`}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Menu items */}
          <div className="px-6 py-4 space-y-4">
            <Link
              to="/"
              className="block text-white hover:text-gray-200 transition text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-gray-200 transition text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block text-white hover:text-gray-200 transition text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>

            {user ? (
              <>
                <Link
                  to={role === "worker" ? "/profile" : "/admin/dashboard"}
                  className="block text-white hover:text-gray-200 transition text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {role === "worker" ? "Your Profile" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left text-white hover:text-gray-200 transition text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-white hover:text-[#FF6B35] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;

