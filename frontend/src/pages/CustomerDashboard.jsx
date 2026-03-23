import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerDashboard({ userRole }) {
  const navigate = useNavigate();

  const handleGoSeller = async () => {
    if (userRole === "seller") {
      navigate("/seller-dashboard");
    } else {
      // Chưa phải seller → chuyển sang trang đăng ký seller
      navigate("/register-seller");
    }
  };

  return (
    <div className="page-container">
      <h2>Customer Dashboard</h2>
      <button onClick={handleGoSeller}>Seller Dashboard</button>
    </div>
  );
}

export default CustomerDashboard;
