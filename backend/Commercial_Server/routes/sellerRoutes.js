const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

// POST /api/seller/register
router.post("/register", sellerController.registerSeller);

module.exports = router;
