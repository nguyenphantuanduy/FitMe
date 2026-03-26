import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import RegisterSeller from "./pages/seller/RegisterSeller";
import UploadProductDashboard from "./pages/seller/UploadProductDashboard";

// ⭐ NEW
import VirtualTryOn from "./pages/tryOnApp/VirtualTryOn";

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
        {/* Root redirect */}
        <Route
          path="/"
          element={
            loading ? (
              <div>Loading...</div>
            ) : userRole ? (
              <Navigate to="/customer-dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login / Register */}
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
