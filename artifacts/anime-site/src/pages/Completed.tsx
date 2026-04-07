import { useQuery } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";
import { fetchCompleted } from "@/lib/api";

function extractList(data: any): AnimeItem[] {
  if (!data) return [];
  for (const key of ["animeList", "data", "results", "completed"]) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

export default function Completed() {
  const { data, isLoading } = useQuery({
    queryKey: ["completed"],
    queryFn: fetchCompleted,
  });

  const list: AnimeItem[] = extractList(data);

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Anime Completed</h1>
            <p className="text-sm text-gray-500">Anime yang sudah selesai tayang</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid count={18} />
        ) : list.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {list.map((anime, i) => (
              <AnimeCard key={`${anime.animeId || i}`} anime={anime} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tidak ada data.</p>
        )}
      </div>
    </div>
  );
}
