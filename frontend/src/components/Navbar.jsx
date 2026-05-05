import { Link } from "react-router-dom";

const topCategories = [
  "Women",
  "Men",
  "Sports"
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-sm font-bold text-white">
              TL
            </span>
          </Link>

          <div className="flex-1">
            <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm">
              <span className="text-sm text-slate-400">Q</span>
              <input
                type="text"
                placeholder="Search for items"
                className="ml-2 w-full border-none bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              to="/products"
              className="rounded-lg bg-gray-300 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-400"
            >
              Sell now
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto border-t border-slate-100 py-2 text-xs text-slate-600">
          {topCategories.map((item) => (
            <a key={item} href="#" className="whitespace-nowrap transition hover:text-slate-900">
              {item}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
