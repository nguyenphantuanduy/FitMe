const Seller = require("./Seller");
const Product = require("./Product");
const Sell = require("./Sell");

// Quan hệ
Seller.hasMany(Sell, { foreignKey: "seller_uuid" });
Sell.belongsTo(Seller, { foreignKey: "seller_uuid" });

Product.hasMany(Sell, { foreignKey: "product_uuid" });
Sell.belongsTo(Product, { foreignKey: "product_uuid" });

module.exports = { Seller, Product, Sell };
