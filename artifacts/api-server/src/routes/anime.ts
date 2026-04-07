import { Router } from "express";
import axios from "axios";

const router = Router();

const BASE = "https://www.sankavollerei.com/anime/winbu";

async function proxy(url: string, params?: Record<string, string | undefined>) {
  const cleanParams: Record<string, string> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleanParams[k] = v;
    }
  }
  const res = await axios.get(url, {
    params: cleanParams,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      Referer: "https://www.sankavollerei.com/",
      Accept: "application/json, text/plain, */*",
    },
    timeout: 15000,
  });
  return res.data;
}

router.get("/anime/home", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/home`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/search", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/search`, { q: req.query.q as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/animedonghua", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/animedonghua`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/film", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/film`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/series", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/series`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/tvshow", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/tvshow`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/others", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/others`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/genres", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/genres`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/genre/:genre", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/genre/${req.params.genre}`, {
      page: req.query.page as string,
    });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/schedule", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/schedule`, { day: req.query.day as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/update", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/update`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/latest", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/latest`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/ongoing", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/ongoing`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/completed", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/completed`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/populer", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/populer`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/all-anime", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/all-anime`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/all-anime-reverse", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/all-anime-reverse`, { page: req.query.page as string });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/catalog", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/catalog`, {
      title: req.query.title as string,
      page: req.query.page as string,
      order: req.query.order as string,
      type: req.query.type as string,
      status: req.query.status as string,
    });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/list", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/list`, {
      order: req.query.order as string,
      status: req.query.status as string,
      type: req.query.type as string,
    });
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/detail/:slug", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/anime/${req.params.slug}`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/episode/:slug", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/episode/${req.params.slug}`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/series-detail/:slug", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/series/${req.params.slug}`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/film-detail/:slug", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/film/${req.params.slug}`);
    res.json(data);
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/server", async (req, res) => {
  try {
    const data = await proxy(`${BASE}/server`, {
      post: req.query.post as string,
      nume: req.query.nume as string,
      type: req.query.type as string,
    });

    // Extract embed_url or video src from HTML response
    let embedUrl = data.embed_url || null;
    if (!embedUrl && data.html) {
      // Try iframe src
      const iframeMatch = data.html.match(/src=["']([^"']+)["']/i);
      if (iframeMatch) embedUrl = iframeMatch[1];
      // Try video source src
      if (!embedUrl) {
        const srcMatch = data.html.match(/<source[^>]+src=["']([^"']+)["']/i);
        if (srcMatch) embedUrl = srcMatch[1];
      }
    }

    res.json({ ...data, embed_url: embedUrl });
  } catch (e: any) {
    req.log.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
