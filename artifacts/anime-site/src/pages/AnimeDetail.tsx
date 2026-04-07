import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Star, Play, Film, Tag } from "lucide-react";
import AnimeCard, { AnimeItem } from "@/components/AnimeCard";
import { fetchAnimeDetail, fetchSeriesDetail, fetchFilmDetail } from "@/lib/api";

interface EpisodeItem {
  id?: string;
  episodeId?: string;
  title?: string;
  episode?: string | number;
  link?: string;
  url?: string;
}

function extractDetail(data: any) {
  if (!data) return null;
  if (data.data) return data.data;
  return data;
}

function extractEpisodes(detail: any): EpisodeItem[] {
  if (!detail) return [];
  for (const key of ["episodes", "episodeList", "episodeListExist"]) {
    if (Array.isArray(detail[key]) && detail[key].length > 0) return detail[key];
  }
  return [];
}

function extractRelated(detail: any): AnimeItem[] {
  if (!detail) return [];
  for (const key of ["recommendations", "related", "recommendation", "similar"]) {
    if (Array.isArray(detail[key]) && detail[key].length > 0) return detail[key];
  }
  return [];
}

export default function AnimeDetail() {
  const [matchAnime, paramsAnime] = useRoute("/anime/:slug");
  const [matchSeries, paramsSeries] = useRoute("/series/:slug");
  const [matchFilm, paramsFilm] = useRoute("/film/:slug");

  const slug = paramsAnime?.slug || paramsSeries?.slug || paramsFilm?.slug || "";
  const type = matchSeries ? "series" : matchFilm ? "film" : "anime";

  const queryFn =
    type === "series" ? () => fetchSeriesDetail(slug) :
    type === "film" ? () => fetchFilmDetail(slug) :
    () => fetchAnimeDetail(slug);

  const { data, isLoading, error } = useQuery({
    queryKey: ["detail", type, slug],
    queryFn,
    enabled: !!slug,
  });

  const detail = extractDetail(data);
  const episodes: EpisodeItem[] = extractEpisodes(detail);
  const related: AnimeItem[] = extractRelated(detail);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8 animate-pulse">
            <div className="w-48 shrink-0 bg-[#111118] rounded-xl" style={{ aspectRatio: "3/4" }} />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[#111118] rounded w-2/3" />
              <div className="h-4 bg-[#111118] rounded w-1/3" />
              <div className="h-4 bg-[#111118] rounded w-full" />
              <div className="h-4 bg-[#111118] rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Gagal memuat data anime.</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const title = detail.title || detail.animeTitle || "";
  const poster = detail.image || detail.poster || detail.thumbnail || "";
  const synopsis = detail.synopsis || detail.sinopsis || detail.description || "";
  const info = detail.info || {};
  const score = info.rating || detail.score || detail.rating || "";
  const status = info.status || detail.status || "";
  const animeType = info.type || detail.type || "";
  const duration = info.duration || detail.duration || "";
  const totalEp = info.episodes_count || detail.totalEpisode || "";
  const released = info.release_date || detail.released || detail.releasedOn || "";
  const studio = info.studio || detail.studio || "";
  const season = info.season || detail.season || "";

  const rawGenres = info.genres || detail.genreList || detail.genres || [];
  const genres: { name: string; url?: string }[] = rawGenres.map((g: any) =>
    typeof g === "string" ? { name: g } : { name: g.name || g.title || "", url: g.url }
  );

  // Episode ID: use "id" field or derive from link
  const getEpId = (ep: EpisodeItem) =>
    ep.id || ep.episodeId || ep.link?.split("/").filter(Boolean).pop() || ep.url?.split("/").filter(Boolean).pop() || "";

  const firstEpId = getEpId(episodes[0] || {});

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      {/* Header with backdrop */}
      <div className="relative overflow-hidden border-b border-white/5">
        {poster && (
          <div className="absolute inset-0">
            <img src={poster} alt="" className="w-full h-full object-cover object-top blur-xl opacity-10 scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-[#0d0d14]/80" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6 md:gap-8">
            {/* Poster */}
            <div className="w-36 md:w-48 shrink-0">
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  className="w-full rounded-xl border border-white/10 shadow-2xl"
                  style={{ aspectRatio: "3/4", objectFit: "cover" }}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/200x300/111118/6366f1?text=${encodeURIComponent(title.slice(0, 10))}`;
                  }}
                />
              ) : (
                <div className="w-full rounded-xl border border-white/10 bg-[#111118] flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
                  <Film className="w-8 h-8 text-gray-700" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight">{title}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {score && score !== "0" && (
                  <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-lg font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {score}
                  </span>
                )}
                {status && status !== "-" && (
                  <span className={`text-xs px-2 py-1 rounded-lg font-semibold border ${
                    status.toLowerCase().includes("ongoing") || status.toLowerCase().includes("berlangsung")
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}>
                    {status}
                  </span>
                )}
                {animeType && animeType !== "-" && (
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-lg font-semibold">
                    {animeType}
                  </span>
                )}
                {season && season !== "-" && (
                  <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg font-semibold">
                    {season}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-xs text-gray-400">
                {studio && studio !== "-" && <span><span className="text-gray-600">Studio:</span> {studio}</span>}
                {released && released !== "-" && <span><span className="text-gray-600">Rilis:</span> {released}</span>}
                {totalEp && totalEp !== "-" && <span><span className="text-gray-600">Episode:</span> {totalEp}</span>}
                {duration && duration !== "-" && <span><span className="text-gray-600">Durasi:</span> {duration}</span>}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Tag className="w-3 h-3 text-gray-600 mt-0.5" />
                  {genres.slice(0, 8).map((g, i) => {
                    const gSlug = g.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={i}
                        href={`/genre/${gSlug}`}
                        className="text-[11px] px-2 py-0.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-md hover:bg-indigo-600/20 transition-colors"
                      >
                        {g.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {synopsis && (
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 mb-4">{synopsis}</p>
              )}

              {firstEpId && (
                <Link
                  href={`/watch/${firstEpId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-900/30"
                >
                  <Play className="w-4 h-4" fill="white" />
                  Mulai Nonton
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Episode list */}
        {episodes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
              Daftar Episode ({episodes.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-80 overflow-y-auto pr-1">
              {episodes.map((ep, i) => {
                const epId = getEpId(ep);
                const epLabel = ep.title || `Episode ${i + 1}`;
                return (
                  <Link
                    key={epId || i}
                    href={epId ? `/watch/${epId}` : "#"}
                    className="px-3 py-2.5 bg-[#111118] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-600/10 rounded-lg text-xs font-medium text-gray-300 hover:text-indigo-300 transition-all text-center"
                  >
                    {epLabel}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
              Rekomendasi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {related.slice(0, 6).map((anime, i) => (
                <AnimeCard key={`${anime.id || anime.animeId || i}`} anime={anime} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
