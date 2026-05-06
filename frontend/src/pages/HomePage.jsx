import { Link } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";

const heroImagePath = "/src/assets/image/hero.jpg";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={heroImagePath} alt="Fashion marketplace hero" className="h-[400px] w-full object-cover sm:h-[600px]" />
        {/* <div className="absolute inset-0 bg-slate-900/20" /> */}

        <div className="absolute left-6 top-1/2 z-10 w-full max-w-sm -translate-y-1/3  p-5">
          <h1 className="text-4xl text-white font-bold text-slate-900">Ready to declutter your closet?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 text-white">
            Sell clothes, shoes, and hats through product sheets that buyers instantly understand.
          </p>
          <Link
            to="/products"
            className="mt-5 flex w-full items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Sell now
          </Link>
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

      <ProductCatalog />
    </main>
  );
}
