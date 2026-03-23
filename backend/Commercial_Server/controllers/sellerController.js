// controllers/sellerController.js
const Seller = require("../models/Seller");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fitme_secret";

// Đăng ký seller
exports.registerSeller = async (req, res) => {
  try {
    // 1️⃣ Lấy JWT từ cookie
    const token = req.cookies?.fitme_auth;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    // 2️⃣ Giải mã JWT
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "JWT không hợp lệ hoặc đã hết hạn" });
    }

    const { uuid: user_uuid, username } = payload;

    // 3️⃣ Kiểm tra user đã là seller chưa
    const existingSeller = await Seller.findOne({ where: { user_uuid } });
    if (existingSeller) {
      return res.status(400).json({ message: "Người dùng đã là Seller" });
    }

    // 4️⃣ Lấy dữ liệu seller từ body
    const { shop_name, shop_description } = req.body;
    if (!shop_name)
      return res.status(400).json({ message: "Vui lòng nhập tên cửa hàng" });

    // 5️⃣ Tạo seller mới
    const newSeller = await Seller.create({
      user_uuid,
      shop_name,
      shop_description,
    });

    // 6️⃣ Tạo JWT mới với role = seller
    const newToken = jwt.sign(
      { uuid: user_uuid, username, role: "seller" },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 7️⃣ Gửi cookie mới
    res.cookie("fitme_auth", newToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // 8️⃣ Trả response thành công
    res.status(201).json({
      message: "Đăng ký Seller thành công",
      seller: {
        user_uuid: newSeller.user_uuid,
        shop_name: newSeller.shop_name,
        shop_description: newSeller.shop_description,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
