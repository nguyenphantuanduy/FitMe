CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE product_type AS ENUM ('tops', 'bottoms', 'one-pieces');
CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address TEXT,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE customer (
    user_uuid UUID PRIMARY KEY REFERENCES users(uuid) ON DELETE CASCADE,
    gender VARCHAR(10) CHECK (gender IN ('male','female','other')),
    birthday DATE
);
CREATE TABLE seller (
    user_uuid UUID PRIMARY KEY REFERENCES users(uuid) ON DELETE CASCADE,
    shop_name VARCHAR(100) NOT NULL,
    shop_description TEXT,
    joined_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE product (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost NUMERIC(10,2) NOT NULL,
    img_path TEXT,
    type product_type NOT NULL
);
CREATE TABLE sell (
    seller_uuid UUID REFERENCES seller(user_uuid) ON DELETE CASCADE,
    product_uuid UUID REFERENCES product(uuid) ON DELETE CASCADE,
    sell_date TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (seller_uuid, product_uuid)
);