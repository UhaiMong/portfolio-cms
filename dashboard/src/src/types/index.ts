//  Auth
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  avatar?: string;
  lastLogin?: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ── Project
export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: string;
  status: "completed" | "in-progress" | "archived";
  featured: boolean;
  isPrivate: boolean;
  liveUrl?: string;
  githubUrl?: string;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Blog
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  tags: string[];
  category: string;
  status: "published" | "draft";
  featured: boolean;
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Bio
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
export interface Skill {
  name: string;
  level: number;
  category: string;
}
export interface Experience {
  _id?: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  current: boolean;
}
export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  grade?: string;
}
export interface Bio {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  about: string;
  avatar: string;
  email: string;
  phone?: string;
  location: string;
  availability: "available" | "busy" | "not-available";
  socialLinks: SocialLink[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

// Banner
export interface CTAButton {
  label: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
}
export interface Banner {
  _id: string;
  greeting: string;
  name: string;
  typingTexts: string[];
  description: string;
  bannerURL: string;
  ctaButtons: CTAButton[];
  isActive: boolean;
  createdAt: string;
}

//  Resume
export interface Resume {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  version: string;
  isActive: boolean;
  downloadCount: number;
  uploadedAt: string;
  createdAt: string;
}

// Contact
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  ipAddress?: string;
  createdAt: string;
}

// Media
export interface Media {
  _id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  publicId: string;
  fileType: "image" | "pdf" | "other";
  mimeType: string;
  fileSize: number;
  folder: string;
  usedIn?: string;
  createdAt: string;
}

// Shared
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
