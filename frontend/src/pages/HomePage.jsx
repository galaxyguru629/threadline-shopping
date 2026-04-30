import { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../lib/api";

const initialFilters = {
  search: "",
  category: "all",
  condition: "all",
  sort: "featured",
};
const heroImagePath = "/src/assets/image/hero.jpg";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((data) => {
        if (!active) {
          return;
        }

        setProducts(data.products);
        setCategories(data.categories);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          filters.search === "" ||
          `${product.name} ${product.brand} ${product.shortDescription}`
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        const matchesCategory =
          filters.category === "all" || product.category === filters.category;

        const matchesCondition =
          filters.condition === "all" || product.condition === filters.condition;

        return matchesSearch && matchesCategory && matchesCondition;
      })
      .sort((first, second) => {
        switch (filters.sort) {
          case "priceAsc":
            return first.lowestPrice - second.lowestPrice;
          case "priceDesc":
            return second.lowestPrice - first.lowestPrice;
          case "recent":
            return new Date(second.createdAt) - new Date(first.createdAt);
          default:
            return second.featuredScore - first.featuredScore;
        }
      });
  }, [filters, products]);

  const previewProducts = useMemo(() => visibleProducts.slice(0, 5), [visibleProducts]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={heroImagePath} alt="Fashion marketplace hero" className="h-[400px] w-full object-cover sm:h-[600px]" />
        <div className="absolute inset-0 bg-slate-900/20" />

        <div className="absolute left-6 top-1/2 z-10 w-full max-w-sm -translate-y-1/3  p-5">
          <h1 className="text-4xl text-white font-bold text-slate-900">Ready to declutter your closet?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 text-white">
            Sell clothes, shoes, and hats through product sheets that buyers instantly understand.
          </p>
          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Sell now
          </button>
        </div>
      </section>

      {/* <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {previewProducts.map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <p className="truncate px-3 py-2 text-xs font-medium text-slate-700">{product.name}</p>
          </div>
        ))}
      </section> */}

      <div className="mt-8">
        <FilterBar
          filters={filters}
          categories={categories}
          onSearchChange={(search) => setFilters((current) => ({ ...current, search }))}
          onCategoryChange={(category) => setFilters((current) => ({ ...current, category }))}
          onConditionChange={(condition) => setFilters((current) => ({ ...current, condition }))}
          onSortChange={(sort) => setFilters((current) => ({ ...current, sort }))}
        />
      </div>

      {status === "loading" ? (
        <p className="mt-8 text-slate-600">Loading products...</p>
      ) : null}

      {status === "error" ? (
        <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          The frontend could not load the backend data. Make sure the API is running on
          `localhost:5000`.
        </div>
      ) : null}

      {status === "ready" ? (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                {visibleProducts.length} matching products for this demo selection.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {visibleProducts.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No products match your filters yet. Try another search or category.
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
