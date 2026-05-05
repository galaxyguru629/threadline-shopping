import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50/40 to-white text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
