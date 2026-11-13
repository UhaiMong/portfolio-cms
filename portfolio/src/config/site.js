export const SITE = {
  name: "Uhai Mong",
  title: "Uhai Mong | Full Stack Developer",
  description:
    "Full stack developer building clean, high-performance web applications with React, Node.js, and modern UI. Available for freelance and full-time roles.",
  url: import.meta.env.VITE_SITE_URL || "https://uhaimong-portfolio.vercel.app",
  locale: "en_US",
  twitter: "@Uhaimongmarma2",
  image: "/images/UhaiMongProfilePicture.jpg",
  email: "uhaimong.me@gmail.com",
  jobTitle: "Full Stack Developer",
  sameAs: [
    "https://github.com/UhaiMong",
    "https://www.linkedin.com/in/uhai-mong/",
    "https://x.com/Uhaimongmarma2",
  ],
};

export const absoluteUrl = (path = "/") => {
  if (!path) return SITE.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
};
