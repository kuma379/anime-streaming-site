import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tv, ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";
import { fetchAnimeDonghua } from "@/lib/api";

function extractList(data: any): AnimeItem[] {
  if (!data) return [];
  const keys = ["animeList", "data", "donghuaList", "results"];
  for (const key of keys) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

export default function Donghua() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["donghua", page],
    queryFn: () => fetchAnimeDonghua(page),
  });

  const list: AnimeItem[] = extractList(data);
  const totalPages: number = data?.totalPages || data?.pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
            <Tv className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Anime Donghua</h1>
            <p className="text-sm text-gray-500">Koleksi donghua (anime China) terlengkap</p>
          </div>
        </div>

        {isLoading || isFetching ? (
          <LoadingGrid count={18} />
        ) : list.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {list.map((anime, i) => (
                <AnimeCard key={`${anime.animeId || i}`} anime={anime} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        ) : (
          <p className="text-gray-500">Tidak ada data.</p>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111118] border border-white/10 text-sm text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" /> Sebelumnya
      </button>
      <span className="text-sm text-gray-400">Hal {page} / {totalPages}</span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-700/80 border border-indigo-600/50 hover:bg-indigo-600 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Selanjutnya <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
