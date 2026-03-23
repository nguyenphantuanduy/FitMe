import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Lấy sản phẩm seller
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/seller/products",
          { withCredentials: true },
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        alert("Không thể lấy danh sách sản phẩm");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Seller Dashboard</h2>
        <div>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => navigate("/customer-dashboard")}
          >
            Customer Dashboard
          </button>
          <button onClick={() => navigate("/upload-product")}>
            Upload Product
          </button>
        </div>
      </div>

      <h3>Sản phẩm đang bán:</h3>
      {products.length === 0 ? (
        <p>Chưa có sản phẩm nào</p>
      ) : (
        <div
          className="product-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.uuid}
              className="product-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px", // tăng chiều ngang card
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <p>Giá: {Number(p.cost).toLocaleString()}₫</p>
                <p>Loại: {p.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
