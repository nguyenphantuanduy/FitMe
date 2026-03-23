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

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // <--- trạng thái loading khi kiểm tra JWT

  // Kiểm tra JWT cookie khi App load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        setUserRole(res.data.user.role); // cập nhật role nếu JWT hợp lệ
      } catch {
        setUserRole(null); // chưa login hoặc JWT không hợp lệ
      } finally {
        setLoading(false); // đã kiểm tra xong
      }
    };
    checkUser();
  }, []);

  // Component bảo vệ route theo role
  const ProtectedRoute = ({ role, children }) => {
    if (loading) return <div>Loading...</div>; // <--- chờ check JWT xong
    if (!userRole) return <Navigate to="/login" replace />; // chưa login
    if (role && userRole !== role) return <Navigate to="/" replace />; // role không phù hợp
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Trang Home */}
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

        {/* Seller Dashboard */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />

        {/* Upload Product Dashboard */}
        <Route
          path="/upload-product"
          element={
            <ProtectedRoute role="seller">
              <UploadProductDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />

        {/* Đăng ký Seller */}
        <Route
          path="/register-seller"
          element={<RegisterSeller setUserRole={setUserRole} />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
