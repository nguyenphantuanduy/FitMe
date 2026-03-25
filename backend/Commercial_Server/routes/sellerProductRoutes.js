const express = require("express");
const router = express.Router();
const multer = require("multer");

const sellerProductController = require("../controllers/sellerProductController");

// Multer tạm lưu file
const upload = multer({
  dest: "./temp_uploads/",
});

// GET: lấy sản phẩm
router.get("/products", sellerProductController.getProducts);

// POST: upload sản phẩm mới
router.post(
  "/products",

  // ⚠️ SỬA ĐOẠN NÀY
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),

  sellerProductController.uploadProduct,
);

module.exports = router;
