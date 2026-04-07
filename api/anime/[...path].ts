import type { VercelRequest, VercelResponse } from "@vercel/node";
import https from "https";
import http from "http";
import { URL } from "url";

const BASE = "https://www.sankavollerei.com/anime/winbu";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
  Referer: "https://www.sankavollerei.com/",
  Accept: "application/json, text/plain, */*",
};

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const req = lib.get(url, { headers: HEADERS, timeout: 20000 }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (e) {
          reject(new Error("Invalid JSON response"));
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timeout")); });
  });
}

function buildUpstreamUrl(path: string, query: Record<string, string | string[]>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v)) params.set(k, v[0]);
  }
  const qs = params.toString();
  return `${BASE}/${path}${qs ? "?" + qs : ""}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const pathArr = (req.query.path as string[]) || [];
  const path = pathArr.join("/");
  const { path: _p, ...queryRest } = req.query;

  try {
    const upstreamUrl = buildUpstreamUrl(path, queryRest as Record<string, string | string[]>);
    const data = await fetchJson(upstreamUrl);

    // For server endpoint: extract embed_url from html
    if (path === "server" && data.html && !data.embed_url) {
      let embedUrl: string | null = null;
      const iframeMatch = data.html.match(/src=["']([^"']+)["']/i);
      if (iframeMatch) embedUrl = iframeMatch[1];
      if (!embedUrl) {
        const srcMatch = data.html.match(/<source[^>]+src=["']([^"']+)["']/i);
        if (srcMatch) embedUrl = srcMatch[1];
      }
      return res.json({ ...data, embed_url: embedUrl });
    }

    return res.json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Proxy error" });
  }
}
