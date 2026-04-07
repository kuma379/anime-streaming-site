import axios from "axios";

// In Vercel production, API is served from /api/anime
// In Replit dev, API is proxied via BASE_URL/api/anime
function getApiBase(): string {
  // Replit dev environment
  const base = import.meta.env.BASE_URL || "/";
  const cleaned = base.endsWith("/") ? base.slice(0, -1) : base;
  return cleaned + "/api/anime";
}

const api = axios.create({
  baseURL: getApiBase(),
  timeout: 25000,
});

export async function fetchHome() {
  const res = await api.get("/home");
  return res.data;
}

export async function fetchSearch(q: string) {
  const res = await api.get("/search", { params: { q } });
  return res.data;
}

export async function fetchFilm(page = 1) {
  const res = await api.get("/film", { params: { page } });
  return res.data;
}

export async function fetchSeries(page = 1) {
  const res = await api.get("/series", { params: { page } });
  return res.data;
}

export async function fetchTvShow(page = 1) {
  const res = await api.get("/tvshow", { params: { page } });
  return res.data;
}

export async function fetchOthers(page = 1) {
  const res = await api.get("/others", { params: { page } });
  return res.data;
}

export async function fetchAnimeDonghua(page = 1) {
  const res = await api.get("/animedonghua", { params: { page } });
  return res.data;
}

export async function fetchGenres() {
  const res = await api.get("/genres");
  return res.data;
}

export async function fetchGenreAnime(genre: string, page = 1) {
  const res = await api.get(`/genre/${genre}`, { params: { page } });
  return res.data;
}

export async function fetchSchedule(day?: string) {
  const res = await api.get("/schedule", { params: day ? { day } : {} });
  return res.data;
}

export async function fetchOngoing(page = 1) {
  const res = await api.get("/ongoing", { params: { page } });
  return res.data;
}

export async function fetchCompleted(page = 1) {
  const res = await api.get("/completed", { params: { page } });
  return res.data;
}

export async function fetchPopular() {
  const res = await api.get("/populer");
  return res.data;
}

export async function fetchLatest() {
  const res = await api.get("/latest");
  return res.data;
}

export async function fetchAllAnime(page = 1) {
  const res = await api.get("/all-anime", { params: { page } });
  return res.data;
}

export async function fetchAnimeDetail(slug: string) {
  const res = await api.get(`/detail/${slug}`);
  return res.data;
}

export async function fetchEpisode(slug: string) {
  const res = await api.get(`/episode/${slug}`);
  return res.data;
}

export async function fetchSeriesDetail(slug: string) {
  const res = await api.get(`/series-detail/${slug}`);
  return res.data;
}

export async function fetchFilmDetail(slug: string) {
  const res = await api.get(`/film-detail/${slug}`);
  return res.data;
}

export async function fetchServer(post: string, nume: string, type: string) {
  const res = await api.get("/server", { params: { post, nume, type } });
  return res.data;
}

export async function fetchCatalog(params: Record<string, string | number>) {
  const res = await api.get("/catalog", { params });
  return res.data;
}
