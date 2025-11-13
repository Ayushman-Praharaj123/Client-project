import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import PlanExpiryPopup from "../components/PlanExpiryPopup";

const Home = () => {
  const { user } = useAuth();
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images array (H1 to H21) - Using lowercase .jpg extension (matching public folder)
  const heroImages = Array.from({ length: 21 }, (_, i) => `/H${i + 1}.jpg`);

  // Debug: Log the first image path
  useEffect(() => {
    console.log('Hero images:', heroImages);
    console.log('Current slide:', currentSlide);
    console.log('Current image:', heroImages[currentSlide]);
  }, [currentSlide]);

  // Auto-slide hero images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Manual slide controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Check if plan is expired or expiring soon (within 7 days)
  useEffect(() => {
    if (user && user.membershipExpiry) {
      const expiryDate = new Date(user.membershipExpiry);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Show popup if expired or expiring within 7 days
      if (daysUntilExpiry <= 7) {
        setShowExpiryPopup(true);
      }
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Plan Expiry Popup */}
      {showExpiryPopup && user && (
        <PlanExpiryPopup user={user} onClose={() => setShowExpiryPopup(false)} />
      )}

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <h3 className=" text-2xl md:text-2xl font-bold text-gray-900 leading-tight text-center">
                ODIA INTERSTATE MIGRANT WORKERS UNION
              </h3>
              <p className="text-xl md:text-2xl text-gray-600 text-center">
                Affiliated to NFITU
              </p>
              <p className="text-lg md:text-xl text-gray-500 italic text-center">
                (Collaborated to fight for right)
              </p>
              {!user && (
                <div className="pt-4 text-center">
                  <Link
                    to="/register"
                    className="inline-block  bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#e55a2b] transition"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side - Image Slider */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Image Slider */}
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className={`w-full rounded-lg shadow-xl transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                    }`}
                  />
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-2 rounded-full transition shadow-lg"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-2 rounded-full transition shadow-lg"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-[#FF6B35] w-6'
                          : 'bg-gray-400 hover:bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="bg-gray-50 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Our Leadership Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Meet the dedicated leaders working tirelessly for the rights and welfare of workers across India
          </p>

          {/* Auto-scrolling container with manual controls */}
          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.querySelector('.leadership-scroll-content');
                container.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-[#FF6B35]" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.querySelector('.leadership-scroll-content');
                container.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-[#FF6B35]" />
            </button>

            <div className="leadership-scroll-container">
              <div className="leadership-scroll-content">
                {/* Duplicate the array to create seamless loop */}
                {[...leadershipTeam, ...leadershipTeam].map((leader, index) => (
                  <div
                    key={`${leader.id}-${index}`}
                    className="leadership-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex-shrink-0"
                    style={{ width: 'calc(25% - 1.5rem)' }}
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
          </div>
        </div>

        {/* Add CSS for auto-scrolling animation */}
        <style>{`
          .leadership-scroll-container {
            overflow-x: auto;
            overflow-y: hidden;
            width: 100%;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }

          .leadership-scroll-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }

          .leadership-scroll-content {
            display: flex;
            gap: 2rem;
            animation: scroll 10s linear infinite;
          }

          .leadership-scroll-content:hover {
            animation-play-state: paused;
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 768px) {
            .leadership-card {
              width: calc(50% - 1rem) !important;
            }
          }

          @media (max-width: 480px) {
            .leadership-card {
              width: calc(100% - 1rem) !important;
            }
          }
        `}</style>
      </section>

      {/* Call to Action Section */}
      {!user && (
        <section className="bg-[#FF6B35] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Us Today!
            </h2>
            <p className="text-xl text-white mb-8">
              Become a member of ODIA INTERSTATE MIGRANT WORKERS UNION and get access to exclusive benefits
            </p>
            <Link
              to="/register"
              className="bg-white text-[#FF6B35] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
            >
              Register Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

