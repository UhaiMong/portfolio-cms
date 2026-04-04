// Date formatting
export const formatDate = (dateStr, options = {}) => {
  const defaults = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", {
    ...defaults,
    ...options,
  });
};

export const formatShortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

// Text helpers
export const truncate = (str, max = 120) =>
  str && str.length > max ? str.slice(0, max).trimEnd() + "..." : str;

export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Read time
export const calcReadTime = (content = "") => {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// File size
export const formatSize = (kb) =>
  kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

// Availability label
export const availabilityLabel = (status) =>
  ({
    available: {
      label: "Available for work",
      color: "text-green-500",
      dot: "bg-green-500",
    },
    busy: {
      label: "Currently busy",
      color: "text-yellow-500",
      dot: "bg-yellow-500",
    },
    "not-available": {
      label: "Not available",
      color: "text-red-500",
      dot: "bg-red-500",
    },
  })[status] || {
    label: "Unknown",
    color: "text-gray-400",
    dot: "bg-gray-400",
  };

// Scroll to top
export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

// Clamp number
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
