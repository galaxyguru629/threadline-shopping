const { products: seedProducts } = require("./data/products");

function mapSeedToListSummary(product) {
  const prices = product.offers.map((offer) => offer.price);

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    condition: product.condition,
    shortDescription: product.shortDescription,
    images: product.images,
    lowestPrice: Math.min(...prices),
    offerCount: product.offers.length,
    featuredScore: product.featuredScore,
    createdAt: product.createdAt,
  };
}

function mapSeedToDetail(product) {
  return {
    product: {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      condition: product.condition,
      sizeInfo: product.sizeInfo,
      shortDescription: product.shortDescription,
      description: product.description,
      featuredScore: product.featuredScore,
      createdAt: product.createdAt,
      images: product.images,
      offers: product.offers.map((offer, index) => ({
        id: offer.id,
        sellerName: offer.sellerName,
        location: offer.location,
        rating: offer.rating,
        salesCount: offer.salesCount,
        price: offer.price,
        condition: product.condition,
        quantity: 1,
        tags: offer.tags,
        note: offer.note,
        image: product.images[index % product.images.length],
      })),
    },
  };
}

function getList() {
  const mappedProducts = seedProducts.map(mapSeedToListSummary);
  const categories = [...new Set(mappedProducts.map((product) => product.category))];

  return {
    categories,
    products: mappedProducts,
  };
}

function getById(productId) {
  const product = seedProducts.find((item) => item.id === productId);
  return product ? mapSeedToDetail(product) : null;
}

module.exports = {
  getList,
  getById,
};
