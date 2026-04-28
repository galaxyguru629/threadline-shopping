const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectToDatabase } = require("./db");
const { seedProductsIfNeeded } = require("./seedProducts");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Variant = require("./models/Variant");
const ProductImage = require("./models/ProductImage");
const Listing = require("./models/Listing");
const ListingImage = require("./models/ListingImage");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

function mapSummaryFromRelations(product, categoryName, images, listings) {
  const prices = listings.map((listing) => listing.price);
  const lowestPrice = Math.min(...prices);

  return {
    id: product.id,
    name: product.name,
    brand: product.brand_name,
    category: categoryName,
    condition: listings[0]?.condition || "good",
    shortDescription: product.short_description,
    images,
    lowestPrice,
    offerCount: listings.length,
    featuredScore: product.featured_score,
    createdAt: product.created_at,
  };
}

app.get("/api/products", (_request, response) => {
  Product.find({})
    .lean()
    .then(async (products) => {
      const productObjectIds = products.map((product) => product._id);
      const categoryObjectIds = [...new Set(products.map((product) => String(product.category_id)))];

      const [categories, images, listings] = await Promise.all([
        Category.find({ _id: { $in: categoryObjectIds } }).lean(),
        ProductImage.find({ product_id: { $in: productObjectIds } }).lean(),
        Listing.find({ product_id: { $in: productObjectIds } }).lean(),
      ]);

      const categoryById = new Map(categories.map((category) => [String(category._id), category]));
      const imagesByProductId = new Map();
      const listingsByProductId = new Map();

      for (const image of images) {
        const key = String(image.product_id);
        const current = imagesByProductId.get(key) || [];
        current.push(image.url);
        imagesByProductId.set(key, current);
      }

      for (const listing of listings) {
        const key = String(listing.product_id);
        const current = listingsByProductId.get(key) || [];
        current.push(listing);
        listingsByProductId.set(key, current);
      }

      const mappedProducts = products
        .map((product) => {
          const productListings = listingsByProductId.get(String(product._id)) || [];

          if (productListings.length === 0) {
            return null;
          }

          const category = categoryById.get(String(product.category_id));

          return mapSummaryFromRelations(
            product,
            category?.name || "Unknown",
            imagesByProductId.get(String(product._id)) || [],
            productListings
          );
        })
        .filter(Boolean);

      const categoriesForFilter = [...new Set(mappedProducts.map((product) => product.category))];

      response.json({
        categories: categoriesForFilter,
        products: mappedProducts,
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Failed to load products.", error: error.message });
    });
});

app.get("/api/products/:productId", (request, response) => {
  Product.findOne({ id: request.params.productId })
    .lean()
    .then(async (product) => {
      if (!product) {
        response.status(404).json({ message: "Product not found." });
        return;
      }

      const [category, variants, listings, images] = await Promise.all([
        Category.findById(product.category_id).lean(),
        Variant.find({ product_id: product._id }).lean(),
        Listing.find({ product_id: product._id }).sort({ price: 1 }).lean(),
        ProductImage.find({ product_id: product._id }).lean(),
      ]);

      const listingIds = listings.map((listing) => listing._id);
      const listingImages = await ListingImage.find({ listing_id: { $in: listingIds } }).lean();
      const listingImageByListingId = new Map(
        listingImages.map((image) => [String(image.listing_id), image.url])
      );

      const sizeInfo = [...new Set(variants.map((variant) => variant.size))].join(", ");

      response.json({
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand_name,
          category: category?.name || "Unknown",
          condition: listings[0]?.condition || "good",
          sizeInfo: sizeInfo || "One size",
          shortDescription: product.short_description,
          description: product.description,
          featuredScore: product.featured_score,
          createdAt: product.created_at,
          images: images.map((image) => image.url),
          offers: listings.map((listing) => ({
            id: listing.id,
            sellerName: listing.seller_name,
            location: listing.seller_location,
            rating: listing.seller_rating,
            salesCount: listing.seller_sales_count,
            price: listing.price,
            condition: listing.condition,
            quantity: listing.quantity,
            tags: listing.tags,
            note: listing.note,
            image: listingImageByListingId.get(String(listing._id)) || null,
          })),
        },
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Failed to load product.", error: error.message });
    });
});

async function startServer() {
  try {
    await connectToDatabase();
    await seedProductsIfNeeded();

    app.listen(PORT, () => {
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error.message);
    process.exit(1);
  }
}

startServer();
