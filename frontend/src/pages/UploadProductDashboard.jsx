// src/pages/UploadProductDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadProductDashboard() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [type, setType] = useState("tops");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle upload file
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Reset form
  const handleReset = () => {
    setName("");
    setDescription("");
    setCost("");
    setType("tops");
    setFile(null);
    setPreview(null);
  };

  // Upload product
  const handleUpload = async () => {
    if (!name || !cost || !type || !file) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ảnh");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("cost", cost);
      formData.append("type", type);
      formData.append("image", file); // phải trùng với backend

      const res = await axios.post(
        "http://localhost:3000/api/seller/products",
        formData,
        { withCredentials: true },
      );

      alert("Upload thành công: " + res.data.product.name);
      handleReset();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Upload Product</h2>

      <div className="form-group">
        <label>Tên sản phẩm:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Giá:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Loại:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="one-pieces">One-pieces</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ảnh sản phẩm:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" width={150} />}
      </div>

      {/* ========== BUTTONS ========== */}
      <div className="form-buttons">
        <button onClick={handleUpload}>Upload</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => navigate("/seller-dashboard")}>
          Quay lại Dashboard
        </button>
      </div>
    </div>
  );
}

export default UploadProductDashboard;
