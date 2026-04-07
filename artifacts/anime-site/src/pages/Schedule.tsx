import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";
import { fetchSchedule } from "@/lib/api";

const DAYS = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

function extractList(data: any, day: string): AnimeItem[] {
  if (!data) return [];
  if (data[day] && Array.isArray(data[day])) return data[day];
  for (const key of ["animeList", "data", "results", "schedule"]) {
    if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

export default function Schedule() {
  const today = new Date().getDay();
  const dayKeys = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  const [selectedDay, setSelectedDay] = useState<string>(dayKeys[today] || "senin");

  const { data, isLoading } = useQuery({
    queryKey: ["schedule", selectedDay],
    queryFn: () => fetchSchedule(selectedDay),
  });

  const list: AnimeItem[] = extractList(data, selectedDay);

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sky-600/20 border border-sky-500/30 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Jadwal Tayang</h1>
            <p className="text-sm text-gray-500">Jadwal anime per hari</p>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DAYS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                selectedDay === d.key
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                  : "bg-[#111118] border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingGrid count={12} />
        ) : list.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {list.map((anime, i) => (
              <AnimeCard key={`${anime.animeId || i}`} anime={anime} showEpisode />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada anime tayang hari ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
