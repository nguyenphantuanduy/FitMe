import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    address: "",
    phone_number: "",
    gender: "male",
    birthday: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
      );
      setMessage(res.data.message);
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div className="page-container">
      <h2>Đăng ký tài khoản FitMe</h2>
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
        <input
          type="text"
          name="first_name"
          placeholder="Họ"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Tên"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Số điện thoại"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={() => navigate("/")}>Quay lại</button>
    </div>
  );
}

export default Register;
