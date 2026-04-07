import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Search as SearchIcon } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";
import SearchBar from "@/components/SearchBar";
import { fetchSearch } from "@/lib/api";

function extractList(data: any): AnimeItem[] {
  if (!data) return [];
  for (const key of ["animeList", "data", "results", "search"]) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

export default function Search() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const q = params.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => fetchSearch(q),
    enabled: !!q,
  });

  const list: AnimeItem[] = extractList(data);

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-xl mb-8">
          <h1 className="text-2xl font-black text-white mb-4">
            {q ? (
              <>Hasil pencarian: <span className="text-indigo-400">"{q}"</span></>
            ) : (
              "Cari Anime"
            )}
          </h1>
          <SearchBar />
        </div>

        {!q ? (
          <div className="py-12 text-center">
            <SearchIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Masukkan judul anime untuk mencari.</p>
          </div>
        ) : isLoading ? (
          <LoadingGrid count={12} />
        ) : list.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{list.length} hasil ditemukan</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {list.map((anime, i) => (
                <AnimeCard key={`${anime.animeId || i}`} anime={anime} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <SearchIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada hasil untuk "{q}".</p>
            <p className="text-sm text-gray-600 mt-1">Coba kata kunci lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
