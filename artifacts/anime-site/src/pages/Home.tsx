import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, TrendingUp, Film, Tv, BookOpen, Calendar, Zap } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import SectionHeader from "@/components/SectionHeader";
import LoadingGrid from "@/components/LoadingGrid";
import { fetchHome, fetchPopular } from "@/lib/api";

function extractList(data: any, ...keyGroups: string[][]): AnimeItem[] {
  if (!data) return [];
  for (const keys of keyGroups) {
    for (const key of keys) {
      if (Array.isArray(data[key]) && data[key].length > 0) return data[key];
      if (data.data && Array.isArray(data.data[key]) && data.data[key].length > 0) return data.data[key];
    }
  }
  if (Array.isArray(data.data) && data.data.length > 0) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export default function Home() {
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ["popular"],
    queryFn: fetchPopular,
  });

  const recent: AnimeItem[] = extractList(
    homeData,
    ["latest_anime", "latest_film", "latest_series"],
    ["animeList", "recent", "latest", "update", "results"]
  );

  const popular: AnimeItem[] = extractList(
    popularData,
    ["animeList", "popular"],
    ["data", "results"]
  );

  const quickLinks = [
    { href: "/ongoing", label: "Ongoing", icon: Clock, color: "border-indigo-500/30 hover:bg-indigo-600/10 hover:border-indigo-500/60" },
    { href: "/completed", label: "Completed", icon: Zap, color: "border-blue-500/30 hover:bg-blue-600/10 hover:border-blue-500/60" },
    { href: "/movies", label: "Movies", icon: Film, color: "border-purple-500/30 hover:bg-purple-600/10 hover:border-purple-500/60" },
    { href: "/donghua", label: "Donghua", icon: Tv, color: "border-emerald-500/30 hover:bg-emerald-600/10 hover:border-emerald-500/60" },
    { href: "/genres", label: "Genre", icon: BookOpen, color: "border-amber-500/30 hover:bg-amber-600/10 hover:border-amber-500/60" },
    { href: "/schedule", label: "Jadwal", icon: Calendar, color: "border-rose-500/30 hover:bg-rose-600/10 hover:border-rose-500/60" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0a0a10] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-3 py-1 text-xs text-indigo-400 font-medium mb-4">
              <TrendingUp className="w-3 h-3" />
              Streaming Anime Gratis
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              Nonton Anime, Film & Donghua
              <span className="text-indigo-400"> Sub Indo</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Terlengkap dan terupdate. Nikmati ribuan judul anime, film, dan donghua dalam kualitas terbaik.
            </p>
            <div className="flex gap-3">
              <Link href="/ongoing" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-900/30">
                Mulai Nonton
              </Link>
              <Link href="/genres" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition-colors">
                Cari Genre
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Quick links */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border bg-[#111118] transition-all hover:-translate-y-0.5 hover:shadow-lg ${color}`}
            >
              <Icon className="w-5 h-5 text-gray-300" />
              <span className="text-xs font-semibold text-white">{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent */}
        <section>
          <SectionHeader title="Anime Terbaru" href="/ongoing" />
          {homeLoading ? (
            <LoadingGrid count={12} />
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recent.slice(0, 12).map((anime, i) => (
                <AnimeCard key={`recent-${anime.id || anime.animeId || i}`} anime={anime} showEpisode />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Data tidak tersedia.</p>
          )}
        </section>

        {/* Popular */}
        <section>
          <SectionHeader title="Anime Populer" href="/popular" />
          {popularLoading ? (
            <LoadingGrid count={6} />
          ) : popular.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {popular.slice(0, 6).map((anime, i) => (
                <AnimeCard key={`popular-${anime.id || anime.animeId || i}`} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Data tidak tersedia.</p>
          )}
        </section>
      </div>
    </div>
  );
}
