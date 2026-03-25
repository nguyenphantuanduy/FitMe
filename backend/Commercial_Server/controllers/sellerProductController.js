const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const { Seller, Product } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "fitme_secret";

// =========================
// GET PRODUCTS
// =========================

exports.getProducts = async (req, res) => {
  try {
    const token = req.cookies?.fitme_auth;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "JWT không hợp lệ hoặc hết hạn" });
    }

    const { uuid: user_uuid } = payload;

    // Kiểm tra seller
    const seller = await Seller.findOne({
      where: { user_uuid },
    });

    if (!seller)
      return res.status(403).json({ message: "Người dùng không phải seller" });

    // Lấy product trực tiếp (không qua Sell nữa)
    const products = await Product.findAll({
      where: {
        seller_uuid: seller.user_uuid,
      },
      order: [["product_id", "DESC"]],
    });

    // Thêm URL ảnh
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

    res.status(200).json({ products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// =========================
// UPLOAD PRODUCT
// =========================

exports.uploadProduct = async (req, res) => {
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

    const { uuid: user_uuid } = payload;

    // Kiểm tra seller
    const seller = await Seller.findOne({
      where: { user_uuid },
    });

    if (!seller)
      return res.status(403).json({
        message: "Người dùng không phải seller",
      });

    // Lấy dữ liệu
    const { name, description, cost, type } = req.body;

    if (!name || !cost || !type) {
      return res.status(400).json({
        message: "Thiếu thông tin sản phẩm",
      });
    }

    // Kiểm tra 2 ảnh
    if (!req.files || !req.files.front || !req.files.back) {
      return res.status(400).json({
        message: "Cần upload 2 ảnh front và back",
      });
    }

    // =========================
    // Tạo product_id tiếp theo
    // =========================

    const lastProduct = await Product.findOne({
      where: {
        seller_uuid: seller.user_uuid,
      },
      order: [["product_id", "DESC"]],
    });

    const nextProductId = lastProduct ? lastProduct.product_id + 1 : 1;

    // =========================
    // Lưu ảnh
    // =========================

    const frontFile = req.files.front[0];

    const backFile = req.files.back[0];

    const frontExt = path.extname(frontFile.originalname);

    const backExt = path.extname(backFile.originalname);

    const frontFilename = `${seller.user_uuid}_${nextProductId}_front${frontExt}`;

    const backFilename = `${seller.user_uuid}_${nextProductId}_back${backExt}`;

    const frontDest = path.join(__dirname, "../img", frontFilename);

    const backDest = path.join(__dirname, "../img", backFilename);

    fs.renameSync(frontFile.path, frontDest);

    fs.renameSync(backFile.path, backDest);

    // =========================
    // Tạo Product
    // =========================

    const newProduct = await Product.create({
      seller_uuid: seller.user_uuid,
      product_id: nextProductId,

      name,
      description,
      cost,
      type,

      front_img_path: frontFilename,

      back_img_path: backFilename,
    });

    const productResponse = newProduct.toJSON();

    productResponse.front_img =
      `${req.protocol}://${req.get("host")}/img/` + frontFilename;

    productResponse.back_img =
      `${req.protocol}://${req.get("host")}/img/` + backFilename;

    res.status(201).json({
      message: "Upload sản phẩm thành công",
      product: productResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
