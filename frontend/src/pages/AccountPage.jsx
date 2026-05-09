import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900">Your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Signed in as <span className="font-medium text-slate-900">{user?.email}</span>
          {user?.name ? (
            <>
              {" "}
              · {user.name}
            </>
          ) : null}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-slate-900"
          >
            Browse products
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
