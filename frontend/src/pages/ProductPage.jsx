import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SellerOfferCard from "../components/SellerOfferCard";
import { fetchProduct } from "../lib/api";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const sellersSection = useRef(null);

  useEffect(() => {
    setSelectedOffer(null);
    setSelectedImageIndex(0);
  }, [productId]);

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
      <Link to="/products" className="flex items-center gap-2 text-sm text-indigo-600 transition hover:text-indigo-500">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Products Page
      </Link>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`overflow-hidden rounded-3xl border bg-white transition ${selectedImageIndex === index
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-slate-200 hover:border-indigo-300"
                  }`}
              >
                <img src={image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-100">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">{product.brand}</p>
              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => sellersSection.current?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Buy
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-400 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-500"
                >
                  Sell
                </button>
              </div>
            </div>
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
            <h2 ref={sellersSection} className="text-2xl font-semibold text-slate-900">Available sellers</h2>
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
              isSelected={selectedOffer?.id === offer.id}
              onSelectSeller={setSelectedOffer}
            />
          ))}
        </div>

        {selectedOffer ? (
          <div className="mt-8 rounded-[2rem] border border-indigo-200 bg-indigo-50/60 p-7 shadow-sm shadow-indigo-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Choose payment method</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Checkout with {selectedOffer.sellerName} · {formatPrice(selectedOffer.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
              >
                Choose a different seller
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  Stripe
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Card payment</p>
                <p className="mt-2 text-sm text-slate-600">Pay securely with debit or credit card via Stripe.</p>
              </button>

              <button
                type="button"
                className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  Crypto
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Cryptocurrency</p>
                <p className="mt-2 text-sm text-slate-600">
                  Bitcoin (BTC), Ethereum (ETH), and Tether (USDT) supported.
                </p>
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
