const express = require("express");
const cors = require("cors");
const { getCategories, mapProductSummary, products } = require("./data/products");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/products", (_request, response) => {
  response.json({
    categories: getCategories(),
    products: products.map(mapProductSummary),
  });
});

app.get("/api/products/:productId", (request, response) => {
  const product = products.find((entry) => entry.id === request.params.productId);

  if (!product) {
    response.status(404).json({ message: "Product not found." });
    return;
  }

  response.json({ product });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
