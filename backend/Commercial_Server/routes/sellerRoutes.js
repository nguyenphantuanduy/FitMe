const express = require("express");
const router = express.Router();
const multer = require("multer");
const sellerProductController = require("../controllers/sellerProductController");

// Multer tạm lưu file upload trước khi rename
const upload = multer({ dest: "./temp_uploads/" });

// GET: lấy sản phẩm
router.get("/products", sellerProductController.getProducts);

// POST: upload sản phẩm mới
router.post(
  "/products",
  upload.single("image"), // tên trường file từ form-data: 'image'
  sellerProductController.uploadProduct,
);

module.exports = router;
