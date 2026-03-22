class User {
  constructor({
    id,
    username,
    passwordHash, // nên trùng với cột DB password_hash
    firstName,
    lastName,
    address,
    idCard,
    phone,
    createdAt, // nếu muốn lấy created_at từ DB
    lastLogin,
  }) {
    this.id = id; // auto-increment trong DB
    this.username = username; // để login
    this.passwordHash = passwordHash; // lưu hash, không lưu plain text
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.idCard = idCard;
    this.phone = phone;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }
}

module.exports = User;
