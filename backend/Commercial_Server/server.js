const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const sellerRoutes = require("./routes/sellerRoutes");

const sellerProductRoutes = require("./routes/sellerProductRoutes");

// ✅ THÊM DÒNG NÀY
const productRoutes = require("./routes/productRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());

// Serve images
app.use("/img", express.static(path.join(__dirname, "img")));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/seller", sellerRoutes);

app.use("/api/seller", sellerProductRoutes);

// ✅ THÊM DÒNG NÀY
app.use("/api", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
