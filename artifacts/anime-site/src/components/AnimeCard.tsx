import { Link } from "wouter";
import { Star, Play, Monitor } from "lucide-react";

export interface AnimeItem {
  id?: string;
  animeId?: string;
  episodeId?: string;
  title?: string;
  image?: string;
  poster?: string;
  thumbnail?: string;
  score?: string;
  rating?: string;
  type?: string;
  status?: string;
  episodes?: string | number;
  episode?: string;
  time?: string;
  views?: string;
  slug?: string;
  link?: string;
}

interface Props {
  anime: AnimeItem;
  showEpisode?: boolean;
  href?: string;
}

function getSlug(anime: AnimeItem): string {
  return anime.id || anime.animeId || anime.slug || "";
}

function getHref(anime: AnimeItem, href?: string): string {
  if (href) return href;
  if (anime.episodeId) return `/watch/${anime.episodeId}`;
  const slug = getSlug(anime);
  return slug ? `/anime/${slug}` : "#";
}

function getPoster(anime: AnimeItem): string {
  return anime.image || anime.poster || anime.thumbnail || "";
}

function getScore(anime: AnimeItem): string {
  return anime.score || anime.rating || "";
}

export default function AnimeCard({ anime, showEpisode = false, href }: Props) {
  const to = getHref(anime, href);
  const poster = getPoster(anime);
  const score = getScore(anime);
  const ep = anime.episode || (typeof anime.episodes === "string" ? anime.episodes : "");

  return (
    <Link
      href={to}
      className="group block rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/40 bg-[#111118]"
    >
      <div className="relative overflow-hidden bg-[#1a1a2e]" style={{ aspectRatio: "3/4" }}>
        {poster ? (
          <>
            <img
              src={poster}
              alt={anime.title || ""}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                const t = e.currentTarget;
                t.onerror = null;
                t.src = `https://placehold.co/200x300/111118/6366f1?text=${encodeURIComponent(anime.title?.slice(0,10) || "Anime")}`;
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/50 scale-75 group-hover:scale-100 transition-transform duration-200">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-gray-600 bg-[#1a1a2e]">
            <Monitor className="w-8 h-8 text-gray-700" />
            <span className="text-[10px] text-gray-600 text-center px-2 line-clamp-2">{anime.title}</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {showEpisode && ep && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg">
            {ep}
          </div>
        )}

        {score && score !== "0" && score !== "" && (
          <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <Star className="w-2.5 h-2.5 fill-current" />
            {score}
          </div>
        )}

        {anime.type && !showEpisode && (
          <div className="absolute bottom-2 left-2 bg-indigo-900/80 backdrop-blur-sm text-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {anime.type}
          </div>
        )}

        {anime.time && showEpisode && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] px-2 py-0.5 rounded-md">
            {anime.time}
          </div>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors duration-200">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
