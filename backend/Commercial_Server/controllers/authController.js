const User = require("../models/User");
const Customer = require("../models/Customer");
const Seller = require("../models/Seller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // thêm JWT

const JWT_SECRET = process.env.JWT_SECRET || "fitme_secret"; // bí mật server, nên đặt trong .env

// Hàm register
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      first_name,
      last_name,
      address,
      phone_number,
      gender,
      birthday,
    } = req.body;

    // 1️⃣ Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại!" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Tạo user mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      address,
      phone_number,
    });

    // 4️⃣ Tạo customer mới liên kết với user vừa tạo
    await Customer.create({
      user_uuid: newUser.uuid,
      gender,
      birthday,
    });

    // 5️⃣ Trả response thành công
    res.status(201).json({
      message: "Đăng ký thành công!",
      user: { uuid: newUser.uuid, username: newUser.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hàm login với JWT
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập username và password" });

    // 1️⃣ Tìm user
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(401).json({ message: "Username hoặc password sai" });

    // 2️⃣ So sánh password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Username hoặc password sai" });

    // 3️⃣ Xác định role
    let role = "customer";

    const customer = await Customer.findOne({
      where: { user_uuid: user.uuid },
    });
    if (!customer)
      return res.status(403).json({ message: "Người dùng không hợp lệ" });

    const seller = await Seller.findOne({ where: { user_uuid: user.uuid } });
    if (seller) role = "seller";

    // 4️⃣ Tạo JWT
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username, role },
      JWT_SECRET,
      { expiresIn: "1d" }, // token hết hạn sau 1 ngày
    );

    // 5️⃣ Gửi cookie với JWT
    res.cookie("fitme_auth", token, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // 6️⃣ Trả response
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        uuid: user.uuid,
        username: user.username,
        role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
