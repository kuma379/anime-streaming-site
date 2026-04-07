import { Link } from "wouter";
import { Tv } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-[#0a0a10]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3 w-fit">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Tv className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Anime<span className="text-indigo-400">Stream</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Nonton anime, film, dan donghua sub indo terbaru dan terlengkap. Streaming gratis berkualitas tinggi, update tercepat.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Navigasi</h3>
            <nav className="flex flex-col gap-2">
              {[
                ["/", "Beranda"],
                ["/ongoing", "Ongoing"],
                ["/completed", "Completed"],
                ["/movies", "Movies"],
                ["/popular", "Populer"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Kategori</h3>
            <nav className="flex flex-col gap-2">
              {[
                ["/donghua", "Donghua"],
                ["/series", "Series"],
                ["/tvshow", "TV Show"],
                ["/genres", "Genre"],
                ["/schedule", "Jadwal"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AnimeStream. Semua konten adalah milik pemilik aslinya.
          </p>
          <p className="text-xs text-gray-600">
            Data disediakan oleh sankavollerei.com
          </p>
        </div>
      </div>
    </footer>
  );
}
