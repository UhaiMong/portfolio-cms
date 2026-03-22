"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.uploadResume = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Generic image storage (projects, blog, banner, bio)
const imageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const baseName = path_1.default.parse(file.originalname).name.replace(/\s+/g, "_");
        return {
            folder: "portfolio-cms/images",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
            public_id: `${baseName}_${Date.now()}`,
        };
    },
});
// Resume PDF storage
const resumeStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const baseName = path_1.default.parse(file.originalname).name.replace(/\s+/g, "_");
        return {
            folder: "portfolio-cms/resume",
            resource_type: "raw",
            format: "pdf",
            public_id: `${baseName}_${Date.now()}.pdf`,
            allowed_formats: ["pdf"],
        };
    },
});
exports.uploadImage = (0, multer_1.default)({ storage: imageStorage });
exports.uploadResume = (0, multer_1.default)({ storage: resumeStorage });
