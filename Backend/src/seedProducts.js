const Category = require("./models/Category");
const Product = require("./models/Product");
const Variant = require("./models/Variant");
const ProductImage = require("./models/ProductImage");
const Listing = require("./models/Listing");
const ListingImage = require("./models/ListingImage");
const { products: seedProducts } = require("./data/products");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function clearAllCatalogCollections() {
  await Promise.all([
    ListingImage.deleteMany({}),
    Listing.deleteMany({}),
    Variant.deleteMany({}),
    ProductImage.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
  ]);
}

async function upsertCategoryByName(name) {
  const categoryId = slugify(name);
  let category = await Category.findOne({ id: categoryId });

  if (!category) {
    category = await Category.create({
      id: categoryId,
      name,
      parent_id: null,
    });
  }

  return category;
}

async function seedOneProduct(productSeed) {
  const category = await upsertCategoryByName(productSeed.category);
  const brandId = slugify(productSeed.brand);

  const product = await Product.create({
    id: productSeed.id,
    name: productSeed.name,
    brand_id: brandId,
    brand_name: productSeed.brand,
    category_id: category._id,
    short_description: productSeed.shortDescription,
    description: productSeed.description,
    featured_score: productSeed.featuredScore,
    created_at: new Date(productSeed.createdAt),
  });

  await ProductImage.insertMany(
    productSeed.images.map((url, index) => ({
      id: `${productSeed.id}-img-${index + 1}`,
      product_id: product._id,
      url,
    }))
  );

  const variant = await Variant.create({
    id: `${productSeed.id}-variant-1`,
    product_id: product._id,
    size: productSeed.sizeInfo,
    color: "default",
  });

  for (const [index, offer] of productSeed.offers.entries()) {
    const listing = await Listing.create({
      id: offer.id,
      seller_id: slugify(offer.sellerName),
      seller_name: offer.sellerName,
      seller_location: offer.location,
      seller_rating: offer.rating,
      seller_sales_count: offer.salesCount,
      variant_id: variant._id,
      product_id: product._id,
      price: offer.price,
      condition: productSeed.condition,
      quantity: 1,
      tags: offer.tags,
      note: offer.note,
    });

    const listingImageUrl = productSeed.images[index % productSeed.images.length];
    await ListingImage.create({
      id: `${offer.id}-img-1`,
      listing_id: listing._id,
      url: listingImageUrl,
    });
  }
}

async function seedProductsIfNeeded() {
  const hasProducts = (await Product.countDocuments()) > 0;

  if (hasProducts) {
    const hasLegacyProducts = (await Product.countDocuments({ category_id: { $exists: false } })) > 0;

    if (!hasLegacyProducts) {
      return;
    }
  }

  await clearAllCatalogCollections();

  for (const product of seedProducts) {
    await seedOneProduct(product);
  }

  console.log(`Seeded ${seedProducts.length} products using normalized schema.`);
}

module.exports = {
  seedProductsIfNeeded,
};
