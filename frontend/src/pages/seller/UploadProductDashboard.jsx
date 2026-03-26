import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadProductDashboard() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [type, setType] = useState("tops");

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  // ===== FRONT IMAGE =====

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
  };

  // ===== BACK IMAGE =====

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    setBackFile(file);
    setBackPreview(URL.createObjectURL(file));
  };

  // ===== RESET =====

  const handleReset = () => {
    setName("");
    setDescription("");
    setCost("");
    setType("tops");

    setFrontFile(null);
    setBackFile(null);

    setFrontPreview(null);
    setBackPreview(null);
  };

  // ===== UPLOAD =====

  const handleUpload = async () => {
    if (!name || !cost || !type || !frontFile || !backFile) {
      alert("Vui lòng điền đầy đủ thông tin và chọn 2 ảnh");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("cost", cost);
      formData.append("type", type);

      // ⚠️ TÊN PHẢI TRÙNG BACKEND
      formData.append("front", frontFile);
      formData.append("back", backFile);

      const res = await axios.post(
        "http://localhost:3000/api/seller/products",
        formData,
        { withCredentials: true },
      );

      alert("Upload thành công!");

      handleReset();
    } catch (err) {
      console.error(err.response?.data || err);

      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Upload Product</h2>

      <div>
        <label>Tên sản phẩm:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Giá:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>

      <div>
        <label>Loại:</label>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="one-pieces">One-pieces</option>
        </select>
      </div>

      {/* FRONT IMAGE */}

      <div>
        <label>Front Image:</label>

        <input type="file" accept="image/*" onChange={handleFrontChange} />

        {frontPreview && (
          <img src={frontPreview} alt="Front Preview" width={150} />
        )}
      </div>

      {/* BACK IMAGE */}

      <div>
        <label>Back Image:</label>

        <input type="file" accept="image/*" onChange={handleBackChange} />

        {backPreview && (
          <img src={backPreview} alt="Back Preview" width={150} />
        )}
      </div>

      {/* BUTTONS */}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
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
