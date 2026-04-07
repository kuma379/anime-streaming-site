import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ChevronLeft, ChevronRight, Loader2, Server, AlertCircle, Download } from "lucide-react";
import { fetchEpisode, fetchServer } from "@/lib/api";

interface StreamServer {
  resolution?: string;
  server?: string;
  data?: { post: string; nume: string; type: string };
}

interface DownloadLink {
  server?: string;
  url?: string;
}

interface DownloadItem {
  resolution?: string;
  links?: DownloadLink[];
}

interface EpItem {
  id?: string;
  title?: string;
  url?: string;
  active?: boolean;
}

export default function Watch() {
  const [, params] = useRoute("/watch/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["episode", slug],
    queryFn: () => fetchEpisode(slug),
    enabled: !!slug,
  });

  const detail = data?.data || data;
  const streams: StreamServer[] = detail?.streams || [];
  const downloads: DownloadItem[] = detail?.downloads || [];
  const allEpisodes: EpItem[] = detail?.all_episodes || [];
  const navigation = detail?.navigation || {};
  const title = detail?.title || "";

  const prevId = navigation?.prev?.id !== "#" ? navigation?.prev?.id : null;
  const nextId = navigation?.next?.id !== "#" ? navigation?.next?.id : null;

  const [iframeSrc, setIframeSrc] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [serverError, setServerError] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  // Auto-load first server
  useEffect(() => {
    if (streams.length > 0 && activeIdx === null && !iframeSrc) {
      loadServer(streams[0], 0);
    }
  }, [streams]);

  async function loadServer(s: StreamServer, idx: number) {
    if (!s.data) return;
    setLoadingIdx(idx);
    setServerError(false);
    try {
      const res = await fetchServer(s.data.post, s.data.nume, s.data.type);
      const url = res?.embed_url || res?.url || res?.data?.embed_url || res?.data?.url || "";
      if (url) {
        setIframeSrc(url);
        setActiveIdx(idx);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setLoadingIdx(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-gray-400 text-sm">Memuat episode...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Gagal memuat episode.</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>

        {/* Player */}
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black" style={{ paddingTop: "56.25%" }}>
          {loadingIdx !== null && !iframeSrc ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-[#0d0d14]">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-gray-400 text-sm">Memuat server...</p>
            </div>
          ) : iframeSrc ? (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
              <Server className="w-10 h-10 text-gray-700" />
              <p className="text-gray-500 text-sm">Pilih server untuk memulai streaming</p>
            </div>
          )}
        </div>

        {serverError && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Server tidak tersedia. Coba server lain.
          </div>
        )}

        {/* Server selector */}
        {streams.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 mr-1">Server:</span>
            {streams.map((s, i) => (
              <button
                key={i}
                onClick={() => loadServer(s, i)}
                disabled={loadingIdx === i}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  activeIdx === i
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-[#111118] border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300 disabled:opacity-50"
                }`}
              >
                {loadingIdx === i && <Loader2 className="w-3 h-3 animate-spin" />}
                {s.server || `Server ${i + 1}`}
                {s.resolution && <span className="text-[10px] opacity-60">{s.resolution}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {prevId ? (
              <Link
                href={`/watch/${prevId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111118] border border-white/10 hover:border-indigo-500/50 text-sm text-gray-300 hover:text-indigo-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-[#0a0a10] border border-white/5 text-sm text-gray-600 cursor-not-allowed flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </span>
            )}
            {nextId ? (
              <Link
                href={`/watch/${nextId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-700/80 border border-indigo-600/50 hover:bg-indigo-600 text-sm text-white transition-all"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-[#0a0a10] border border-white/5 text-sm text-gray-600 cursor-not-allowed flex items-center gap-1">
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>

          {downloads.length > 0 && (
            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111118] border border-white/10 hover:border-indigo-500/50 text-sm text-gray-300 hover:text-indigo-300 transition-all"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          )}
        </div>

        {/* Downloads */}
        {showDownloads && downloads.length > 0 && (
          <div className="bg-[#111118] border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" /> Link Download
            </h3>
            {downloads.map((dl, i) => (
              <div key={i}>
                <p className="text-xs text-gray-500 mb-1.5">{dl.resolution}</p>
                <div className="flex flex-wrap gap-2">
                  {dl.links?.map((lk, j) => (
                    <a
                      key={j}
                      href={lk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#1a1a2e] border border-white/10 hover:border-indigo-500/40 text-xs text-gray-300 hover:text-indigo-300 rounded-lg transition-all"
                    >
                      {lk.server}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All episodes */}
        {allEpisodes.length > 1 && (
          <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">Semua Episode</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {allEpisodes.map((ep, i) => (
                <Link
                  key={ep.id || i}
                  href={ep.id ? `/watch/${ep.id}` : "#"}
                  className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-all border ${
                    ep.active || ep.id === slug
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-[#0d0d14] border-white/5 text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300"
                  }`}
                >
                  {ep.title || `Ep ${i + 1}`}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
