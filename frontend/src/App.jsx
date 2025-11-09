import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import RenewMembership from "./pages/RenewMembership";
import AdminDashboard from "./pages/AdminDashboard";
import DownloadIdCard from "./pages/DownloadIdCard";
import DownloadReceipt from "./pages/DownloadReceipt";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Layout wrapper to conditionally show Navbar and Footer
function Layout({ children }) {
  const location = useLocation();

  // Pages without Navbar and Footer
  const noLayoutPages = [
    '/register',
    '/login',
    '/forgot-password',
    '/renew-membership',
    '/download-id-card',
    '/download-receipt',
    '/admin/dashboard',
    '/admin/users',
    '/admin/add-worker',
    '/admin/add-admin',
    '/admin/analytics',
    '/admin/messages',
    '/admin/delete-requests',
    '/superadmin/dashboard',
    '/superadmin/users',
    '/superadmin/add-user',
    '/superadmin/analytics',
    '/superadmin/messages',
    '/superadmin/delete-requests',
  ];

  const showLayout = !noLayoutPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main className={showLayout ? "flex-grow" : "min-h-screen"}>
        {children}
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Download Routes (accessible via email links) */}
              <Route path="/download-id-card/:userId" element={<DownloadIdCard />} />
              <Route path="/download-receipt/:userId" element={<DownloadReceipt />} />

              {/* Protected Worker Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["worker"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/renew-membership"
                element={
                  <ProtectedRoute allowedRoles={["worker"]}>
                    <RenewMembership />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#FF6B35",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
