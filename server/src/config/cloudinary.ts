import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic image storage (projects, blog, banner, bio)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, "_");
    return {
      folder: "portfolio-cms/images",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      public_id: `${baseName}_${Date.now()}`,
    };
  },
});

// Resume PDF storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, "_");

    return {
      folder: "portfolio-cms/resume",
      resource_type: "raw",
      format: "pdf",
      public_id: `${baseName}_${Date.now()}.pdf`,
      allowed_formats: ["pdf"],
    };
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadResume = multer({ storage: resumeStorage });
export { cloudinary };
