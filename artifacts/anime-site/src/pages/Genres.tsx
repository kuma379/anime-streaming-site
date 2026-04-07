import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";
import { fetchGenres } from "@/lib/api";

interface Genre {
  genreId?: string;
  name?: string;
  title?: string;
  slug?: string;
  href?: string;
  count?: number;
}

function extractGenres(data: any): Genre[] {
  if (!data) return [];
  for (const key of ["genreList", "genres", "data", "results"]) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

function getSlug(g: Genre): string {
  return g.genreId || g.slug || g.name?.toLowerCase().replace(/\s+/g, "-") || "";
}

function getLabel(g: Genre): string {
  return g.name || g.title || g.genreId || "";
}

export default function Genres() {
  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const genres: Genre[] = extractGenres(data);

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-600/20 border border-rose-500/30 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Daftar Genre</h1>
            <p className="text-sm text-gray-500">Pilih genre anime favoritmu</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-[#111118] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {genres.map((g, i) => {
              const slug = getSlug(g);
              return (
                <Link
                  key={slug || i}
                  href={`/genre/${slug}`}
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#111118] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-600/10 transition-all group"
                >
                  <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-300 transition-colors">
                    {getLabel(g)}
                  </span>
                  {g.count && (
                    <span className="text-[10px] text-gray-600 shrink-0">{g.count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">Tidak ada data genre.</p>
        )}
      </div>
    </div>
  );
}
