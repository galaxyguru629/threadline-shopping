import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const topCategories = [
  "Women",
  "Men",
  "Sports"
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();

    if (!term) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

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
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm"
            >
              <span className="text-sm text-slate-400">Q</span>
              <input
                type="text"
                placeholder="Search for items"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="ml-2 w-full border-none bg-transparent text-sm text-slate-700 outline-none"
              />
            </form>
          </div>

          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-2 max-w-[140px] truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300"
                  title={user.email}
                >
                  <img
                    src="/src/assets/image/user.png"
                    alt="User"
                    className="w-5 h-5"
                  />

                  <span className="truncate">
                    {user.name}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg border border-cyan-600 bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to="/products"
              className="rounded-lg bg-gray-300 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-400"
            >
              Buy now
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
