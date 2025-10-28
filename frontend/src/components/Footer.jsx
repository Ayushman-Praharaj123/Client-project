import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <h3 className="text-xl font-bold">All India Labour Union</h3>
            </div>
            <p className="text-gray-400">
              Empowering workers all over India. Join us in building a stronger future for all laborers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone size={18} />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail size={18} />
                <span>info@labourunion.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin size={18} className="mt-1" />
                <span>123 Union Street, New Delhi, India - 110001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} All India Labour Union. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

