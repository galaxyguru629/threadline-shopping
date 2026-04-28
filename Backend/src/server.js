const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { mapProductSummary } = require("./data/products");
const { connectToDatabase } = require("./db");
const { seedProductsIfEmpty } = require("./seedProducts");
const Product = require("./models/Product");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/products", (_request, response) => {
  Product.find({})
    .lean()
    .then((products) => {
      const categories = [...new Set(products.map((product) => product.category))];

      response.json({
        categories,
        products: products.map(mapProductSummary),
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Failed to load products.", error: error.message });
    });
});

app.get("/api/products/:productId", (request, response) => {
  Product.findOne({ id: request.params.productId })
    .lean()
    .then((product) => {
      if (!product) {
        response.status(404).json({ message: "Product not found." });
        return;
      }

      response.json({ product });
    })
    .catch((error) => {
      response.status(500).json({ message: "Failed to load product.", error: error.message });
    });
});

async function startServer() {
  try {
    await connectToDatabase();
    await seedProductsIfEmpty();

    app.listen(PORT, () => {
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error.message);
    process.exit(1);
  }
}

startServer();
