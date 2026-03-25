const jwt = require("jsonwebtoken");

const { Product } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "fitme_secret";

// =========================
// GET PRODUCTS BY TYPE
// =========================

exports.getProductsByType = async (req, res) => {
  try {
    const token = req.cookies?.fitme_auth;

    if (!token)
      return res.status(401).json({
        message: "Chưa đăng nhập",
      });

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "JWT không hợp lệ hoặc hết hạn",
      });
    }

    // Lấy type từ URL
    const { type } = req.params;

    // Kiểm tra type hợp lệ
    const validTypes = ["tops", "bottoms", "one-pieces"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Type không hợp lệ",
      });
    }

    // Lấy products
    const products = await Product.findAll({
      where: { type },
      order: [["sell_date", "DESC"]],
    });

    // Tạo URL ảnh
    const result = products.map((p) => {
      const product = p.toJSON();

      if (product.front_img_path) {
        product.front_img =
          `${req.protocol}://${req.get("host")}/img/` + product.front_img_path;
      }

      if (product.back_img_path) {
        product.back_img =
          `${req.protocol}://${req.get("host")}/img/` + product.back_img_path;
      }

      return product;
    });

    res.status(200).json({
      products: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
