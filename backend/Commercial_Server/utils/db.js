const { Sequelize } = require("sequelize");
require("dotenv").config(); // load biến môi trường từ .env

// Tạo kết nối PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME, // tên database
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST || "localhost", // host, mặc định localhost
    dialect: "postgres", // loại database
    logging: false, // tắt log SQL, nếu muốn bật set true
  },
);

// Test kết nối
sequelize
  .authenticate()
  .then(() => console.log("✅ Kết nối PostgreSQL thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối PostgreSQL:", err));

module.exports = sequelize;
