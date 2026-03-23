import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Chào mừng đến FitMe!</h1>
      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
        <button onClick={() => navigate("/register")}>Đăng ký</button>
      </div>
    </div>
  );
}

export default Home;
