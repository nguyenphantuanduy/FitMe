import React from "react";
import { useNavigate } from "react-router-dom";

function CustomerDashboard({ userRole }) {
  const navigate = useNavigate();

  const handleGoSeller = () => {
    if (userRole === "seller") {
      navigate("/seller-dashboard");
    } else {
      navigate("/register-seller");
    }
  };

  // ⭐ NEW
  const handleVirtualTryOn = () => {
    navigate("/virtual-tryon");
  };

  return (
    <div className="page-container">
      <h2>Customer Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button onClick={handleGoSeller}>Seller Dashboard</button>

        {/* ⭐ NEW BUTTON */}

        <button onClick={handleVirtualTryOn}>Virtual Try-on</button>
      </div>
    </div>
  );
}

export default CustomerDashboard;
