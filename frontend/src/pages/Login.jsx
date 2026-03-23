import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUserRole }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true },
      );

      setMessage(res.data.message);

      // Lưu role vào App state (dùng sau)
      if (setUserRole) setUserRole(res.data.user.role);

      // Chuyển luôn sang Customer Dashboard bất kể role
      navigate("/customer-dashboard");
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div className="page-container">
      <h2>Đăng nhập FitMe</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
