import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const RenewMembership = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  // Membership plans with fees
  const membershipPlans = [
    { value: "monthly", label: "Monthly", fee: 150, duration: "1 Month" },
    { value: "quarterly", label: "Quarterly", fee: 250, duration: "3 Months" },
    { value: "halfyearly", label: "Half-Yearly", fee: 350, duration: "6 Months" },
    { value: "yearly", label: "Yearly", fee: 650, duration: "12 Months" },
  ];

  const currentPlan = membershipPlans.find(plan => plan.value === selectedPlan) || membershipPlans[0];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRenew = async () => {
    if (!user) {
      toast.error("Please login to renew membership");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order for renewal
      const orderRes = await axiosInstance.post("/auth/create-renewal-order", {
        membershipType: selectedPlan,
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

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount * 100,
        currency: "INR",
        name: "ODIA INTERSTATE MIGRANT WORKERS UNION",
        description: `${currentPlan.label} Membership Renewal`,
        order_id: orderRes.data.order.id,

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
            // Complete renewal
            const renewalRes = await axiosInstance.post("/auth/complete-renewal", {
              membershipType: selectedPlan,
              amount: orderRes.data.amount,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (renewalRes.data.success) {
              toast.success("Membership renewed successfully!");
              await checkAuth();
              navigate("/profile");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Renewal failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phoneNumber,
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
      toast.error(error.response?.data?.message || "Renewal failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
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
            Renew Your Membership
          </h1>
          <p className="mb-8 text-center text-gray-600">
            Choose a plan to continue your membership
          </p>

          {/* Current Membership Info */}
          {user && (
            <div className="mb-8 p-4 bg-orange-50 border-l-4 border-[#FF6B35] rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Current Membership Status</h3>
              <p className="text-gray-700">
                <span className="font-medium">Plan:</span> {user.membershipType?.charAt(0).toUpperCase() + user.membershipType?.slice(1)}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Expires on:</span>{" "}
                {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString("en-IN") : "N/A"}
              </p>
            </div>
          )}

          {/* Membership Plan Selection */}
          <div className="mb-8">
            <label className="block mb-4 text-lg font-semibold text-gray-900">
              Select Renewal Plan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => setSelectedPlan(plan.value)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                    selectedPlan === plan.value
                      ? "border-[#FF6B35] bg-orange-50 shadow-md"
                      : "border-gray-300 hover:border-[#FF6B35] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{plan.label}</h3>
                    <input
                      type="radio"
                      name="membershipType"
                      value={plan.value}
                      checked={selectedPlan === plan.value}
                      onChange={() => setSelectedPlan(plan.value)}
                      className="text-[#FF6B35] w-5 h-5"
                    />
                  </div>
                  <p className="text-4xl font-bold text-[#FF6B35] mb-2">₹{plan.fee}</p>
                  <p className="text-sm text-gray-600">Valid for {plan.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Renew Button */}
          <button
            onClick={handleRenew}
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? "Processing..." : `Renew Now - Pay ₹${currentPlan.fee}`}
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Your membership will be extended from the current expiry date
          </p>
        </div>
      </div>
    </div>
  );
};

export default RenewMembership;

