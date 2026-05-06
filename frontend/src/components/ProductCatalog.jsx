import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../lib/api";

const initialFilters = {
  search: "",
  category: "all",
  condition: "all",
  sort: "featured",
};

export default function ProductCatalog({ topSpacingClass = "mt-8" }) {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const searchFromQuery = searchParams.get("search") ?? "";
    setFilters((current) => ({ ...current, search: searchFromQuery }));
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => {
        const normalizedSearch = filters.search.toLowerCase();
        const matchesSearch =
          filters.search === "" ||
          `${product.name} ${product.brand} ${product.shortDescription} ${product.category}`
            .toLowerCase()
            .includes(normalizedSearch);

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

  return (
    <>
      <div className={topSpacingClass}>
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
    </>
  );
}
