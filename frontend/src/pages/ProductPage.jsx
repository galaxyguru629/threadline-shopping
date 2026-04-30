import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SellerOfferCard from "../components/SellerOfferCard";
import { fetchProduct } from "../lib/api";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    fetchProduct(productId)
      .then((data) => {
        if (!active) {
          return;
        }

        setProduct(data.product);
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
  }, [productId]);

  const bestPrice = useMemo(() => {
    if (!product) {
      return null;
    }

    return Math.min(...product.offers.map((offer) => offer.price));
  }, [product]);

  if (status === "loading") {
    return <main className="mx-auto max-w-7xl px-4 py-10 text-slate-600">Loading product...</main>;
  }

  if (status === "error" || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Product not found or backend unavailable.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="text-sm text-indigo-600 transition hover:text-indigo-500">
       Back to catalog
      </Link>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((image) => (
              <div
                key={image}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <img src={image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-100">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{product.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Lowest listed price</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{formatPrice(bestPrice)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Seller choices</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{product.offers.length}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600">
                Category: {product.category}
              </span>
              <span className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600">
                Condition: {product.condition}
              </span>
              <span className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600">
                Size range: {product.sizeInfo}
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Why this demo structure works</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>One product sheet keeps the shopping experience clearer than many duplicate listings.</li>
              <li>Buyers compare sellers by price, trust signals, and shipping notes on one screen.</li>
              <li>Brands could later attach product identity to resale without changing this core structure.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available sellers</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose the seller offer that matches the buyer's price and confidence needs.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {product.offers.map((offer) => (
            <SellerOfferCard
              key={offer.id}
              offer={offer}
              highlight={offer.price === bestPrice}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
