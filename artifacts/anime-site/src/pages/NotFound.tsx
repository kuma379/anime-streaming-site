import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-black text-indigo-600/30 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Halaman tidak ditemukan</h2>
        <p className="text-gray-500 mb-6">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
