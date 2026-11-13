/**
 * Post-build SEO prerender: writes static HTML shells for each
 * blog post and project so crawlers/social bots see correct meta
 * without executing JS. The SPA still hydrates from the same bundle.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const SITE =
  process.env.VITE_SITE_URL || "https://uhaimong-portfolio.vercel.app";
const API =
  process.env.VITE_API_URL || "https://portfolio-cms-wkri.onrender.com/api";

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const absolute = (path) =>
  /^https?:\/\//i.test(path) ? path : `${SITE}${path.startsWith("/") ? path : `/${path}`}`;

async function fetchList(endpoint, key) {
  try {
    const res = await fetch(`${API}/${endpoint}?limit=100&page=1`);
    if (!res.ok) throw new Error(`${res.status}`);
    const json = await res.json();
    const data = json?.data || json;
    return data?.[key] || [];
  } catch (err) {
    console.warn(`[prerender] ${endpoint}:`, err.message);
    return [];
  }
}

function inject(html, { title, description, url, image, type = "website", jsonLd, body }) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  const replaceMeta = (attr, key, content) => {
    const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, "i");
    const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
    out = re.test(out) ? out.replace(re, tag) : out.replace("</head>", `    ${tag}\n  </head>`);
  };
  replaceMeta("name", "description", description);
  replaceMeta("property", "og:title", title);
  replaceMeta("property", "og:description", description);
  replaceMeta("property", "og:url", url);
  replaceMeta("property", "og:image", image);
  replaceMeta("property", "og:type", type);
  replaceMeta("name", "twitter:title", title);
  replaceMeta("name", "twitter:description", description);
  replaceMeta("name", "twitter:image", image);

  out = out.replace(
    /<link rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
  );

  if (jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
    out = out.replace("</head>", `    ${script}\n  </head>`);
  }

  if (body) {
    out = out.replace(
      '<div id="app"></div>',
      `<div id="app"></div>\n    <noscript>\n      <main style="max-width:720px;margin:2rem auto;padding:1rem;font-family:system-ui">\n        ${body}\n      </main>\n    </noscript>`,
    );
  }
  return out;
}

function writeRoute(routePath, html) {
  const clean = routePath.replace(/^\//, "").replace(/\/$/, "");
  const dir = join(dist, clean);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf8");
}

async function main() {
  const templatePath = join(dist, "index.html");
  if (!existsSync(templatePath)) {
    console.error("[prerender] dist/index.html missing — run vite build first");
    process.exit(1);
  }
  const template = readFileSync(templatePath, "utf8");
  const [projects, blogs] = await Promise.all([
    fetchList("projects", "projects"),
    fetchList("blog", "blogs"),
  ]);

  let count = 0;
  for (const p of projects.filter((x) => x?.slug)) {
    const url = absolute(`/archives/${p.slug}`);
    const title = `${p.title} | Uhai Mong`;
    const description = p.description || "Project by Uhai Mong";
    const image = absolute(p.thumbnail || "/images/UhaiMongProfilePicture.jpg");
    const html = inject(template, {
      title,
      description,
      url,
      image,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: p.title,
        description,
        image,
        url,
      },
      body: `<h1>${escapeHtml(p.title)}</h1><p>${escapeHtml(description)}</p>`,
    });
    writeRoute(`/archives/${p.slug}`, html);
    count++;
  }

  for (const b of blogs.filter((x) => x?.slug)) {
    const url = absolute(`/blog/${b.slug}`);
    const title = `${b.title} | Uhai Mong`;
    const description = b.excerpt || "Article by Uhai Mong";
    const image = absolute(b.thumbnail || "/images/UhaiMongProfilePicture.jpg");
    const html = inject(template, {
      title,
      description,
      url,
      image,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: b.title,
        description,
        image,
        datePublished: b.publishedAt || b.createdAt,
        mainEntityOfPage: url,
      },
      body: `<h1>${escapeHtml(b.title)}</h1><p>${escapeHtml(description)}</p>`,
    });
    writeRoute(`/blog/${b.slug}`, html);
    count++;
  }

  // Static marketing routes also get dedicated folders for cleaner URLs
  for (const path of ["/about", "/blog", "/contact", "/archives"]) {
    const titles = {
      "/about": "About | Uhai Mong",
      "/blog": "Blog | Uhai Mong",
      "/contact": "Contact | Uhai Mong",
      "/archives": "All Work | Uhai Mong",
    };
    writeRoute(
      path,
      inject(template, {
        title: titles[path],
        description:
          "Full stack developer building clean, high-performance web applications.",
        url: absolute(path),
        image: absolute("/images/UhaiMongProfilePicture.jpg"),
      }),
    );
    count++;
  }

  console.log(`[prerender] Wrote ${count} HTML shells into dist/`);
}

main();
