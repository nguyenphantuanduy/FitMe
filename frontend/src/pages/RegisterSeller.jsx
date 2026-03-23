import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterSeller({ setUserRole }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shop_name: "",
    shop_description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/seller/register",
        formData,
        { withCredentials: true }, // cookie JWT sẽ được gửi
      );

      setMessage(res.data.message);

      // 1️⃣ Cập nhật role mới cho App
      setUserRole("seller");

      // 2️⃣ Điều hướng sang SellerDashboard
      navigate("/seller-dashboard");
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div className="page-container">
      <h2>Đăng ký Seller</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="shop_name"
          placeholder="Tên cửa hàng"
          value={formData.shop_name}
          onChange={handleChange}
          required
        />
        <textarea
          name="shop_description"
          placeholder="Mô tả cửa hàng"
          value={formData.shop_description}
          onChange={handleChange}
        />
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RegisterSeller;
