/**
 * Build-time sitemap from the CMS API.
 * Writes dist/sitemap.xml after `vite build`.
 *
 * Env:
 *   VITE_SITE_URL  — public site origin (default: production vercel URL)
 *   VITE_API_URL   — CMS API base (default: production Render API)
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "dist");

const SITE =
  process.env.VITE_SITE_URL || "https://uhaimong-portfolio.vercel.app";
const API =
  process.env.VITE_API_URL || "https://portfolio-cms-wkri.onrender.com/api";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/archives", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const urlEntry = ({ path, lastmod, priority, changefreq }) => {
  const loc = `${SITE}${path}`;
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq || "monthly"}</changefreq>
    <priority>${priority || "0.5"}</priority>
  </url>`;
};

async function fetchAll(endpoint, listKey) {
  try {
    const res = await fetch(`${API}/${endpoint}?limit=100&page=1`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    const data = json?.data || json;
    return data?.[listKey] || data || [];
  } catch (err) {
    console.warn(`[sitemap] Could not fetch ${endpoint}:`, err.message);
    return [];
  }
}

function toDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

async function main() {
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const [projects, blogs] = await Promise.all([
    fetchAll("projects", "projects"),
    fetchAll("blog", "blogs"),
  ]);

  const dynamic = [
    ...projects
      .filter((p) => p?.slug)
      .map((p) => ({
        path: `/archives/${p.slug}`,
        lastmod: toDate(p.updatedAt || p.endDate || p.createdAt),
        priority: "0.8",
        changefreq: "monthly",
      })),
    ...blogs
      .filter((b) => b?.slug)
      .map((b) => ({
        path: `/blog/${b.slug}`,
        lastmod: toDate(b.updatedAt || b.publishedAt || b.createdAt),
        priority: "0.7",
        changefreq: "monthly",
      })),
  ];

  const urls = [...staticRoutes, ...dynamic];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlEntry).join("\n")}
</urlset>
`;

  const outPath = join(outDir, "sitemap.xml");
  writeFileSync(outPath, xml, "utf8");
  console.log(
    `[sitemap] Wrote ${urls.length} URLs (${projects.length} projects, ${blogs.length} posts) → ${outPath}`,
  );
}

main();
