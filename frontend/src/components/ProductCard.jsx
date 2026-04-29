import { Link } from "react-router-dom";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
    >
      <div className="aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">{product.brand}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {product.condition}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.shortDescription}</p>

        <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-3">
          <div>
            <p className="text-xs text-slate-500">Best offer</p>
            <p className="text-2xl font-semibold text-slate-900">{formatPrice(product.lowestPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Seller choices</p>
            <p className="text-sm font-medium text-slate-700">{product.offerCount} offers</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
