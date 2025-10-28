import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { user } = useAuth();

  // Leadership team data
  const leadershipTeam = [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "President",
      description: "Leading the union with 20+ years of experience in labor rights",
      image: null,
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Vice President",
      description: "Dedicated to worker welfare and social justice",
      image: null,
    },
    {
      id: 3,
      name: "Amit Patel",
      position: "General Secretary",
      description: "Managing union operations and member services",
      image: null,
    },
    {
      id: 4,
      name: "Sunita Devi",
      position: "Treasurer",
      description: "Ensuring financial transparency and accountability",
      image: null,
    },
    {
      id: 5,
      name: "Mohammed Ali",
      position: "Joint Secretary",
      description: "Coordinating regional activities and member engagement",
      image: null,
    },
    {
      id: 6,
      name: "Lakshmi Menon",
      position: "Women's Wing Head",
      description: "Championing women workers' rights and empowerment",
      image: null,
    },
  ];

  // Track visit
  useEffect(() => {
    axiosInstance.post("/analytics/track-visit").catch(console.error);
  }, []);

  // Fetch registration growth data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["registration-growth"],
    queryFn: async () => {
      const res = await axiosInstance.get("/analytics/registration-growth?days=30");
      return res.data.data;
    },
  });

  // Format analytics data for chart
  const chartData = analyticsData?.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    registrations: item.registrations,
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                All India Labour Union
              </h1>
              <p className="text-xl md:text-2xl text-gray-600">
                Empowering workers all over India
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    to="/register"
                    className="bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#e55a2b] transition text-center"
                  >
                    Register Now
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-[#FF6B35] text-[#FF6B35] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#FF6B35] hover:text-white transition text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side - Hero Image */}
            <div className="flex justify-center">
              <img
                src="/heroimage.png"
                alt="Labour Union"
                className="w-full max-w-md rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Our Leadership Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Meet the dedicated leaders working tirelessly for the rights and welfare of workers across India
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {/* Leader Image/Avatar */}
                <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8c5a] h-48 flex items-center justify-center">
                  {leader.image ? (
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                      <User size={64} className="text-[#FF6B35]" />
                    </div>
                  )}
                </div>

                {/* Leader Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-[#FF6B35] font-semibold mb-3">
                    {leader.position}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {leader.description}
                  </p>
                </div>

                {/* Decorative Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Growth Graph Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Registration Growth
          </h2>

          {analyticsLoading ? (
            <LoadingSpinner />
          ) : chartData.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    dot={{ fill: "#FF6B35", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-600">No registration data available yet.</p>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      {!user && (
        <section className="bg-[#FF6B35] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Us Today!
            </h2>
            <p className="text-xl text-white mb-8">
              Become a member of All India Labour Union and get access to exclusive benefits
            </p>
            <Link
              to="/register"
              className="bg-white text-[#FF6B35] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
            >
              Register Now - ₹250 Only
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

