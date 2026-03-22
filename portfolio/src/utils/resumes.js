// Utility helper — add this anywhere (e.g. utils/resume.ts)
export const getPdfUrl = (url) => (url.endsWith(".pdf") ? url : `${url}.pdf`);
