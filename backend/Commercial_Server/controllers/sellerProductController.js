const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { Seller, Product, Sell } = require("../models");
const JWT_SECRET = process.env.JWT_SECRET || "fitme_secret";

// Lấy danh sách sản phẩm của seller
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
    const seller = await Seller.findOne({ where: { user_uuid } });
    if (!seller)
      return res.status(403).json({ message: "Người dùng không phải seller" });

    // Lấy danh sách sản phẩm qua bảng Sell
    const sells = await Sell.findAll({
      where: { seller_uuid: seller.user_uuid },
      include: [Product],
    });

    // Map ra product, thêm trường img dựa vào img_path
    const products = sells.map((s) => {
      const p = s.Product.toJSON(); // convert instance Sequelize sang object
      p.img = `${req.protocol}://${req.get("host")}/img/${p.img_path}`;
      return p;
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Upload sản phẩm mới
exports.uploadProduct = async (req, res) => {
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

    const seller = await Seller.findOne({ where: { user_uuid } });
    if (!seller)
      return res.status(403).json({ message: "Người dùng không phải seller" });

    // Dữ liệu product từ form
    const { name, description, cost, type } = req.body;
    if (!name || !cost || !type) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    // Kiểm tra file ảnh
    if (!req.file) return res.status(400).json({ message: "Chưa upload ảnh" });

    // Sinh uuid cho product và lưu ảnh
    const product_uuid = uuidv4();
    const ext = path.extname(req.file.originalname);
    const imgPath = `${product_uuid}${ext}`;
    const destPath = path.join(__dirname, "../img", imgPath);

    fs.renameSync(req.file.path, destPath);

    // Tạo product
    const newProduct = await Product.create({
      uuid: product_uuid,
      name,
      description,
      cost,
      type,
      img_path: imgPath,
    });

    // Tạo Sell record
    await Sell.create({
      seller_uuid: seller.user_uuid,
      product_uuid: product_uuid,
    });

    // Thêm img URL vào response
    const productResponse = newProduct.toJSON();
    productResponse.img = `${req.protocol}://${req.get("host")}/img/${productResponse.img_path}`;

    res.status(201).json({
      message: "Upload sản phẩm thành công",
      product: productResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
