DROP TABLE IF EXISTS fitme_db.users;
CREATE TABLE fitme_db.users (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(255),
    id_card VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS fitme_db.admins;
CREATE TABLE fitme_db.admins (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Xóa bảng customer nếu đã tồn tại
DROP TABLE IF EXISTS fitme_db.customer;

-- Tạo bảng customer
CREATE TABLE fitme_db.customer (
    user_id BINARY(16) PRIMARY KEY,
    loyalty_points INT DEFAULT 0,
    membership_level ENUM('bronze','silver','gold','platinum') DEFAULT 'bronze',
    total_orders INT DEFAULT 0,
    birthday DATE NULL,
    gender ENUM('male','female','other') NULL,
    newsletter_opt_in BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Xóa bảng seller nếu đã tồn tại
DROP TABLE IF EXISTS fitme_db.seller;

-- Tạo bảng seller
CREATE TABLE fitme_db.seller (
    user_id BINARY(16) PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,
    shop_description TEXT,
    shop_logo VARCHAR(255),
    shop_rating DECIMAL(3,2) DEFAULT 0.0,
    total_products INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);