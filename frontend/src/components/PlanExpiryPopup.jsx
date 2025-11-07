import { X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanExpiryPopup = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleRenew = () => {
    onClose();
    navigate("/renew-membership");
  };

  const isExpired = user?.membershipExpiry && new Date(user.membershipExpiry) < new Date();
  const daysUntilExpiry = user?.membershipExpiry 
    ? Math.ceil((new Date(user.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 rounded-full p-4">
            <AlertCircle size={48} className="text-[#FF6B35]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {isExpired ? "Membership Expired" : "Membership Expiring Soon"}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {isExpired ? (
            <>
              Your membership has expired on{" "}
              <span className="font-semibold text-[#FF6B35]">
                {new Date(user.membershipExpiry).toLocaleDateString("en-IN")}
              </span>
              . Please renew to continue enjoying all benefits.
            </>
          ) : (
            <>
              Your membership will expire in{" "}
              <span className="font-semibold text-[#FF6B35]">
                {daysUntilExpiry} {daysUntilExpiry === 1 ? "day" : "days"}
              </span>
              . Renew now to avoid interruption.
            </>
          )}
        </p>

        {/* Current Plan Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Current Plan:</span>
            <span className="font-semibold text-gray-900">
              {user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expiry Date:</span>
            <span className="font-semibold text-gray-900">
              {user?.membershipExpiry 
                ? new Date(user.membershipExpiry).toLocaleDateString("en-IN")
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Later
          </button>
          <button
            onClick={handleRenew}
            className="flex-1 px-4 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#e55a2b] transition shadow-lg hover:shadow-xl"
          >
            Renew Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiryPopup;

