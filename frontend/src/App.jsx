import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import RegisterSeller from "./pages/RegisterSeller";
import UploadProductDashboard from "./pages/UploadProductDashboard";

// ⭐ NEW
import VirtualTryOn from "./pages/VirtualTryOn";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra JWT cookie khi App load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });

        setUserRole(res.data.user.role);
      } catch {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // =========================
  // Protected Route
  // =========================

  const ProtectedRoute = ({ role, children }) => {
    if (loading) return <div>Loading...</div>;

    if (!userRole) return <Navigate to="/login" replace />;

    if (role && userRole !== role) return <Navigate to="/" replace />;

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Login / Register */}

        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        <Route path="/register" element={<Register />} />

        {/* Customer Dashboard */}

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />

        {/* ⭐ Virtual Try-on */}

        <Route
          path="/virtual-tryon"
          element={
            <ProtectedRoute>
              <VirtualTryOn />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard */}

        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />

        {/* Upload Product */}

        <Route
          path="/upload-product"
          element={
            <ProtectedRoute role="seller">
              <UploadProductDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />

        {/* Register Seller */}

        <Route
          path="/register-seller"
          element={<RegisterSeller setUserRole={setUserRole} />}
        />

        {/* Fallback */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
