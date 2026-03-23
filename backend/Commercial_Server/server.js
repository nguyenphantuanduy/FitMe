const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // cần để đọc cookie
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const sellerProductRoutes = require("./routes/sellerProductRoutes");

const app = express();

// CORS để frontend có thể gửi cookie
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());

// Serve folder ảnh public để frontend load img
app.use("/img", express.static(path.join(__dirname, "img")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller", sellerProductRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
