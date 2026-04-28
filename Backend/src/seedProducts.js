const Product = require("./models/Product");
const { products } = require("./data/products");

async function seedProductsIfEmpty() {
  const total = await Product.countDocuments();

  if (total > 0) {
    return;
  }

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products into MongoDB.`);
}

module.exports = {
  seedProductsIfEmpty,
};
