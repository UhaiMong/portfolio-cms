import api, { cachedGet } from "./api";

export const getBanner = () => cachedGet("/banner", null, { key: "banner" });
export const getBio = () => cachedGet("/bio", null, { key: "bio" });
export const getContext = () => cachedGet("/context", null, { key: "context" });

export const getProjects = async (params = {}) =>
  cachedGet("/projects", params, {
    key: `projects:${JSON.stringify(params)}`,
    ttl: 2 * 60 * 1000,
  });

export const getProjectStats = () =>
  cachedGet("/projects/stats", null, { key: "project-stats" });

export const getProjectBySlug = (slug) =>
  cachedGet(`/projects/${slug}`, null, {
    key: `project:${slug}`,
    ttl: 2 * 60 * 1000,
  });

export const getArchiveDetailsBySlug = (slug) =>
  cachedGet(`/projects/archive/${slug}`, null, {
    key: `archive:${slug}`,
    ttl: 2 * 60 * 1000,
  });

export const getBlogs = (params = {}) =>
  cachedGet("/blog", params, {
    key: `blogs:${JSON.stringify(params)}`,
    ttl: 2 * 60 * 1000,
  });

export const getBlogBySlug = (slug) =>
  cachedGet(`/blog/${slug}`, null, {
    key: `blog:${slug}`,
    ttl: 2 * 60 * 1000,
  });

export const getBlogTags = () => cachedGet("/blog/tags", null, { key: "blog-tags" });

export const getActiveResume = () =>
  cachedGet("/resume", null, { key: "resume" });

export const submitContact = async (formData) => {
  const res = await api.post("/contact", formData);
  return res.data;
};
