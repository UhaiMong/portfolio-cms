import { useEffect } from "preact/hooks";
import { SITE, absoluteUrl } from "../config/site";

const ensureMeta = (attr, key, content) => {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const ensureLink = (rel, href) => {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Sets document title + description + Open Graph / Twitter / canonical.
 * Social crawlers that don't run JS still see index.html defaults;
 * Googlebot does execute JS and will pick these up after render.
 */
export default function Seo({
  title,
  description = SITE.description,
  path = "/",
  image = SITE.image,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title
    ? title.includes(SITE.name)
      ? title
      : `${title} | ${SITE.name}`
    : SITE.title;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = fullTitle;

    ensureMeta("name", "description", description);
    ensureMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );

    ensureMeta("property", "og:title", fullTitle);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:type", type);
    ensureMeta("property", "og:url", url);
    ensureMeta("property", "og:image", imageUrl);
    ensureMeta("property", "og:site_name", SITE.name);
    ensureMeta("property", "og:locale", SITE.locale);

    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", fullTitle);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", imageUrl);
    if (SITE.twitter) ensureMeta("name", "twitter:site", SITE.twitter);

    ensureLink("canonical", url);

    document.getElementById("page-jsonld")?.remove();
    let script;
    if (jsonLdStr) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      script.text = jsonLdStr;
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
  }, [fullTitle, description, url, imageUrl, type, noindex, jsonLdStr]);

  return null;
}

export function personJsonLd(bio) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: bio?.name || SITE.name,
    url: SITE.url,
    image: absoluteUrl(bio?.avatar || SITE.image),
    jobTitle: bio?.title || SITE.jobTitle,
    email: bio?.email || SITE.email,
    sameAs: (bio?.socialLinks || [])
      .map((s) => s.url)
      .filter(Boolean)
      .concat(SITE.sameAs)
      .filter((v, i, a) => a.indexOf(v) === i),
    description: bio?.about || SITE.description,
  };
}

export function blogPostingJsonLd(blog) {
  if (!blog) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || SITE.description,
    image: absoluteUrl(blog.thumbnail || SITE.image),
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${blog.slug}`),
    keywords: blog.tags?.join(", "),
  };
}

export function creativeWorkJsonLd(project) {
  if (!project) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description || SITE.description,
    image: absoluteUrl(project.thumbnail || SITE.image),
    url: absoluteUrl(`/archives/${project.slug}`),
    dateCreated: project.startDate || project.createdAt,
    dateModified: project.endDate || project.updatedAt,
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    keywords: [...(project.techStack || []), ...(project.tags || [])].join(
      ", ",
    ),
  };
}
