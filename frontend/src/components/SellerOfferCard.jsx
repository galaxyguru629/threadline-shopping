function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SellerOfferCard({ offer, highlight, isSelected, onSelectSeller }) {
  return (
    <article
      className={`relative rounded-3xl border p-5 transition ${
        isSelected
          ? "border-2 border-blue-600 bg-white shadow-md shadow-blue-100/80"
          : highlight
            ? "border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-100"
            : "border-slate-200 bg-white"
      }`}
    >
      {isSelected ? (
        <div
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white"
          aria-label="Selected seller"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : null}

      <div className={`flex flex-wrap items-start justify-between gap-4 ${isSelected ? "pr-12 sm:pr-14" : ""}`}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{offer.sellerName}</h3>
            {highlight ? (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                Best price
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {offer.location} · Rating {offer.rating}/5 · {offer.salesCount}+ previous sales
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Price</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatPrice(offer.price)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {offer.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{offer.note}</p>

      <button
        type="button"
        onClick={() => onSelectSeller?.(offer)}
        className="mt-5 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
      >
        Select this seller
      </button>
    </article>
  );
}
