const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

// =========================
// GET TOPS
// =========================

router.get("/products/:type", productController.getProductsByType);

module.exports = router;
