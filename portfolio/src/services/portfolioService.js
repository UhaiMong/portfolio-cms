import api from "./api";

// Banner
export const getBanner = async () => {
  const res = await api.get("/banner");
  return res.data.data;
};

// Bio
export const getBio = async () => {
  const res = await api.get("/bio");
  return res.data.data;
};
// Context
export const getContext = async () => {
  const res = await api.get("/context");
  return res.data.data;
};

// Projects
export const getProjects = async (params = {}) => {
  const res = await api.get("/projects", { params });
  return res.data.data;
};

export const getProjectBySlug = async (slug) => {
  const res = await api.get(`/projects/${slug}`);
  return res.data.data;
};

// Blog
export const getBlogs = async (params = {}) => {
  const res = await api.get("/blog", { params });
  return res.data.data || res.data;
};

export const getBlogBySlug = async (slug) => {
  const res = await api.get(`/blog/${slug}`);
  return res.data.data || res.data;
};

export const getBlogTags = async () => {
  const res = await api.get("/blog/tags");
  return res.data.data;
};

// Resume
export const getActiveResume = async () => {
  const res = await api.get("/resume");
  return res.data.data;
};

// Contact
export const submitContact = async (formData) => {
  const res = await api.post("/contact", formData);
  return res.data;
};
