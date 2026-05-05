import { Link } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="text-sm text-indigo-600 transition hover:text-indigo-500">
        Back to home
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-semibold text-slate-900">All products</h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse the full catalog and pick a product sheet to compare seller offers.
        </p>
      </div>

      <ProductCatalog topSpacingClass="mt-8" />
    </main>
  );
}
