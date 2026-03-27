-- Drop bảng con trước
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS seller CASCADE;

-- Drop bảng chính
DROP TABLE IF EXISTS users CASCADE;

-- Drop ENUM type
DROP TYPE IF EXISTS product_type;

-- Drop extension (không bắt buộc, thường giữ lại)
-- DROP EXTENSION IF EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE product_type AS ENUM ('tops', 'bottoms', 'one-pieces');
CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
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
    seller_uuid UUID NOT NULL,

    product_id INTEGER NOT NULL,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    cost NUMERIC(10,2) NOT NULL,

    front_img_path TEXT,
    back_img_path TEXT,

    type product_type NOT NULL,

    sell_date TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (seller_uuid, product_id),

    FOREIGN KEY (seller_uuid)
        REFERENCES seller(user_uuid)
        ON DELETE CASCADE
);

INSERT INTO users (
    uuid, username, email, password, first_name, last_name, address, phone_number, created_at
) VALUES
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    'duynguyen',
    'duynguyen@gmail.com',
    '$2b$10$3/q0ce.0znZIErsFB.VY0uWwHbzu4pVyC2RX8DQc9zxdF1GtaqBbi',
    'Duy',
    'Nguyễn',
    NULL,
    NULL,
    '2026-03-27 02:26:50.45'
),
(
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5',
    'anhpham',
    'anhpham@gmail.com',
    '$2b$10$iWK2tkfpGyQ.bex.0aPhXOF5x2Ue4lL0I5XJ4eNmMhItymGm54f5m',
    'Anh',
    'Phạm',
    NULL,
    NULL,
    '2026-03-27 03:10:04.286'
);

INSERT INTO customer (
    user_uuid, gender, birthday
) VALUES
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    NULL,
    NULL
),
(
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5',
    NULL,
    NULL
);

INSERT INTO seller (
    user_uuid, shop_name, shop_description, joined_at
) VALUES
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    'Élégance Mode',
    'Élégance Mode is a fashion brand dedicated to elegance and sophistication in every detail. We offer modern, refined clothing that complements a dynamic lifestyle while preserving timeless style.',
    '2026-03-27 02:28:26.295'
),
(
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5',
    'Active Vibe',
    'Active Vibe is a fashion store for dynamic, modern individuals. From hoodies, joggers, sneakers to casual activewear, every item is designed to provide comfort, flexibility, and style. Whether at school, strolling the city, or light workouts, Active Vibe empowers you to confidently express your personality and active lifestyle.',
    '2026-03-27 03:11:33.933'
);

INSERT INTO product (
    seller_uuid, product_id, name, description, cost, front_img_path, back_img_path, type, sell_date
) VALUES
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    1,
    'Blanc Élégant',
    'Blanc Élégant is a refined white blazer, meticulously crafted from premium fabric to deliver elegance and modernity. With a tailored fit and sharp lines, it’s perfect for formal events, important meetings, or any moment you wish to shine. The perfect blend of classic style and contemporary flair, making it an essential piece in your wardrobe',
    1000000.00,
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_1_front.jpg',
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_1_back.webp',
    'tops',
    '2026-03-27 02:29:39.764'
),
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    2,
    'Polo Prestige',
    'Polo Prestige is a premium polo shirt, crafted from soft, breathable fabric for all-day comfort and elegance. With a tailored fit, refined collar, and precise stitching, it’s perfect for office, casual outings, or important meetings. The perfect blend of classic and modern style, making it an essential wardrobe staple.',
    200000.00,
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_2_front.webp',
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_2_back.avif',
    'tops',
    '2026-03-27 02:48:27.745'
),
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    3,
    'Maison Flow',
    'Maison Flow is a refined wide-leg trouser crafted from premium, soft, and breathable fabric, ensuring all-day comfort. Its flowing design is perfect for office, casual outings, or important meetings. A perfect blend of classic and modern style, making you feel confident and stand out wherever you go.',
    300000.00,
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_3_front.jpg',
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_3_back.jpg',
    'bottoms',
    '2026-03-27 03:04:02.155'
),
(
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691',
    4,
    'Rose Étoile',
    'Rose Étoile is an elegant pink evening gown, crafted from premium, soft, shimmering fabric that accentuates your glamour and femininity. The tailored fit and flowing skirt make it perfect for formal events, weddings, or grand soirées. A perfect blend of classic and contemporary style, letting you shine in every moment.',
    5000000.00,
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_4_front.jpg',
    '15c7b59b-3857-4b4b-a18a-b3b2efabb691_4_back.jpg',
    'one-pieces',
    '2026-03-27 03:07:46.514'
),
(
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5',
    1,
    'Kinetic Tee',
    'Kinetic Tee is a dynamic men’s sports T-shirt crafted from breathable, stretchy fabric, providing comfort during workouts or casual outings. With a modern, active design and comfortable fit, it’s perfect for a fast-paced lifestyle, letting you stay energized and confident throughout the day.',
    99998.00,
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5_1_front.avif',
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5_1_back.avif',
    'tops',
    '2026-03-27 03:15:00.74'
),
(
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5',
    2,
    'Shadow Windbreaker',
    'Shadow Windbreaker is a black hooded men’s windbreaker crafted from lightweight, wind-resistant, and breathable fabric. Its dynamic, ergonomic design with a protective hood makes it perfect for outdoor sports, city strolls, or chilly days. Modern and sporty style keeps you confident and stylish wherever you go.',
    250000.00,
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5_2_front.jpg',
    '8c398c4e-48f4-4383-bf60-ec8639a80ed5_2_back.jpg',
    'tops',
    '2026-03-27 03:17:54.806'
);